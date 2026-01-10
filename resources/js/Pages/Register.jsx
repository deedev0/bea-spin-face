import { useForm } from '@inertiajs/react';
import BootstrapLayout from '@/Layouts/BootstrapLayout'

function Register() {
  const { data, setData, post, processing, errors } = useForm({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    image: null,
  });

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
      <h3 className="mb-3 text-center">Mohon Isi Data Dengan Benar untuk Pengundian Hadiah</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Nama Lengkap <span className="text-danger">*</span></label>
          <input type="text" className="form-control" name="fullName" id="fullName" placeholder="Wawan Gunawan ..." autoFocus value={data.fullName} onChange={e => setData('fullName', e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="company" className="form-label">Perusahan <span className="text-danger">*</span></label>
          <input type="text" className="form-control" name="company" id="company" placeholder="PT. ABCD" value={data.company} onChange={e => setData('company', e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
          <input type="email" className="form-control" name="email" id="email" placeholder="email@gmail.com" value={data.email} onChange={e => setData('email', e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">No HP <span className="text-danger">*</span></label>
          <input type="tel" className="form-control" name="phone" id="phone" placeholder="0896 ..." value={data.phone} onChange={e => setData('phone', e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Foto <span className="text-danger">*</span></label>
          <input className="form-control" type="file" onChange={e => setData('image', e.target.files[0])} id="image" name="image" accept="image/*" capture="environment" required />
          {errors.image && <div className="text-danger">{errors.image}</div> }
        </div>
        <small className="text-secondary fw-light">* Pastikan semua data benar untuk mempermudah identifikasi saat pengundian hadiah</small>
        <div className="d-grid gap-2 mt-3">
          <button type="submit" className="btn btn-success" disabled={processing}>{processing ? 'Mengirim...' : 'Kirim'}</button>
        </div>
      </form>
    </div>
    </>
  )
}

export default Register;
