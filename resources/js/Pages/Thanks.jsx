import BootstrapLayout from '@/Layouts/BootstrapLayout'
// resources/js/app.jsx
import 'bootstrap-icons/font/bootstrap-icons.css';

function Thanks() {
  return (
    <>
      <nav className="navbar bg-info text-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 text-white">Konfirmasi Kehadiran BEA Gathering 2026</span>
        </div>
      </nav>

      <div className="container shadow-lg mt-3 p-3 bg-light fw-semibold text-center">
        <h3 className="mb-3 text-center">Terimakasih data kehadiran anda sudah terkirim</h3>

        <a 
          href="https://www.instagram.com/beajawabarat/" 
          target="_blank" 
          className="btn text-white fw-bold d-inline-flex align-items-center justify-content-center mb-3" 
          style={{
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            borderRadius: '12px',
            padding: '12px 30px',
            border: 'none',
            textDecoration: 'none'
          }}
        >
          {/* Ikon Instagram sekarang akan muncul */}
          <i className="bi bi-instagram fs-4 me-2"></i> 
          Follow Kami di Instagram
        </a>
      </div>
    </>
  )
}

export default Thanks;
