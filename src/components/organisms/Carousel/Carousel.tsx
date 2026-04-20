import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Package, FileText, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Carousel.css'

interface Slide {
  image: string
  badge: string
  icono: React.ReactNode
  titulo: string
  subtitulo: string
  features: string[]
  acento: string
  ruta: string
  cta: string
  meta: string
}

const slides: Slide[] = [
  {
    image:
      'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3e56afdb9ac184bc32b1166cf87f73f8d647847e.jpg',
    badge: 'Módulo 01 · Inventario',
    icono: <Package size={22} />,
    titulo: 'Gestión de Inventarios',
    subtitulo:
      'Registra, consulta y da seguimiento a todos los activos institucionales: equipos de cómputo, red, consumibles y refacciones.',
    features: [
      'Categorización por tipo de equipo y unidad',
      'Seguimiento de estado: bueno, regular, malo',
      'Historial de cambios y resguardos por área',
    ],
    acento: '#4ecfb8',
    ruta: '/inventarios',
    cta: 'Ir a Inventarios',
    meta: 'Control de activos',
  },
  {
    image:
      'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/893eb62ed67961edd6a5be18cee2ed14add2e213.jpg',
    badge: 'Módulo 02 · Solicitudes',
    icono: <FileText size={22} />,
    titulo: 'Solicitudes de Recursos',
    subtitulo:
      'Captura y gestiona solicitudes institucionales de insumos, equipo y materiales por periodos programados.',
    features: [
      'Apertura por convocatorias trimestrales',
      'Seguimiento de estatus por unidad médica',
      'Historial y trazabilidad de cada solicitud',
    ],
    acento: '#f7d88c',
    ruta: '/solicitudes',
    cta: 'Ir a Solicitudes',
    meta: 'Convocatoria periódica',
  },
  {
    image:
      'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ec0064f07320de1ed25ee5f996109888abf728b1.jpg',
    badge: 'Módulo 03 · Soporte',
    icono: <Ticket size={22} />,
    titulo: 'Tickets de Soporte',
    subtitulo:
      'Reporta incidencias técnicas y da seguimiento a cada caso con conversación centralizada entre unidades y soporte.',
    features: [
      'Apertura rápida con motivo y prioridad',
      'Chat por ticket con historial completo',
      'Seguimiento de resolución en tiempo real',
    ],
    acento: '#f9a88c',
    ruta: '/tickets',
    cta: 'Ir a Tickets',
    meta: 'Atención técnica',
  },
]

function Carousel() {
  const [actual, setActual] = useState<number>(0)
  const [pausado, setPausado] = useState<boolean>(false)
  const navigate = useNavigate()

  const siguiente = useCallback(() => {
    setActual((prev) => (prev + 1) % slides.length)
  }, [])

  const anterior = () => {
    setActual((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (pausado) return
    const timer = setInterval(siguiente, 5500)
    return () => clearInterval(timer)
  }, [pausado, siguiente])

  const slide = slides[actual]

  return (
    <section
      className="carousel"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      aria-label="Módulos del sistema"
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${actual * 100}%)` }}
      >
        {slides.map((s, i) => (
          <article key={i} className="carousel-slide">
            <div className="carousel-slide-media">
              <img src={s.image} alt={s.titulo} width="1600" height="900" loading="lazy" />
            </div>
            <div className="carousel-slide-overlay" />
            <div className="carousel-slide-noise" />
          </article>
        ))}
      </div>

      <div className="carousel-content-layer">
        <div className="carousel-main">
          <span className="carousel-badge">
            {slide.icono}
            {slide.badge}
          </span>

          <h2>{slide.titulo}</h2>
          <p>{slide.subtitulo}</p>

          <button
            type="button"
            className="carousel-cta"
            onClick={() => navigate(slide.ruta)}
          >
            {slide.cta}
            <ChevronRight size={17} />
          </button>
        </div>

        <aside
          className="carousel-sidecard"
          style={{ ['--slide-acento' as string]: slide.acento }}
        >
          <div className="carousel-sidecard-top">
            <span className="carousel-sidecard-label">¿Qué puedes hacer?</span>
            <span className="carousel-sidecard-meta">{slide.meta}</span>
          </div>

          <strong className="carousel-sidecard-title">{slide.titulo}</strong>

          <ul className="carousel-features">
            {slide.features.map((f, i) => (
              <li key={i}>
                <span className="carousel-feature-dot" />
                {f}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="carousel-controls">
        <div className="carousel-arrows">
          <button
            type="button"
            className="carousel-arrow"
            onClick={anterior}
            aria-label="Módulo anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="carousel-arrow"
            onClick={siguiente}
            aria-label="Módulo siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="carousel-dots">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              className={`carousel-dot ${i === actual ? 'active' : ''}`}
              onClick={() => setActual(i)}
              aria-label={`Ir a ${s.titulo}`}
            >
              <span className="carousel-dot-pip" />
              <small>{s.badge.split(' · ')[1]}</small>
            </button>
          ))}
        </div>

        <span className="carousel-counter">
          {String(actual + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  )
}

export default Carousel