import { useNavigate } from 'react-router-dom'
import {
  Package,
  FileText,
  Ticket,
  CalendarRange,
  Megaphone,
  Newspaper,
  ShieldCheck,
  Clock3,
  ArrowRight,
  Sparkles,
  Wrench,
  PackageCheck,
  BellRing,
} from 'lucide-react'
import { useAuth } from '../../lib/store/AuthContext'
import Carousel from '../../components/organisms/Carousel/Carousel'
import Button from '../../components/atoms/Button/Button'
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
    desc: 'Registra, consulta y da seguimiento a solicitudes institucionales.',
    acento: '#9b2247',
  },
  {
    to: '/tickets',
    icon: Ticket,
    titulo: 'Tickets de Soporte',
    desc: 'Crea y atiende incidencias técnicas con seguimiento claro y ordenado.',
    acento: '#a57f2c',
  },
]

const anuncios = [
  {
    icon: BellRing,
    titulo: 'Cierre próximo de recepción trimestral',
    texto:
      'La ventana para capturar solicitudes de insumos y equipo cerrará en los próximos días. Verifica pendientes antes del corte.',
    tag: 'Prioritario',
  },
  {
    icon: Wrench,
    titulo: 'Mantenimiento preventivo',
    texto:
      'Antes de reportar una falla, revisa conexión eléctrica, cables de red, tóner y estado físico del equipo.',
    tag: 'Recomendación',
  },
  {
    icon: PackageCheck,
    titulo: 'Valida existencia en almacén',
    texto:
      'Evita duplicar solicitudes revisando primero disponibilidad local y estatus de entregas anteriores.',
    tag: 'Operación',
  },
]

const noticias = [
  {
    titulo: 'Actualización operativa del sistema',
    texto:
      'Se reforzó la organización de módulos para facilitar el acceso rápido a inventarios, solicitudes y soporte.',
    fecha: 'Hoy',
  },
  {
    titulo: 'Seguimiento más claro en tickets',
    texto:
      'Los reportes técnicos mantienen conversación centralizada para mejorar visibilidad entre unidades y soporte.',
    fecha: 'Esta semana',
  },
  {
    titulo: 'Mejores prácticas de captura',
    texto:
      'Se recomienda registrar descripciones completas y datos de unidad para agilizar validación y atención.',
    fecha: 'Aviso interno',
  },
]

const tips = [
  'Captura solicitudes con descripción precisa, cantidad y justificación.',
  'Reporta incidencias técnicas en cuanto aparezcan para reducir tiempos muertos.',
  'Mantén actualizado el inventario para facilitar reposición y control.',
  'Usa el módulo adecuado según el tipo de necesidad: recurso, inventario o soporte.',
]

function Welcome() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const fecha = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="welcome-page">
      <section className="welcome-hero-shell">
        <div className="welcome-header">
          <div>
            <span className="welcome-fecha">{fecha}</span>
            <h1>
              Hola, <strong>{usuario?.nombre ?? 'Bienvenido'}</strong>
            </h1>
            <p>
              Centro de operación institucional para seguimiento de recursos,
              soporte y avisos relevantes.
            </p>
          </div>

          <div className="welcome-header-pill">
            <Sparkles size={16} />
            <span>Panel activo</span>
          </div>
        </div>

        <div className="welcome-carousel">
          <Carousel />
        </div>
      </section>

      <section className="welcome-feature-grid">
        <article className="welcome-callout-card">
          <div className="welcome-callout-copy">
            <div className="welcome-eyebrow">
              <CalendarRange size={16} />
              <span>Convocatoria trimestral</span>
            </div>

            <h2>Recepción de solicitudes por periodo</h2>
            <p>
              Las solicitudes institucionales suelen abrirse por ventanas
              programadas. Este panel puede funcionar como aviso temporal para
              apertura, cierre próximo, recordatorios y lineamientos de captura.
            </p>

            <div className="welcome-status-row">
              <div className="welcome-status-chip welcome-status-chip--danger">
                <Clock3 size={15} />
                <span>Cierra pronto</span>
              </div>

              <div className="welcome-status-chip">
                <ShieldCheck size={15} />
                <span>Validación recomendada</span>
              </div>
            </div>

            <div className="welcome-callout-actions">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/solicitudes')}
              >
                Ir a solicitudes
              </Button>

              <button
                className="welcome-inline-link"
                type="button"
                onClick={() => navigate('/tickets')}
              >
                Resolver dudas en soporte
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="welcome-callout-visual">
            <img
              src="https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ec0064f07320de1ed25ee5f996109888abf728b1.jpg"
              alt="Equipo de trabajo médico en reunión"
              width="1300"
              height="925"
              loading="lazy"
            />
            <div className="welcome-callout-floating">
              <strong>Recomendación</strong>
              <span>Envía antes del cierre para evitar rezagos administrativos.</span>
            </div>
          </div>
        </article>

        <aside className="welcome-side-stack">
          <article className="welcome-media-card">
            <div className="welcome-media-card__image">
              <img
                src="https://pplx-res.cloudinary.com/image/upload/pplx_search_images/b79e9e6f15d2bfccd5ab53c55593f13f5cb82d7c.jpg"
                alt="Técnico dando mantenimiento a equipo"
                width="1024"
                height="768"
                loading="lazy"
              />
            </div>
            <div className="welcome-media-card__body">
              <span className="welcome-mini-label">Tip de cuidado</span>
              <h3>Mantenimiento y revisión básica</h3>
              <p>
                Una verificación preventiva puede evitar tickets repetitivos y
                prolongar la vida útil del equipo.
              </p>
            </div>
          </article>

          <article className="welcome-highlight-mini">
            <Megaphone size={18} />
            <div>
              <strong>Aviso operativo</strong>
              <p>
                Prioriza solicitudes críticas y captura información completa
                para acelerar validación.
              </p>
            </div>
          </article>
        </aside>
      </section>

      <section className="welcome-content-grid">
        <div className="welcome-panel">
          <div className="welcome-panel-head">
            <div>
              <span className="welcome-panel-kicker">Anuncios</span>
              <h2>Comunicados y recordatorios</h2>
            </div>
            <Megaphone size={20} />
          </div>

          <div className="welcome-announcement-list">
            {anuncios.map((item, idx) => {
              const Icon = item.icon
              return (
                <article key={idx} className="welcome-announcement-card">
                  <div className="welcome-announcement-icon">
                    <Icon size={20} />
                  </div>

                  <div className="welcome-announcement-body">
                    <div className="welcome-announcement-top">
                      <h3>{item.titulo}</h3>
                      <span>{item.tag}</span>
                    </div>
                    <p>{item.texto}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="welcome-panel">
          <div className="welcome-panel-head">
            <div>
              <span className="welcome-panel-kicker">Noticias</span>
              <h2>Actualizaciones internas</h2>
            </div>
            <Newspaper size={20} />
          </div>

          <div className="welcome-news-list">
            {noticias.map((item, idx) => (
              <article key={idx} className="welcome-news-card">
                <span className="welcome-news-date">{item.fecha}</span>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="welcome-tips-panel">
        <div className="welcome-panel-head">
          <div>
            <span className="welcome-panel-kicker">Buenas prácticas</span>
            <h2>Tips rápidos para operación diaria</h2>
          </div>
          <ShieldCheck size={20} />
        </div>

        <div className="welcome-tips-grid">
          {tips.map((tip, idx) => (
            <article key={idx} className="welcome-tip-card">
              <span className="welcome-tip-number">0{idx + 1}</span>
              <p>{tip}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="welcome-modules-section">
        <div className="welcome-panel-head">
          <div>
            <span className="welcome-panel-kicker">Accesos</span>
            <h2>Módulos principales</h2>
          </div>
          <ArrowRight size={20} />
        </div>

        <div className="welcome-modulos">
          {modulos.map(({ to, icon: Icon, titulo, desc, acento }) => (
            <article
              key={to}
              className="modulo-card"
              onClick={() => navigate(to)}
              style={{ ['--mod-accent' as string]: acento }}
            >
              <div className="modulo-card-top" />
              <div className="modulo-img">
                <div className="modulo-icon-shell">
                  <Icon size={38} strokeWidth={1.6} />
                </div>
              </div>
              <div className="modulo-info">
                <h3>{titulo}</h3>
                <p>{desc}</p>
                <span className="modulo-link">
                  Entrar al módulo
                  <ArrowRight size={16} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Welcome