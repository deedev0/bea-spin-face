import { useEffect, useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import confetti from 'canvas-confetti';

function Spin({ guests: initialGuests, winners: initialWinners, isGrandprizeActive }) {
  const [guests, setGuests] = useState(initialGuests);
  const [winners, setWinners] = useState(initialWinners);
  const [current, setCurrent] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const spinAudioRef = useRef(null);

  const totalSpin = localStorage.getItem('durationSpin') == 4000 ? 100 : (localStorage.getItem('durationSpin') == 10000 ? 200 : 300);


  const fireConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  const playSpinSound = () => {
    if (!spinAudioRef.current) return;

    spinAudioRef.current.currentTime = 0; // reset
    spinAudioRef.current.play();
  };


  const handleWinner = () => {
    // logic spin / tentukan pemenang
    fireConfetti();
  };



  useEffect(() => {
    if (!localStorage.getItem('tokenSpin')) {
      router.visit('/guest/create');
    }
    const audioName = localStorage.getItem('durationSpin') == 4000 ? '/sfx/cam.mp3': (localStorage.getItem('durationSpin') == 10000 ? '/sfx/cam10.mp3' : '/sfx/cam15.mp3')
    spinAudioRef.current = new Audio(audioName);
    spinAudioRef.current.preload = 'auto';
    spinAudioRef.current.volume = 0.8;
  }, []);

  function spin(totalSpins = totalSpin || 100, duration = parseInt(localStorage.getItem('durationSpin')) || 4000) {
    if (spinning || guests.length === 0) return

    // --- LOGIKA FILTER KANDIDAT ---
    // Jika mode grandprize aktif, saring hanya yang is_guest nya true
    // Jika tidak, gunakan semua guests yang ada
    const candidates = isGrandprizeActive 
      ? guests.filter(g => g.is_guest === 1 || g.is_guest === true) 
      : guests;

    if (candidates.length === 0) {
      alert("Tidak ada kandidat untuk diundi!");
      return;
    }

    playSpinSound()

    setSpinning(true)
    let i = 0
    const interval = duration / totalSpins

    const timer = setInterval(() => {
      const rand = candidates[Math.floor(Math.random() * candidates.length)]
      setCurrent(rand)
      i++

      if (i >= totalSpins) {
        clearInterval(timer)
        setSpinning(false)

        const manualData = localStorage.getItem('manualWin');
        let targetWinner = rand;

        if (manualData) {
            try {
              let ids = JSON.parse(manualData); // Format: [10, 25, 5]

              if (Array.isArray(ids) && ids.length > 0) {
                // 1. Ambil ID pertama dari antrean
                const nextId = ids[0]; 
                
                // 2. Cari datanya di kandidat
                const foundManual = candidates.find(c => c.id === nextId);

                if (foundManual) {
                  targetWinner = foundManual;
                  
                  // 3. Hapus ID yang sudah menang dari antrean
                  const remainingIds = ids.slice(1); 
                  
                  if (remainingIds.length > 0) {
                    localStorage.setItem('manualWin', JSON.stringify(remainingIds));
                  } else {
                    localStorage.removeItem('manualWin'); // Habiskan jika kosong
                  }
                }
              }
            } catch (e) {
              console.error("Format manualWin salah", e);
            }
          }

        setCurrent(targetWinner);
        handleWinner()
        selectWinner(targetWinner)
      }
    }, interval)
  }

  async function selectWinner(guest) {
    router.post('/spin/winner', {
      id: guest.id,
    }, {
      onSuccess: () => {
        setGuests(prev => prev.filter(g => g.id !== guest.id));
        setWinners(prev => [guest, ...prev]);
      }
    });
  }

  return (
    <>
      <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('/img/background.jpg')" }}>
        <h3 className="p-2 mx-auto text-9xl font-bold text-center text-white bg-black ">Undian Doorprize Gathering BEA JABAR 2026</h3>
        <div className="flex min-h-screen gap-2 p-2">

          <div className="flex-1">
            <div className="flex flex-col p-2 mx-auto text-2xl font-bold text-center text-white">
              <h3 className="mb-4 text-3xl">Peserta</h3>
              <div className="grid w-full grid-cols-6 gap-2 p-2 overflow-hidden border-2 border-sky-500 rounded-xl" id="guestList">

                {guests.map(g => (
                  <div key={g.id} className="w-full h-16 bg-sky-500">
                    {/* <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(/storage/${g.image})` }}></div> */}
                    <img 
                      src={`/storage/${g.image}`} 
                      loading="lazy" 
                      className="w-full h-full object-cover shadow-sm"
                      alt=""
                      // Gunakan placeholder warna jika gambar belum termuat
                      onError={(e) => e.target.src = '/img/placeholder.jpg'}
                    />
                  </div>
                ))}
                
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col">
              <h3 className="mx-auto mt-3 mb-3 text-3xl font-bold text-center text-white">Acak Pemenang</h3>
              <div className="w-full mx-auto text-center h-116 bg-sky-500 rounded-xl">
                <div id="randomImage" className="rounded-xl w-full h-full bg-cover bg-center" style={{ backgroundImage: current ? `url(/storage/${current.image})` : "url('/img/random.jpg')" }}></div>
              </div>
              <h2 id="randomName" className="mx-auto mt-3 text-2xl font-bold text-center text-white text-capitalize">{current?.fullName || '???'}</h2>
              <h3 id="randomCompany" className="mx-auto mt-3 mb-5 text-5xl text-center text-white text-uppercase">{current?.company || '???'}</h3>
              <button onClick={() => spin()} disabled={spinning} className="w-64 p-2 mx-auto font-bold text-center text-white rounded-md shadow-md hover:bg-sky-600 bg-sky-500">{spinning ? 'Mengacak...' : 'Acak'}</button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col p-2 mx-auto text-2xl font-bold text-center text-white">
              <h3 className="mb-4 text-3xl">Pemenang</h3>
              {winners.length ? 
                <div className="grid grid-cols-6 gap-2 p-2 border-2 border-sky-500 rounded-xl" id="winnerList">

                  {winners.map(w => (
                    <div key={w.id} className="w-full h-16 bg-sky-500">
                      {/* <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(/storage/${w.image})` }}></div> */}
                      <img 
                        src={`/storage/${w.image}`} 
                        loading="lazy" 
                        className="w-full h-full object-cover shadow-sm"
                        alt=""
                        // Gunakan placeholder warna jika gambar belum termuat
                        onError={(e) => e.target.src = '/img/placeholder.jpg'}
                      />
                    </div>
                  ))}

                </div> : ''
              }
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Spin;