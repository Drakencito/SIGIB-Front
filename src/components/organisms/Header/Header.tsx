import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    Home,
    Package,
    FileText,
    Ticket,
    User,
    LogOut,
    ChevronDown,
    Menu,
    X,
} from 'lucide-react'
import { useAuth } from '../../../lib/store/AuthContext'
import './Header.css'

const NAV_ITEMS = [
    { to: '/inicio', icon: Home, label: 'Inicio' },
    { to: '/inventarios', icon: Package, label: 'Inventarios' },
    { to: '/solicitudes', icon: FileText, label: 'Solicitudes' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
]

export default function Header() {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()
    const [userOpen, setUserOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const dropRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setUserOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <>
            <header className="topbar">
                <div className="topbar-brand">
                    <img src="/banner.png" alt="SIGIB" className="topbar-logo" />
                    <div className="topbar-brand-divider" />
                    <div className="topbar-brand-text">
                        <span className="topbar-sigib">SIGIB</span>
                        <span className="topbar-sub">
                            Sistema Integral de Gestión&nbsp;
                            <strong className="topbar-sub-imss">IMSS BIENESTAR</strong>
                        </span>
                    </div>
                </div>

                <nav className="topbar-nav" aria-label="Navegación principal">
                    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `topbar-nav-item${isActive ? ' active' : ''}`
                            }
                        >
                            <Icon size={17} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="topbar-actions">
                    <div className="topbar-user" ref={dropRef}>
                        <button
                            type="button"
                            className="topbar-user-btn"
                            onClick={() => setUserOpen((v) => !v)}
                            aria-expanded={userOpen}
                            aria-label="Menú de usuario"
                        >
                            <div className="topbar-avatar">
                                <User size={16} />
                            </div>
                            <span className="topbar-username">
                                {usuario?.nombre?.split(' ')[0] ?? 'Usuario'}
                            </span>
                            <ChevronDown
                                size={15}
                                className={`topbar-chevron${userOpen ? ' open' : ''}`}
                            />
                        </button>

                        {userOpen && (
                            <div className="topbar-dropdown">
                                <div className="topbar-dropdown-info">
                                    <strong>{usuario?.nombre ?? 'Usuario'}</strong>
                                    <span>{usuario?.rol === 'admin' ? 'Administrador' : 'Unidad médica'}</span>
                                </div>
                                <div className="topbar-dropdown-divider" />
                                <button
                                    type="button"
                                    className="topbar-dropdown-item danger"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={15} />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="topbar-hamburger"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>

            {mobileOpen && (
                <div className="topbar-mobile-menu" role="navigation">
                    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `topbar-mobile-item${isActive ? ' active' : ''}`
                            }
                            onClick={() => setMobileOpen(false)}
                        >
                            <Icon size={19} />
                            {label}
                        </NavLink>
                    ))}
                    <div className="topbar-mobile-divider" />
                    <button
                        type="button"
                        className="topbar-mobile-item danger"
                        onClick={handleLogout}
                    >
                        <LogOut size={19} />
                        Cerrar sesión
                    </button>
                </div>
            )}
        </>
    )
}