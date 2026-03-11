import { useState, forwardRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Package, FileText, Ticket, Home, Search, LogOut, User, X } from 'lucide-react'
import { useAuth } from '../../../lib/store/AuthContext'
import './Sidebar.css'

interface Props {
  topPx: number
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const items = [
  { to: '/inicio', icon: Home, label: 'Inicio' },
  { to: '/inventarios', icon: Package, label: 'Gestión de Inventarios' },
  { to: '/solicitudes', icon: FileText, label: 'Solicitudes de Recursos' },
  { to: '/tickets', icon: Ticket, label: 'Tickets de Soporte' },
]

const Sidebar = forwardRef<HTMLElement, Props>(({ topPx, mobileOpen = false, onMobileClose }, ref) => {
  const [hoverOpen, setHoverOpen] = useState<boolean>(false)
  const [busqueda, setBusqueda] = useState<string>('')
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const isOpen = hoverOpen || mobileOpen

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside
      ref={ref}
      className={`sidebar ${isOpen ? 'open' : ''}`}
      style={{ top: `${topPx}px` }}
      onMouseEnter={() => setHoverOpen(true)}
      onMouseLeave={() => { setHoverOpen(false); setBusqueda('') }}
    >
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          <User size={18} />
        </div>
        {isOpen && (
          <div className="sidebar-greet">
            <span className="sidebar-hola">Hola,</span>
            <span className="sidebar-nombre">{usuario?.nombre ?? 'Usuario'}</span>
          </div>
        )}
        {mobileOpen && (
          <button
            className="sidebar-close-btn"
            onClick={onMobileClose}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="sidebar-search-wrap">
        <Search size={16} className="sidebar-search-icon" />
        {isOpen && (
          <input
            className="sidebar-search"
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        )}
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav">
        {items
          .filter(item => !busqueda || item.label.toLowerCase().includes(busqueda.toLowerCase()))
          .map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => { if (mobileOpen) onMobileClose?.() }}
            >
              <span className="sidebar-icon"><Icon size={20} /></span>
              {isOpen && <span className="sidebar-label">{label}</span>}
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon"><LogOut size={20} /></span>
          {isOpen && <span className="sidebar-label">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'
export default Sidebar
