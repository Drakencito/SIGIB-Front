import { Package, FileText, Ticket } from 'lucide-react'
import './Dashboard.css'

const modulos = [
  {
    titulo: 'Gestión de Inventarios',
    descripcion: 'Administra el inventario de equipos, insumos y recursos materiales del sistema.',
    icono: Package,
    acento: '#006657',
    sombra: 'rgba(0, 102, 87, 0.18)',
  },
  {
    titulo: 'Gestión de Solicitudes de Recursos',
    descripcion: 'Registra, revisa y aprueba solicitudes de recursos del personal.',
    icono: FileText,
    acento: '#9b2247',
    sombra: 'rgba(155, 34, 71, 0.18)',
  },
  {
    titulo: 'Sistema de Tickets de Soporte',
    descripcion: 'Crea y da seguimiento a tickets de soporte técnico y atención a usuarios.',
    icono: Ticket,
    acento: '#a57f2c',
    sombra: 'rgba(165, 127, 44, 0.18)',
  },
]

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>Bienvenido al sistema</h1>
        <p>Selecciona un módulo para comenzar</p>
      </div>

      <div className="modulos-grid">
        {modulos.map((mod) => {
          const Icono = mod.icono
          return (
            <div
              className="modulo-card"
              key={mod.titulo}
              style={{ borderTop: `4px solid ${mod.acento}` }}
            >
              <div
                className="modulo-icon"
                style={{ background: `${mod.acento}18`, color: mod.acento }}
              >
                <Icono size={28} />
              </div>
              <h2 className="modulo-titulo">{mod.titulo}</h2>
              <p className="modulo-desc">{mod.descripcion}</p>
              <button
                className="modulo-btn"
                style={{
                  background: mod.acento,
                  boxShadow: `0 4px 14px ${mod.sombra}`
                }}
              >
                Acceder
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
