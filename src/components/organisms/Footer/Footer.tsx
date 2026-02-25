import { forwardRef } from 'react'
import './Footer.css'

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer className="footer" ref={ref}>
      <div className="footer-img-left">
        <img src="/Logo.png" alt="" />
      </div>
      <p className="footer-copy">
        © 2026 · IMSS BIENESTAR · Todos los derechos reservados
      </p>
      <div className="footer-img-right">
        <img src="/imagotipo.png" alt="" />
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'
export default Footer
