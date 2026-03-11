import { Menu } from 'lucide-react'
import './Header.css'

interface HeaderProps {
    onMenuClick?: () => void
}

function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-left">
                <button
                    className="header-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Abrir menú"
                >
                    <Menu size={22} />
                </button>
                <img src="/banner.png" alt="" />
            </div>
            <div className="header-brand">
                <span className="header-sigib">SIGIB</span>
                <span className="header-sub">Sistema de Gestión Integral - IMSS Bienestar</span>
            </div>
            <div className="header-right">
                <img src="/Logo.png" alt="" />
            </div>
        </header>
    )
}

export default Header
