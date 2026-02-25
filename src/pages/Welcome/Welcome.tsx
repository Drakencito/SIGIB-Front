import { useNavigate } from 'react-router-dom'
import { Package, FileText, Ticket } from 'lucide-react'
import { useAuth } from '../../lib/store/AuthContext'
import Carousel from '../../components/organisms/Carousel/Carousel'
import './Welcome.css'

const modulos = [
  {
    to: '/inventarios',
    icon: Package,
    titulo: 'Gestión de Inventarios',
    desc: 'Administra equipos, insumos y recursos materiales del sistema de salud.',
    acento: '#006657',
  },
  {
    to: '/solicitudes',
    icon: FileText,
    titulo: 'Solicitudes de Recursos',
    desc: 'Registra y da seguimiento a solicitudes de recursos del personal.',
    acento: '#9b2247',
  },
  {
    to: '/tickets',
    icon: Ticket,
    titulo: 'Tickets de Soporte',
    desc: 'Crea y resuelve tickets de soporte técnico con seguimiento en tiempo real.',
    acento: '#a57f2c',
  },
]

function Welcome() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const fecha = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="welcome-page">

      <div className="welcome-header">
        <div>
          <span className="welcome-fecha">{fecha}</span>
          <h1>Hola, <strong>{usuario?.nombre ?? 'Bienvenido'}</strong></h1>
          <p>Selecciona un módulo para comenzar tu sesión de trabajo.</p>
        </div>
      </div>

      <div className="welcome-carousel">
        <Carousel />
      </div>

      <div className="welcome-modulos">
        {modulos.map(({ to, icon: Icon, titulo, desc, acento }) => (
          <div
            key={to}
            className="modulo-card"
            style={{ borderTop: `3px solid ${acento}` }}
            onClick={() => navigate(to)}
          >
            <div
              className="modulo-img"
              style={{ background: `${acento}15` }}
            >
              <Icon size={40} color={acento} strokeWidth={1.5} />
            </div>
            <div className="modulo-info">
              <h3 style={{ color: acento }}>{titulo}</h3>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Welcome
