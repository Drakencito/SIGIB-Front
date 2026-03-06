import { useState, useMemo } from 'react'
import type { ReactElement } from 'react'
import {
  Search,
  Plus,
  Monitor,
  Wifi,
  Printer,
  Wrench,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  MonitorSmartphone,
  Hand,
  Pencil,
} from 'lucide-react'
import { INVENTARIO } from '../../lib/constants/inventario'
import { UNIDADES } from '../../lib/constants/unidades'
import type { CategoriaInventario, EstadoInventario } from '../../lib/types/types'
import './Inventarios.css'

const categoriaLabel: Record<CategoriaInventario, string> = {
  equipo_computo: 'Equipo Cómputo',
  equipo_red: 'Equipo de Red',
  consumible: 'Consumible',
  refaccion: 'Refacción',
}

const categoriaIcono: Record<CategoriaInventario, ReactElement> = {
  equipo_computo: <Monitor size={24} />,
  equipo_red: <Wifi size={24} />,
  consumible: <Printer size={24} />,
  refaccion: <Wrench size={24} />,
}
type ModoFormulario = 'crear' | 'editar'

type EstadoClave = 'muy_malo' | 'malo' | 'regular' | 'bueno' | 'excelente'

type EstadoInfo = {
  key: EstadoClave
  label: string
  color: string
}

const ESTADOS: EstadoInfo[] = [
  { key: 'muy_malo', label: 'Muy malo', color: '#f44336' },
  { key: 'malo', label: 'Malo', color: '#ff9800' },
  { key: 'regular', label: 'Regular', color: '#ffc107' },
  { key: 'bueno', label: 'Bueno', color: '#8bc34a' },
  { key: 'excelente', label: 'Excelente', color: '#4caf50' }, 
]

const estadoLabel: Record<EstadoInventario, string> = Object.fromEntries(
  ESTADOS.map(e => [e.key, e.label]),
) as Record<EstadoInventario, string>

type EstadoBarProps =
  | {
    mode: 'edit'
    value: EstadoClave | null
    onChange: (estado: EstadoClave) => void
  }
  | {
    mode: 'view'
    estadoInventario: EstadoInventario
  }

function EstadoBar(props: EstadoBarProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const currentIndex =
    props.mode === 'edit'
      ? props.value != null
        ? ESTADOS.findIndex(e => e.key === props.value)
        : null
      : ESTADOS.findIndex(e => e.key === props.estadoInventario)

  const controllingIndex =
    props.mode === 'edit' && hoverIndex != null
      ? hoverIndex
      : currentIndex != null
        ? currentIndex
        : null

  const controllingEstado =
    controllingIndex != null ? ESTADOS[controllingIndex] : null

  const showLabel =
    props.mode === 'edit'
      ? controllingEstado?.label ?? 'Sin estado seleccionado'
      : estadoLabel[props.estadoInventario]

  return (
    <div className="estado-selector-wrapper">
      <div className="estado-selector-line">
        {ESTADOS.map((estado, index) => {
          const active =
            controllingIndex != null && index <= controllingIndex

          const color = controllingEstado?.color

          const className = [
            'estado-selector-dot',
            active ? 'estado-selector-dot--activo' : '',
          ]
            .filter(Boolean)
            .join(' ')

          if (props.mode === 'view') {
            return (
              <div
                key={estado.key}
                className={className}
                style={active && color ? { backgroundColor: color } : undefined}
              />
            )
          }

          return (
            <button
              key={estado.key}
              type="button"
              className={className}
              style={active && color ? { backgroundColor: color } : undefined}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => props.onChange(estado.key)}
              aria-label={estado.label}
            />
          )
        })}
      </div>

      <p className="estado-selector-text">{showLabel}</p>
    </div>
  )
}

/** Componente principal */

function Inventarios() {
  const [busqueda, setBusqueda] = useState('')
  const [filtCat, setFiltCat] = useState<CategoriaInventario | ''>('')
  const [filtEstado, setFiltEstado] = useState<EstadoInventario | ''>('')
  const [filtClues, setFiltClues] = useState('')

  const [itemAEliminar, setItemAEliminar] = useState<number | null>(null)

  const [abiertoFormulario, setAbiertoFormulario] = useState(false)
  const [modoFormulario, setModoFormulario] = useState<ModoFormulario>('crear')
  const [itemSeleccionado, setItemSeleccionado] = useState<number | null>(null)
  const [soloLectura, setSoloLectura] = useState(false)

  const [estadoForm, setEstadoForm] = useState<EstadoClave | null>(null)

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
      subtitulo: `${totalPorCategoria('consumible')} Piezas`,
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

  const itemActual =
    itemSeleccionado != null ? INVENTARIO.find(i => i.id === itemSeleccionado) : null

  const abrirCrear = () => {
    setItemSeleccionado(null)
    setModoFormulario('crear')
    setSoloLectura(false)
    setEstadoForm(null)
    setAbiertoFormulario(true)
  }

  const abrirDetalle = (id: number) => {
    setItemSeleccionado(id)
    setModoFormulario('editar')
    setSoloLectura(true)
    setAbiertoFormulario(true)
  }

  const abrirEditar = (id: number) => {
    const item = INVENTARIO.find(i => i.id === id)
    setItemSeleccionado(id)
    setModoFormulario('editar')
    setSoloLectura(false)

    if (item) {
      setEstadoForm(item.estado as EstadoClave)
    } else {
      setEstadoForm(null)
    }

    setAbiertoFormulario(true)
  }

  const cerrarFormulario = () => {
    setAbiertoFormulario(false)
  }

  return (
    <div className="inv-page">
      <div className="inv-header">
        <div>
          <h1>Gestión de Inventarios</h1>
          <p>Administra los equipos e insumos de las unidades médicas</p>
        </div>
        <button className="inv-btn-add" onClick={abrirCrear}>
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

        <select
          value={filtCat}
          onChange={e => setFiltCat(e.target.value as CategoriaInventario | '')}
        >
          <option value="">Todas las categorías</option>
          {Object.entries(categoriaLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <select
          value={filtEstado}
          onChange={e => setFiltEstado(e.target.value as EstadoInventario | '')}
        >
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
        <div className="inv-tabla-scroll">
          <table className="inv-tabla">
            <thead>
              <tr>
                <th>Marca / Modelo</th>
                <th>No. Serie</th>
                <th>Categoría</th>
                <th>Departamento</th>
                <th>Unidad médica</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="inv-empty">
                    Sin resultados para los filtros aplicados
                  </td>
                </tr>
              ) : (
                datos.map(item => {
                  const unidad = UNIDADES.find(u => u.clues === item.clues)
                  return (
                    <tr
                      key={item.id}
                      className="inv-row-card"
                      onClick={() => abrirDetalle(item.id)}
                    >
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
                        <span className="inv-clues-nombre">
                          {unidad?.nombre ?? item.clues}
                        </span>
                        <span className="inv-clues-code">{item.clues}</span>
                      </td>
                      <td>
                        <div
                          className="inv-acciones"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="inv-accion-btn inv-accion-editar"
                            aria-label="Editar"
                            onClick={() => abrirEditar(item.id)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            className="inv-accion-btn inv-accion-eliminar"
                            aria-label="Eliminar"
                            onClick={() => setItemAEliminar(item.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {itemAEliminar !== null && (
        <div className="inv-modal-backdrop">
          <div className="inv-modal-card">
            <div className="inv-modal-top-green" />
            <div className="inv-modal-top-gold" />
            <div className="inv-modal-content">
              <div className="inv-modal-icon-circle">
                <AlertTriangle className="inv-modal-icon" />
              </div>
              <div className="inv-modal-texts">
                <h2>Eliminar equipo</h2>
                <p>
                  ¿Estás seguro que deseas eliminar este equipo del inventario?
                  Esta acción no se puede deshacer.
                </p>
                <div className="inv-modal-actions">
                  <button
                    type="button"
                    className="inv-modal-btn-cancelar"
                    onClick={() => setItemAEliminar(null)}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="inv-modal-btn-confirmar"
                    onClick={() => {
                      // lógica real de eliminar
                      setItemAEliminar(null)
                    }}
                  >
                    Sí, Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {abiertoFormulario && (
        <div className="inv-modal-backdrop">
          {soloLectura ? (
            <div className="inv-add-card inv-add-card-detalle">
              <div className="inv-detalle-main">
                <header className="inv-detalle-header">
                  <div>
                    <h2>
                      {itemActual?.marca} {itemActual?.modelo}
                    </h2>
                    <p>Consulta la información registrada de este equipo.</p>
                  </div>
                  <div className="inv-detalle-clues">
                    <span className="inv-detalle-clues-code">
                      {itemActual?.clues}
                    </span>
                    <span className="inv-detalle-clues-nombre">
                      {UNIDADES.find(u => u.clues === itemActual?.clues)?.nombre ??
                        'Unidad médica'}
                    </span>
                  </div>
                </header>

                <div className="inv-detalle-separador" />

                <div className="inv-detalle-icon-wrap">
                  <div className="inv-detalle-icon-circle">
                    {itemActual && categoriaIcono[itemActual.categoria]}
                  </div>
                </div>

                <div className="inv-detalle-section">
                  <div className="inv-detalle-row">
                    <div className="inv-detalle-card">
                      <span className="inv-detalle-label">No. de serie</span>
                      <span className="inv-detalle-value inv-detalle-value-mono">
                        {itemActual?.noSerie}
                      </span>
                    </div>
                    <div className="inv-detalle-card">
                      <span className="inv-detalle-label">Categoría</span>
                      <span className="inv-detalle-value">
                        {itemActual && categoriaLabel[itemActual.categoria]}
                      </span>
                    </div>
                  </div>

                  <div className="inv-detalle-row">
                    <div className="inv-detalle-card">
                      <span className="inv-detalle-label">Estado</span>
                      {itemActual && (
                        <EstadoBar mode="view" estadoInventario={itemActual.estado} />
                      )}
                    </div>
                    <div className="inv-detalle-card">
                      <span className="inv-detalle-label">Departamento</span>
                      <span className="inv-detalle-value">
                        {itemActual?.departamento}
                      </span>
                    </div>
                  </div>

                  <div className="inv-detalle-row">
                    <div className="inv-detalle-card inv-detalle-card-full">
                      <span className="inv-detalle-label">Descripción</span>
                      <span className="inv-detalle-value">
                        {itemActual?.descripcion}
                      </span>
                    </div>
                  </div>

                  <div className="inv-detalle-row">
                    <div className="inv-detalle-card inv-detalle-card-full">
                      <span className="inv-detalle-label">Unidad médica</span>
                      <span className="inv-detalle-value">
                        {UNIDADES.find(u => u.clues === itemActual?.clues)
                          ?.nombre ?? '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="inv-detalle-separador inv-detalle-separador-bottom" />

                <div className="inv-detalle-footer">
                  <span className="inv-detalle-footnote">
                    Última actualización: información demostrativa
                  </span>

                  <div className="inv-detalle-footer-center">
                    <button
                      type="button"
                      className="inv-add-btn-aceptar"
                      onClick={cerrarFormulario}
                    >
                      Cerrar
                    </button>
                  </div>

                  <img
                    className="inv-detalle-footer-img"
                    src="/imagotipo.png"
                    alt="IMSS Bienestar"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="inv-add-card">
              <div className="inv-add-main">
                <header className="inv-add-header">
                  <h2>
                    {modoFormulario === 'crear'
                      ? 'Registrar nuevo equipo'
                      : 'Editar equipo'}
                  </h2>
                  <p>
                    {modoFormulario === 'crear'
                      ? 'Captura los datos del equipo para agregarlo al inventario.'
                      : 'Actualiza los datos del equipo seleccionado.'}
                  </p>
                </header>

                <form className="inv-add-form">
                  <div className="inv-add-grid">
                    <div className="inv-add-field">
                      <label>Marca</label>
                      <input
                        type="text"
                        defaultValue={
                          modoFormulario === 'editar' ? itemActual?.marca : ''
                        }
                      />
                    </div>
                    <div className="inv-add-field">
                      <label>Modelo</label>
                      <input
                        type="text"
                        defaultValue={
                          modoFormulario === 'editar' ? itemActual?.modelo : ''
                        }
                      />
                    </div>

                    <div className="inv-add-field inv-add-field-full">
                      <label>Descripción</label>
                      <input
                        type="text"
                        defaultValue={
                          modoFormulario === 'editar'
                            ? itemActual?.descripcion
                            : ''
                        }
                      />
                    </div>

                    <div className="inv-add-field">
                      <label>Categoría</label>
                      <select
                        defaultValue={
                          modoFormulario === 'editar' ? itemActual?.categoria : ''
                        }
                      >
                        <option value="">Seleccione categoría…</option>
                        {Object.entries(categoriaLabel).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="inv-add-field">
                      <label>Departamento</label>
                      <input
                        type="text"
                        defaultValue={
                          modoFormulario === 'editar'
                            ? itemActual?.departamento
                            : ''
                        }
                      />
                    </div>

                    <div className="inv-add-field">
                      <label>No. de serie</label>
                      <input
                        type="text"
                        defaultValue={
                          modoFormulario === 'editar' ? itemActual?.noSerie : ''
                        }
                      />
                    </div>

                    <div className="inv-add-field">
                      <label>Unidad médica (CLUES)</label>
                      <select
                        defaultValue={
                          modoFormulario === 'editar' ? itemActual?.clues : ''
                        }
                      >
                        <option value="">Seleccione unidad…</option>
                        {UNIDADES.filter(u => u.estatus === 'activa').map(u => (
                          <option key={u.clues} value={u.clues}>
                            {u.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="inv-add-field inv-add-field-full">
                      <label>Estado</label>
                      <EstadoBar
                        mode="edit"
                        value={estadoForm}
                        onChange={setEstadoForm}
                      />
                    </div>
                  </div>

                  <div className="inv-add-actions">
                    <button
                      type="button"
                      className="inv-add-btn-cancelar"
                      onClick={cerrarFormulario}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inv-add-btn-aceptar"
                    >
                      {modoFormulario === 'crear' ? 'Guardar' : 'Actualizar'}
                    </button>
                  </div>
                </form>
              </div>
              <aside className="inv-add-side">
                <div className="inv-add-side-body">
                  <h3>
                    Indicaciones para el
                    <br /> <span>Registro</span> de equipos
                  </h3>

                  <ul className="inv-add-side-list">
                    <li>
                      <span className="inv-add-side-icon">
                        <CheckCircle2 size={18} />
                      </span>
                      <p>
                        Verifica que la marca y modelo coincidan con la etiqueta
                        física.
                      </p>
                    </li>
                    <li>
                      <span className="inv-add-side-icon">
                        <MonitorSmartphone size={18} />
                      </span>
                      <p>
                        Captura el número de serie exactamente como aparece.
                      </p>
                    </li>
                    <li>
                      <span className="inv-add-side-icon">
                        <Hand size={18} />
                      </span>
                      <p>
                        Selecciona la unidad médica correcta según su CLUES.
                      </p>
                    </li>
                  </ul>

                  <div className="inv-add-side-bar" />
                </div>

                <div className="inv-add-side-image">
                  <img src="/imagotipo.png" alt="" />
                </div>
              </aside>
            </div>
          )}
        </div>
      )}

      <p className="inv-count">
        {datos.length} de {INVENTARIO.length} registros
      </p>
    </div>
  )
}

export default Inventarios
