import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, BellRing, Clock } from 'lucide-react'
import './Carousel.css'

interface Slide {
  image: string
  tipo: string
  icono: React.ReactNode
  titulo: string
  descripcion: string
  detalle: string
  fechaLabel: string
  fecha: string
  acento: string
}

const slides: Slide[] = [
  {
    image:
      'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3e56afdb9ac184bc32b1166cf87f73f8d647847e.jpg',
    tipo: 'Convocatoria activa',
    icono: <CalendarDays size={20} />,
    titulo: 'Solicitudes Q2 2026 abiertas',
    descripcion:
      'La ventana de captura para el segundo trimestre está disponible. Registra tus solicitudes de insumos, equipos y materiales antes del cierre.',
    detalle: 'Aplica para todas las unidades médicas del padrón IMSS Bienestar.',
    fechaLabel: 'Cierre de captura',
    fecha: '30 de mayo de 2026',
    acento: '#f7d88c',
  },
  {
    image:
      'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/893eb62ed67961edd6a5be18cee2ed14add2e213.jpg',
    tipo: 'Aviso institucional',
    icono: <BellRing size={20} />,
    titulo: 'Actualización del catálogo de equipos',
    descripcion:
      'Se incorporaron nuevas categorías al catálogo de inventario: equipos de diagnóstico portátil y dispositivos de red inalámbrica.',
    detalle: 'Verifica que tus registros estén clasificados correctamente.',
    fechaLabel: 'Vigente desde',
    fecha: '1 de mayo de 2026',
    acento: '#4ecfb8',
  },
  {
    image:
      'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ec0064f07320de1ed25ee5f996109888abf728b1.jpg',
    tipo: 'Recordatorio',
    icono: <Clock size={20} />,
    titulo: 'Cierre de tickets sin actividad',
    descripcion:
      'Los tickets sin respuesta por más de 15 días hábiles serán cerrados automáticamente. Revisa tus casos abiertos y actualiza su estatus.',
    detalle: 'Puedes reabrir un ticket cerrado en los siguientes 5 días.',
    fechaLabel: 'Aplica a partir del',
    fecha: '15 de mayo de 2026',
    acento: '#f9a88c',
  },
]

function Carousel() {
  const [actual, setActual] = useState<number>(0)
  const [pausado, setPausado] = useState<boolean>(false)

  const siguiente = useCallback(() => {
    setActual((prev) => (prev + 1) % slides.length)
  }, [])

  const anterior = () => {
    setActual((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (pausado) return
    const timer = setInterval(siguiente, 6000)
    return () => clearInterval(timer)
  }, [pausado, siguiente])

  const slide = slides[actual]

  return (
    <section
      className="carousel"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      aria-label="Avisos institucionales"
    >
      {/* Track — solo imágenes */}
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

      {/* Contenido — fijo encima de todas las slides */}
      <div className="carousel-content-layer">
        <div className="carousel-main">
          <span className="carousel-badge">
            {slide.icono}
            {slide.tipo}
          </span>
          <h2>{slide.titulo}</h2>
          <p>{slide.descripcion}</p>
          <p className="carousel-detalle">{slide.detalle}</p>
        </div>

        <aside
          className="carousel-sidecard"
          style={{ ['--slide-acento' as string]: slide.acento }}
        >
          <div className="carousel-sidecard-top">
            <span className="carousel-sidecard-label">Fecha importante</span>
            <span className="carousel-sidecard-meta">{slide.tipo}</span>
          </div>
          <strong className="carousel-sidecard-title">{slide.fechaLabel}</strong>
          <div className="carousel-fecha-grande">{slide.fecha}</div>
          <div className="carousel-sidecard-divider" />
          <p className="carousel-sidecard-nota">{slide.detalle}</p>
        </aside>
      </div>

      {/* Controles en franja inferior */}
      <div className="carousel-controls">
        <div className="carousel-arrows">
          <button
            type="button"
            className="carousel-arrow"
            onClick={anterior}
            aria-label="Aviso anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="carousel-arrow"
            onClick={siguiente}
            aria-label="Aviso siguiente"
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
              aria-label={`Ir a: ${s.titulo}`}
            >
              <span className="carousel-dot-pip" />
              <small>{s.tipo}</small>
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