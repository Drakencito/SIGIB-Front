import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Carousel.css'

interface Slide {
  gradient: string
  titulo: string
  subtitulo: string
}

const slides: Slide[] = [
  {
    gradient: 'linear-gradient(135deg, #006657 0%, #004d42 100%)',
    titulo: 'Sistema Integral IMSS Bienestar',
    subtitulo: 'Gestión eficiente de recursos institucionales en un solo lugar',
  },
  {
    gradient: 'linear-gradient(135deg, #1a3a2a 0%, #006657 100%)',
    titulo: 'Inventario y Recursos',
    subtitulo: 'Control total de equipos, insumos y materiales del sistema de salud',
  },
  {
    gradient: 'linear-gradient(135deg, #7a1e38 0%, #9b2247 100%)',
    titulo: 'Soporte y Seguimiento',
    subtitulo: 'Tickets de soporte y solicitudes resueltas de forma ágil y transparente',
  },
]

function Carousel() {
  const [actual, setActual]   = useState<number>(0)
  const [pausado, setPausado] = useState<boolean>(false)

  const siguiente = useCallback(() => {
    setActual(prev => (prev + 1) % slides.length)
  }, [])

  const anterior = () => {
    setActual(prev => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (pausado) return
    const timer = setInterval(siguiente, 4500)
    return () => clearInterval(timer)
  }, [pausado, siguiente])

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${actual * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="carousel-slide"
            style={{ background: slide.gradient }}
          >
            <div className="carousel-slide-content">
              <h2>{slide.titulo}</h2>
              <p>{slide.subtitulo}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-arrow left"  onClick={anterior}>
        <ChevronLeft size={22} />
      </button>
      <button className="carousel-arrow right" onClick={siguiente}>
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === actual ? 'active' : ''}`}
            onClick={() => setActual(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
