import { useState, forwardRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Package, FileText, Ticket, Home, Search, LogOut, User } from 'lucide-react'
import { useAuth } from '../../../lib/store/AuthContext'
import './Sidebar.css'

interface Props {
  topPx: number
}

const items = [
  { to: '/inicio',      icon: Home,     label: 'Inicio' },
  { to: '/inventarios', icon: Package,  label: 'Gestión de Inventarios' },
  { to: '/solicitudes', icon: FileText, label: 'Solicitudes de Recursos' },
  { to: '/tickets',     icon: Ticket,   label: 'Tickets de Soporte' },
]

const Sidebar = forwardRef<HTMLElement, Props>(({ topPx }, ref) => {
  const [open, setOpen]         = useState<boolean>(false)
  const [busqueda, setBusqueda] = useState<string>('')
  const { usuario, logout }     = useAuth()
  const navigate                = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside
      ref={ref}
      className={`sidebar ${open ? 'open' : ''}`}
      style={{ top: `${topPx}px` }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setBusqueda('') }}
    >
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          <User size={18} />
        </div>
        {open && (
          <div className="sidebar-greet">
            <span className="sidebar-hola">Hola,</span>
            <span className="sidebar-nombre">{usuario?.nombre ?? 'Usuario'}</span>
          </div>
        )}
      </div>

      <div className="sidebar-search-wrap">
        <Search size={16} className="sidebar-search-icon" />
        {open && (
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
            >
              <span className="sidebar-icon"><Icon size={20} /></span>
              {open && <span className="sidebar-label">{label}</span>}
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon"><LogOut size={20} /></span>
          {open && <span className="sidebar-label">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'
export default Sidebar
