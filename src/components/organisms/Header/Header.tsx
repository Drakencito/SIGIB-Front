import './Header.css'


function Header() {
  return (
    <header className="header">
        <div className="header-left">
            <img src="/banner.png" alt="" />
        </div>
        <div className="header-brand">
            <span className="header-sigib">SIGIB</span>
            <span className="header-sub">Sistema de Gestión Integral - IMMS Bienestar</span>
        </div>
        <div className="header-right">
            <img src="/Logo.png" alt="" />
        </div>
    </header>
  )
}

export default Header
