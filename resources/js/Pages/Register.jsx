import { useForm } from '@inertiajs/react';
import BootstrapLayout from '@/Layouts/BootstrapLayout'
import imageCompression from 'browser-image-compression';
import { useState } from 'react';

function Register() {
  const { data, setData, post, processing, errors } = useForm({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    is_guest: true,
    image: null,
  });

  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    setIsCompressing(true);

    // Konfigurasi Kompresi
    const options = {
        maxSizeMB: 0.4,          // Maksimal ukuran file 500KB
        maxWidthOrHeight: 800,   // Resize ke maksimal 800px (lebar/tinggi)
        useWebWorker: true,
        fileType: 'image/jpeg'   // Paksa jadi jpeg agar lebih ringan
    };

    try {
        console.log(`Ukuran awal: ${imageFile.size / 1024 / 1024} MB`);
        
        // Proses Kompresi
        const compressedFile = await imageCompression(imageFile, options);
        
        console.log(`Ukuran baru: ${compressedFile.size / 1024 / 1024} MB`);

        // Simpan file hasil kompresi ke state Inertia
        setData('image', compressedFile); 

    } catch (error) {
        console.error("Gagal mengompres gambar:", error);
    } finally {
      setIsCompressing(false); // Selesai loading kompresi
    }
  };

  function submit(e) {
    e.preventDefault() 
    post('/guest', {
      forceFormData: true,
    });
  }

  return (
    <>
    <nav className="navbar bg-info text-light">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1 text-white">Konfirmasi Kehadiran BEA Gathering 2026</span>
      </div>
    </nav>

    <div className="container shadow-lg mt-3 p-3 bg-light fw-semibold">
      <h3 className="mb-3 text-center">Mohon Isi Data dengan Benar untuk Pengundian Hadiah</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Nama Lengkap <span className="text-danger">*</span></label>
          <input type="text" className="form-control" name="fullName" id="fullName" autoFocus value={data.fullName} onChange={e => setData('fullName', e.target.value)} required />
          {errors.fullName && <div className="text-danger">{errors.fullName}</div> }
        </div>
        <div className="mb-3">
          <label htmlFor="company" className="form-label">Perusahaan / Properti <span className="text-danger">*</span></label>
          <input type="text" className="form-control" name="company" id="company" value={data.company} onChange={e => setData('company', e.target.value)} required />
          {errors.company && <div className="text-danger">{errors.company}</div> }
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
          <input type="email" className="form-control" name="email" id="email" placeholder="youremail@gmail.com" value={data.email} onChange={e => setData('email', e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">No HP <span className="text-danger">*</span></label>
          <input type="tel" className="form-control" name="phone" id="phone" placeholder="0811..." value={data.phone} onChange={e => setData('phone', e.target.value)} required />
        </div>

        <div className="d-flex gap-3 mb-3">
          <div className="form-check">
            <input className="form-check-input" type="radio" name="is_guest" id="radioDefault1" 
              checked={data.is_guest === true}
              onChange={() => setData('is_guest', true)} />
            <label className="form-check-label" htmlFor="radioDefault1">
              Peserta
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="is_guest" id="radioDefault2"
              checked={data.is_guest === false}
              onChange={() => setData('is_guest', false)} />
            <label className="form-check-label" htmlFor="radioDefault2">
              Vendor
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Foto <span className="text-danger">*</span></label>
          {/* AREA PREVIEW */}
          {data.image && (
            <div className="mb-2 text-center">
              <img 
                src={URL.createObjectURL(data.image)} 
                alt="Preview" 
                className="img-thumbnail"
                style={{ maxHeight: '200px' }} 
              />
            </div>
          )}
          <input className="form-control" type="file" onChange={handleFileChange} id="image" name="image" accept="image/*" capture="environment" required />
          {isCompressing && <div className="text-info small mt-1 animate-pulse italic">Sedang mengoptimalkan gambar...</div>}
          {errors.image && <div className="text-danger">{errors.image}</div> }
        </div>
        <small className="text-secondary fw-light">* Pastikan semua data benar untuk mempermudah identifikasi saat pengundian hadiah</small>
        <div className="d-grid gap-2 mt-3">
          <button type="submit" className="btn btn-info text-light" disabled={processing}>{processing ? 'Mengirim...' : 'Kirim'}</button>
        </div>
      </form>
    </div>
    </>
  )
}

export default Register;
