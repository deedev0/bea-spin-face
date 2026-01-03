import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

function Spin({ guests: initialGuests, winners: initialWinners }) {
  const [guests, setGuests] = useState(initialGuests);
  const [winners, setWinners] = useState(initialWinners);
  const [current, setCurrent] = useState(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('tokenSpin')) {
      router.visit('/guest/create');
    }
  }, []);

  function spin(totalSpins = 100, duration = 6000) {
    if (spinning || guests.length === 0) return

    setSpinning(true)
    let i = 0
    const interval = duration / totalSpins

    const timer = setInterval(() => {
      const rand = guests[Math.floor(Math.random() * guests.length)]
      setCurrent(rand)
      i++

      if (i >= totalSpins) {
        clearInterval(timer)
        setSpinning(false)
        selectWinner(rand)
      }
    }, interval)
  }

  async function selectWinner(guest) {
    router.post('/spin/winner', {
      id: guest.id,
    }, {
      onSuccess: () => {
        setGuests(prev => prev.filter(g => g.id !== guest.id));
        setWinners(prev => [...prev, guest]);
      }
    });
  }

  return (
    <>
      <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('/img/background.jpg')" }}>
        <h1 className="p-2 mx-auto text-5xl font-bold text-center text-white ">Undian Doorprize Gathering BEA JABAR 2026</h1>
        <div className="flex min-h-screen gap-2 p-2">

          <div className="flex-1">
            <div className="flex flex-col p-2 mx-auto text-2xl font-bold text-center text-white">
              <h1 className="mb-5 text-3xl">Peserta</h1>
              <div className="grid w-full grid-cols-6 gap-2 p-2 overflow-hidden border-2 border-sky-500 rounded-xl" id="guestList">

                {guests.map(g => (
                  <div key={g.id} className="w-full h-16 bg-sky-500">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(/storage/${g.image})` }}></div>
                  </div>
                ))}
                
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col">
              <h1 className="mx-auto mt-3 mb-5 text-3xl font-bold text-center text-white">Acak Pemenang</h1>
              <div className="w-full mx-auto text-center h-90 bg-sky-500 rounded-xl">
                <div id="randomImage" className="rounded-xl w-full h-full bg-cover bg-center" style={{ backgroundImage: current ? `url(/storage/${current.image})` : "url('/img/random.jpg')" }}></div>
              </div>
              <h2 id="randomName" className="mx-auto mt-3 text-2xl font-bold text-center text-white">{current?.fullName || '???'}</h2>
              <h3 id="randomCompany" className="mx-auto mt-3 mb-5 text-5xl text-center text-white">{current?.company || '???'}</h3>
              <button onClick={() => spin()} disabled={spinning} className="w-64 p-2 mx-auto font-bold text-center text-white rounded-md shadow-md hover:bg-sky-600 bg-sky-500">{spinning ? 'Mengacak...' : 'Acak'}</button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col p-2 mx-auto text-2xl font-bold text-center text-white">
              <h1 className="mb-5 text-3xl">Pemenang</h1>
              {winners.length ? 
                <div className="grid grid-cols-6 gap-2 p-2 border-2 border-sky-500 rounded-xl" id="winnerList">

                  {winners.map(w => (
                    <div key={w.id} className="w-full h-16 bg-sky-500">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(/storage/${w.image})` }}></div>
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