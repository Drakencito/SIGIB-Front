import { useState, useMemo } from 'react'
import type { ReactElement } from 'react'
import { Search, Plus, Monitor, Wifi, Droplets, Printer, Wrench } from 'lucide-react'
import { INVENTARIO } from '../../lib/constants/inventario'
import { UNIDADES } from '../../lib/constants/unidades'
import type { CategoriaInventario, EstadoInventario } from '../../lib/types/types'
import './Inventarios.css'

// ── Helpers de etiquetas ──────────────────────────────────────
const categoriaLabel: Record<CategoriaInventario, string> = {
  equipo_computo:   'Equipo Cómputo',
  equipo_red:       'Equipo de Red',
  consumible_tinta: 'Tinta',
  consumible_toner: 'Tóner',
  refaccion:        'Refacción',
}

const categoriaIcono: Record<CategoriaInventario, ReactElement> = {
  equipo_computo:   <Monitor  size={14} />,
  equipo_red:       <Wifi     size={14} />,
  consumible_tinta: <Droplets size={14} />,
  consumible_toner: <Printer  size={14} />,
  refaccion:        <Wrench   size={14} />,
}

const estadoColor: Record<EstadoInventario, string> = {
  excelente: '#006657',
  bueno:     '#2e7d32',
  malo:      '#a57f2c',
  muy_malo:  '#9b2247',
}

const estadoLabel: Record<EstadoInventario, string> = {
  excelente: 'Excelente',
  bueno:     'Bueno',
  malo:      'Malo',
  muy_malo:  'Muy Malo',
}

function Inventarios() {
  const [busqueda,   setBusqueda]   = useState('')
  const [filtCat,    setFiltCat]    = useState<CategoriaInventario | ''>('')
  const [filtEstado, setFiltEstado] = useState<EstadoInventario | ''>('')
  const [filtClues,  setFiltClues]  = useState('')

  const totalPorCategoria = (cat: CategoriaInventario) =>
    INVENTARIO.filter(i => i.categoria === cat).length

  const stats: { label: string; valor: number; color: string; icono: ReactElement }[] = [
    { label: 'Total',        valor: INVENTARIO.length,                                                           color: '#006657', icono: <Monitor size={20} /> },
    { label: 'Cómputo',      valor: totalPorCategoria('equipo_computo'),                                         color: '#1a3a8a', icono: <Monitor size={20} /> },
    { label: 'Red',          valor: totalPorCategoria('equipo_red'),                                             color: '#5b3a8a', icono: <Wifi    size={20} /> },
    { label: 'Consumibles',  valor: totalPorCategoria('consumible_tinta') + totalPorCategoria('consumible_toner'), color: '#a57f2c', icono: <Printer size={20} /> },
    { label: 'Refacciones',  valor: totalPorCategoria('refaccion'),                                              color: '#9b2247', icono: <Wrench  size={20} /> },
  ]

  const datos = useMemo(() => {
    return INVENTARIO.filter(item => {
      const texto = busqueda.toLowerCase()
      const coincideTexto =
        !busqueda ||
        item.marca.toLowerCase().includes(texto)        ||
        item.modelo.toLowerCase().includes(texto)       ||
        item.noSerie.toLowerCase().includes(texto)      ||
        item.descripcion.toLowerCase().includes(texto)
      const coincideCat    = !filtCat    || item.categoria === filtCat
      const coincideEstado = !filtEstado || item.estado    === filtEstado
      const coincideClues  = !filtClues  || item.clues     === filtClues
      return coincideTexto && coincideCat && coincideEstado && coincideClues
    })
  }, [busqueda, filtCat, filtEstado, filtClues])

  return (
    <div className="inv-page">

      {/* ── Encabezado ── */}
      <div className="inv-header">
        <div>
          <h1>Gestión de Inventarios</h1>
          <p>Administra los equipos e insumos de las unidades médicas</p>
        </div>
        <button className="inv-btn-add">
          <Plus size={18} /> Agregar equipo
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="inv-stats">
        {stats.map(s => (
          <div className="inv-stat-card" key={s.label} style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="inv-stat-icono" style={{ color: s.color }}>{s.icono}</div>
            <div>
              <span className="inv-stat-valor">{s.valor}</span>
              <span className="inv-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filtros ── */}
      <div className="inv-filtros">
        <div className="inv-search">
          <Search size={16} className="inv-search-icon" />
          <input
            placeholder="Buscar por marca, modelo, serie..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <select value={filtCat} onChange={e => setFiltCat(e.target.value as CategoriaInventario | '')}>
          <option value="">Todas las categorías</option>
          {Object.entries(categoriaLabel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select value={filtEstado} onChange={e => setFiltEstado(e.target.value as EstadoInventario | '')}>
          <option value="">Todos los estados</option>
          {Object.entries(estadoLabel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select value={filtClues} onChange={e => setFiltClues(e.target.value)}>
          <option value="">Todas las unidades</option>
          {UNIDADES.filter(u => u.estatus === 'activa').map(u => (
            <option key={u.clues} value={u.clues}>{u.nombre}</option>
          ))}
        </select>
      </div>

      {/* ── Tabla ── */}
      <div className="inv-tabla-wrap">
        <table className="inv-tabla">
          <thead>
            <tr>
              <th>Marca / Modelo</th>
              <th>No. Serie</th>
              <th>Categoría</th>
              <th>Departamento</th>
              <th>Unidad médica</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 ? (
              <tr>
                <td colSpan={6} className="inv-empty">
                  Sin resultados para los filtros aplicados
                </td>
              </tr>
            ) : (
              datos.map(item => {
                const unidad = UNIDADES.find(u => u.clues === item.clues)
                return (
                  <tr key={item.id}>
                    <td>
                      <span className="inv-marca">{item.marca}</span>
                      <span className="inv-modelo">{item.modelo}</span>
                    </td>
                    <td className="inv-serie">{item.noSerie}</td>
                    <td>
                      <span className="inv-badge-cat">
                        {categoriaIcono[item.categoria]}
                        {categoriaLabel[item.categoria]}
                      </span>
                    </td>
                    <td>{item.departamento}</td>
                    <td>
                      <span className="inv-clues-nombre">{unidad?.nombre ?? item.clues}</span>
                      <span className="inv-clues-code">{item.clues}</span>
                    </td>
                    <td>
                      <span
                        className="inv-badge-estado"
                        style={{
                          background: `${estadoColor[item.estado]}18`,
                          color: estadoColor[item.estado],
                        }}
                      >
                        {estadoLabel[item.estado]}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="inv-count">{datos.length} de {INVENTARIO.length} registros</p>

    </div>
  )
}

export default Inventarios
