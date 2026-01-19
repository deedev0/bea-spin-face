import { useEffect, useState } from 'react';
import CheckGuest from './CheckGuest';
import { Link, router, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2'; // 1. Import SweetAlert
import 'bootstrap-icons/font/bootstrap-icons.css';
import DisableGuest from './DisableGuest';
import axios from 'axios';


export default function ShowAll({ guests, grandprize }) {

  const handleExport = () => {
      axios({
          url: 'https://bea-spin.my.id/guest/export', // Sesuaikan URL API
          method: 'GET',
          responseType: 'blob', // Penting: memberitahu axios ini adalah file
      }).then((response) => {
          // Membuat link download temporary
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'daftar_tamu.xlsx');
          document.body.appendChild(link);
          link.click();
          
          // Bersihkan link setelah download
          link.parentNode.removeChild(link);
      }).catch(error => {
          console.error('Export failed', error);
      });
  };

  // Gunakan di Button
  // <button onClick={handleExport}>Export ke Excel</button>

  const [manualIds, setManualIds] = useState(() => {
    return JSON.parse(localStorage.getItem('manualWin')) || [];
  });

  const toggleManualWinner = (id) => {
    let updatedIds = [...manualIds];
    
    if (updatedIds.includes(id)) {
        // Jika sudah ada, hapus (Cancel)
        updatedIds = updatedIds.filter(item => item !== id);
    } else {
        // Jika belum ada, tambahkan ke antrean
        updatedIds.push(id);
    }

    setManualIds(updatedIds);
    localStorage.setItem('manualWin', JSON.stringify(updatedIds));  
  };
  
  const { data, setData, patch, processing } = useForm({
    is_grandprize: grandprize.is_grandprize ?? false,
  });

  const [duration, setDuration] = useState(localStorage.getItem('durationSpin') || "4000");

  const handleDurationChange = (e) => {
    const newValue = e.target.value;
    setDuration(newValue); // Update state React
    localStorage.setItem('durationSpin', newValue);
  };

  const toggleGrandprize = () => {
      const newValue = !data.is_grandprize;
      setData('is_grandprize', newValue);
      router.patch(`/grandprize/${grandprize.id}`, {
        is_grandprize: newValue,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          setData('is_grandprize', !data.is_grandprize)
        },
        onError: () => setData('is_grandprize', !newValue),
      })
  }

  // Fungsi Konfirmasi Hapus
  const confirmDelete = (id, fullName) => {
    Swal.fire({
      title: 'Hapus Peserta?',
      text: `Apakah Anda yakin ingin menghapus ${fullName}? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Jalankan penghapusan jika user klik Ya
        router.post(`/guest/${id}`, {
          _method: 'delete',           
          tokenAdmin: 'adadeh123',
          
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              title: 'Terhapus!',
              text: 'Data peserta berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('tokenSpin')) {
      router.visit('/guest/create');
    }
  }, []);
    
  return (
    <>
      <nav className="navbar bg-secondary text-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 text-white">Admin Dashboard</span>
        </div>
      </nav>

      <div className="container mt-3">

        <div className="row mb-3">
          <div className="col-lg-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" disabled={processing} checked={data.is_grandprize} onChange={toggleGrandprize} id="grandprize" />
              <label className="form-check-label text-light" htmlFor="grandprize">
                Grandprize
              </label>
            </div>
          </div>

          <div className="col-lg-2">
            <select class="form-select" 
              value={duration} 
              onChange={handleDurationChange}
            >
              <option value={''} disabled>Duration</option>
              <option value="4000">4 Detik</option>
              <option value="10000">10 Detik</option>
              <option value="15000">15 Detik</option>
            </select>
          </div>

          <div className="col-lg-2">
            <button className='btn btn-success' onClick={handleExport}>Export ke Excel</button>
          </div>

        </div>
        
        <table className="table table-dark table-striped p-3">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nama</th>
              <th scope="col">Perusahaan</th>
              <th scope="col">Menang</th>
              <th scope="col">Member</th>
              <th scope="col" className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <tr>
                <th scope="row">{ index + 1 }</th>
                <td>{guest.fullName} {guest.is_member ? <span className='text-info'>(Umum)</span> : ''}</td>
                <td>{guest.company}</td>
                <CheckGuest key={guest.id} guest={guest}  />
                <td className='d-flex gap-2 justify-content-center'>
                  <button 
                    onClick={() => confirmDelete(guest.id, guest.fullName)}
                    className="btn btn-danger btn-sm"
                    title="Hapus Peserta"
                  >
                    <i className="bi bi-trash"></i> Hapus
                  </button>
                  <button 
                    onClick={() => toggleManualWinner(guest.id)}
                    className={`px-3 py-1 rounded text-sm font-bold ${
                        manualIds.includes(guest.id) 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                      {manualIds.includes(guest.id) 
                          ? `Antrean #${manualIds.indexOf(guest.id) + 1}` 
                          : 'Setting'}
                  </button>
                  <DisableGuest key={`disable-${guest.id}`} guest={guest} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}