import { useState, useMemo } from 'react'
import type { ReactElement } from 'react'
import { Search, Plus, Monitor, Wifi, Droplets, Printer, Wrench } from 'lucide-react'
import { INVENTARIO } from '../../lib/constants/inventario'
import { UNIDADES } from '../../lib/constants/unidades'
import type { CategoriaInventario, EstadoInventario } from '../../lib/types/types'
import './Inventarios.css'

const categoriaLabel: Record<CategoriaInventario, string> = {
  equipo_computo: 'Equipo Cómputo',
  equipo_red: 'Equipo de Red',
  consumible_tinta: 'Tinta',
  consumible_toner: 'Tóner',
  refaccion: 'Refacción',
}

const categoriaIcono: Record<CategoriaInventario, ReactElement> = {
  equipo_computo: <Monitor size={18} />,
  equipo_red: <Wifi size={18} />,
  consumible_tinta: <Droplets size={18} />,
  consumible_toner: <Printer size={18} />,
  refaccion: <Wrench size={18} />,
}

const estadoColor: Record<EstadoInventario, string> = {
  excelente: '#006657',
  bueno: '#2e7d32',
  malo: '#a57f2c',
  muy_malo: '#9b2247',
}

const estadoLabel: Record<EstadoInventario, string> = {
  excelente: 'Excelente',
  bueno: 'Bueno',
  malo: 'Malo',
  muy_malo: 'Muy Malo',
}

function Inventarios() {
  const [busqueda, setBusqueda] = useState('')
  const [filtCat, setFiltCat] = useState<CategoriaInventario | ''>('')
  const [filtEstado, setFiltEstado] = useState<EstadoInventario | ''>('')
  const [filtClues, setFiltClues] = useState('')

  const totalPorCategoria = (cat: CategoriaInventario) =>
    INVENTARIO.filter(i => i.categoria === cat).length

  const stats = [
    {
      id: 'total',
      icono: <Monitor />,
      titulo: 'Total',
      subtitulo: `${INVENTARIO.length} Unidades`,
    },
    {
      id: 'computo',
      icono: <Monitor />,
      titulo: 'Cómputo',
      subtitulo: `${totalPorCategoria('equipo_computo')} Equipos`,
    },
    {
      id: 'red',
      icono: <Wifi />,
      titulo: 'Red',
      subtitulo: `${totalPorCategoria('equipo_red')} Dispositivos`,
    },
    {
      id: 'consumibles',
      icono: <Printer />,
      titulo: 'Consumibles',
      subtitulo: `${totalPorCategoria('consumible_tinta') + totalPorCategoria('consumible_toner')} Piezas`,
    },
    {
      id: 'refacciones',
      icono: <Wrench />,
      titulo: 'Refacciones',
      subtitulo: `${totalPorCategoria('refaccion')} Piezas`,
    },
  ]

  const datos = useMemo(() => {
    return INVENTARIO.filter(item => {
      const texto = busqueda.toLowerCase()
      const coincideTexto =
        !busqueda ||
        item.marca.toLowerCase().includes(texto) ||
        item.modelo.toLowerCase().includes(texto) ||
        item.noSerie.toLowerCase().includes(texto) ||
        item.descripcion.toLowerCase().includes(texto)
      const coincideCat = !filtCat || item.categoria === filtCat
      const coincideEstado = !filtEstado || item.estado === filtEstado
      const coincideClues = !filtClues || item.clues === filtClues
      return coincideTexto && coincideCat && coincideEstado && coincideClues
    })
  }, [busqueda, filtCat, filtEstado, filtClues])

  return (
    <div className="inv-page">
      <div className="inv-header">
        <div>
          <h1>Gestión de Inventarios</h1>
          <p>Administra los equipos e insumos de las unidades médicas</p>
        </div>
        <button className="inv-btn-add">
          <Plus size={18} /> Agregar equipo
        </button>
      </div>

      <div className="inv-stats">
        {stats.map(card => (
          <div key={card.id} className="inv-summary-card">
            <div className="inv-summary-top-green" />
            <div className="inv-summary-top-gold" />
            <div className="inv-summary-content">
              <div className="inv-summary-icon-circle">
                <span className="inv-summary-icon">{card.icono}</span>
              </div>
              <div className="inv-summary-texts">
                <div className="inv-summary-title">{card.titulo}</div>
                <div className="inv-summary-sub">{card.subtitulo}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <select value={filtEstado} onChange={e => setFiltEstado(e.target.value as EstadoInventario | '')}>
          <option value="">Todos los estados</option>
          {Object.entries(estadoLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <select value={filtClues} onChange={e => setFiltClues(e.target.value)}>
          <option value="">Todas las unidades</option>
          {UNIDADES.filter(u => u.estatus === 'activa').map(u => (
            <option key={u.clues} value={u.clues}>
              {u.nombre}
            </option>
          ))}
        </select>
      </div>

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
                  <tr key={item.id} className="inv-row-card">
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

      <p className="inv-count">
        {datos.length} de {INVENTARIO.length} registros
      </p>
    </div>
  )
}

export default Inventarios
