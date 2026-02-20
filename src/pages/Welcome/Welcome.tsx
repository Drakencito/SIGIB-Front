import './Welcome.css'

function Welcome() {
  const fecha = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <span className="welcome-fecha">{fecha}</span>
        <h1>Bienvenido al <strong>Sistema Integral</strong></h1>
        <p>Selecciona un módulo en el menú lateral para comenzar.</p>
      </div>

      <div className="welcome-cards">
        {[
          { titulo: 'Gestión de Inventarios',          color: '#006657', desc: 'Administra equipos e insumos' },
          { titulo: 'Solicitudes de Recursos',          color: '#9b2247', desc: 'Registra y aprueba solicitudes' },
          { titulo: 'Tickets de Soporte',               color: '#a57f2c', desc: 'Seguimiento de incidencias' },
        ].map(c => (
          <div className="welcome-card" key={c.titulo} style={{ borderTop: `3px solid ${c.color}` }}>
            <h3 style={{ color: c.color }}>{c.titulo}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Welcome
