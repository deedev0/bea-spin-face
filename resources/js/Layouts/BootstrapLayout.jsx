import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default function BootstrapLayout({ children }) {
  return (
    <div className="container mt-4 bg-dark">
      {children}
    </div>
  )
}
