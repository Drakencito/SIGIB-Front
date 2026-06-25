import { useState, useMemo } from 'react'
import { Plus, CheckCircle, XCircle, Trash2, PackageSearch, CheckCircle2, ClipboardList, Hand, Search, ListTodo, Clock } from 'lucide-react'
import type { SolicitudRecurso, CategoriaInventario } from '../../lib/types/types'
import { categoriaLabel, categoriaIcono } from '../../lib/constants/categoriaUI'
import { UNIDADES } from '../../lib/constants/unidades'
import { useAuth } from '../../lib/store/AuthContext'
import { useToast } from '../../lib/store/ToastContext'
import Button from '../../components/atoms/Button/Button'
import Badge from '../../components/atoms/Badge/Badge'
import Modal from '../../components/organisms/Modal/Modal'
import ConfirmDeleteModal from '../../components/organisms/ConfirmDeleteModal/ConfirmDeleteModal'
import FormField from '../../components/molecules/Formfield/FormField'
import SelectField from '../../components/molecules/SelectField/SelectField'
import Input from '../../components/atoms/Input/Input'
import SummaryCard from '../../components/molecules/SummaryCard/SummaryCard'
import '../../components/organisms/InventoryForm/InventoryForm.css'
import '../../components/organisms/InventoryDetail/InventoryDetail.css'
import './Solicitudes.css'

const CATALOGO_ITEMS: Record<CategoriaInventario, string[]> = {
    consumible: [
        'Tóner HP CF283A (LaserJet Pro M125)',
        'Tóner Brother TN-1060 (HL-1200)',
        'Cartucho HP 664XL Negro',
        'Tinta Epson T544 Cyan/Magenta/Yellow',
        'Resma de Hojas Blancas Tamaño Carta',
        'Caja de Guantes de Látex'
    ],
    equipocomputo: [
        'Computadora de Escritorio (Estándar)',
        'Laptop para trabajo en campo',
        'Impresora Multifuncional B/N',
        'Impresora de Inyección a Color',
        'Monitor LED 24"',
        'Kit Teclado y Mouse USB'
    ],
    equipored: [
        'Switch de 16 puertos Gigabit',
        'Router Inalámbrico Básico',
        'Punto de Acceso WiFi (Access Point)',
        'Bobina de Cable UTP Cat 6 (Metros)'
    ],
    refaccion: [
        'Disco Duro SSD 1TB',
        'Memoria RAM 8GB DDR4',
        'Fuente de Poder 500W',
        'Batería para No-Break (UPS)'
    ]
}

const MOCK_SOLICITUDES: SolicitudRecurso[] = [
    { id: 1, cluesSolicitante: 'CSIMB000035', categoria: 'consumible', cantidad: 3, modelo: 'Tóner Brother TN-1060 (HL-1200)', descripcion: 'Para imprimir recetas en urgencias', estado: 'pendiente', fecha: '2026-04-06' },
    { id: 2, cluesSolicitante: 'CSIMB000076', categoria: 'equipocomputo', cantidad: 1, modelo: 'Impresora Multifuncional B/N', descripcion: 'Reemplazo de equipo dañado', estado: 'aprobada', fecha: '2026-04-05' },
    { id: 3, cluesSolicitante: 'CSIMB000303', categoria: 'equipored', cantidad: 1, modelo: 'Switch de 16 puertos Gigabit', descripcion: 'Ampliación de red en consultorios', estado: 'rechazada', fecha: '2026-04-01' }
]

export default function Solicitudes() {
    const auth = useAuth()
    const usuario = auth?.usuario
    const { addToast } = useToast()

    const esAdmin = usuario?.rol === 'admin'
    const miClues = usuario?.clues || 'CSIMB000035'

    const [solicitudes, setSolicitudes] = useState<SolicitudRecurso[]>(MOCK_SOLICITUDES)
    const [isCreating, setIsCreating] = useState(false)
    const [viewingSolicitud, setViewingSolicitud] = useState<SolicitudRecurso | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [catSeleccionada, setCatSeleccionada] = useState<CategoriaInventario | ''>('')
    const [itemSeleccionado, setItemSeleccionado] = useState('')
    const [itemOtro, setItemOtro] = useState('')
    const [cantidad, setCantidad] = useState(1)
    const [notas, setNotas] = useState('')
    const [filtroEstado, setFiltroEstado] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('todas')
    const [busqueda, setBusqueda] = useState('')

    const listaFiltrada = useMemo(() => {
        return solicitudes.filter(s => {
            if (!esAdmin && s.cluesSolicitante !== miClues) return false
            if (filtroEstado !== 'todas' && s.estado !== filtroEstado) return false
            if (busqueda) {
                const q = busqueda.toLowerCase()
                const unidad = UNIDADES.find(u => u.clues === s.cluesSolicitante)
                const matchModelo = s.modelo.toLowerCase().includes(q)
                const matchClues = s.cluesSolicitante.toLowerCase().includes(q)
                const matchUnidad = unidad?.nombre.toLowerCase().includes(q)
                const matchCategoria = categoriaLabel(s.categoria).toLowerCase().includes(q)
                if (!matchModelo && !matchClues && !matchUnidad && !matchCategoria) return false
            }
            return true
        })
    }, [solicitudes, esAdmin, miClues, filtroEstado, busqueda])

    const totalMisSol = solicitudes.filter(s => esAdmin || s.cluesSolicitante === miClues)

    const handleCrearSolicitud = (e: React.FormEvent) => {
        e.preventDefault()
        if (!catSeleccionada || !itemSeleccionado || cantidad < 1) return
        if (itemSeleccionado === 'Otro' && !itemOtro.trim()) {
            addToast('Especifica manualmente el artículo que necesitas', 'error')
            return
        }
        const modeloFinal = itemSeleccionado === 'Otro' ? itemOtro.trim() : itemSeleccionado
        const nueva: SolicitudRecurso = {
            id: Date.now(),
            cluesSolicitante: miClues,
            categoria: catSeleccionada as CategoriaInventario,
            modelo: modeloFinal,
            cantidad,
            descripcion: notas || 'Sin observaciones',
            estado: 'pendiente',
            fecha: new Date().toISOString().split('T')[0]
        }
        setSolicitudes([nueva, ...solicitudes])
        setIsCreating(false)
        setCatSeleccionada('')
        setItemSeleccionado('')
        setItemOtro('')
        setCantidad(1)
        setNotas('')
        addToast('Solicitud creada y enviada con éxito', 'success')
    }

    const cambiarEstado = (id: number, nuevoEstado: 'aprobada' | 'rechazada') => {
        setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s))
        addToast(`Solicitud marcada como ${nuevoEstado}`, 'success')
    }

    const confirmarEliminacion = () => {
        if (deletingId) {
            setSolicitudes(prev => prev.filter(s => s.id !== deletingId))
            setDeletingId(null)
            addToast('Solicitud cancelada y eliminada', 'info')
        }
    }

    return (
        <div className="solicitudes-page">
            <header className="sol-header">
                <div className="sol-header-texts">
                    <h1>Solicitudes de Insumos</h1>
                    <p>
                        {esAdmin
                            ? 'Gestiona y aprueba las peticiones de recursos de todas las unidades.'
                            : 'Solicita equipo de cómputo, refacciones o consumibles para tu unidad.'}
                    </p>
                </div>
                {!esAdmin && (
                    <Button variant="primary" size="md" onClick={() => setIsCreating(true)}>
                        <Plus size={18} /> Nueva Solicitud
                    </Button>
                )}
            </header>

            <div className="sol-summary-grid">
                <SummaryCard
                    icono={<ListTodo size={32} />}
                    titulo="Todas"
                    subtitulo="Total de solicitudes"
                    numero={totalMisSol.length}
                    activo={filtroEstado === 'todas'}
                    onClick={() => setFiltroEstado('todas')}
                />
                <SummaryCard
                    icono={<Clock size={32} />}
                    titulo="Pendientes"
                    subtitulo="Por revisar"
                    numero={totalMisSol.filter(s => s.estado === 'pendiente').length}
                    activo={filtroEstado === 'pendiente'}
                    onClick={() => setFiltroEstado('pendiente')}
                />
                <SummaryCard
                    icono={<CheckCircle size={32} />}
                    titulo="Aprobadas"
                    subtitulo="Listas para entrega"
                    numero={totalMisSol.filter(s => s.estado === 'aprobada').length}
                    activo={filtroEstado === 'aprobada'}
                    onClick={() => setFiltroEstado('aprobada')}
                />
                <SummaryCard
                    icono={<XCircle size={32} />}
                    titulo="Rechazadas"
                    subtitulo="Canceladas"
                    numero={totalMisSol.filter(s => s.estado === 'rechazada').length}
                    activo={filtroEstado === 'rechazada'}
                    onClick={() => setFiltroEstado('rechazada')}
                />
            </div>

            <div className="sol-toolbar">
                <div className="sol-search">
                    <Search size={18} className="sol-search-icon" />
                    <Input
                        type="text"
                        placeholder="Buscar por artículo o unidad médica..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <div className="sol-content">
                <div className="inv-tabla-wrap" style={{ margin: 0, height: '100%' }}>
                    {listaFiltrada.length === 0 ? (
                        <div className="inv-empty-state">
                            <PackageSearch size={56} className="inv-empty-icon" />
                            <h3>No hay resultados</h3>
                            <p>No se encontraron solicitudes con los filtros o búsqueda actuales.</p>
                            {(busqueda || filtroEstado !== 'todas') && (
                                <Button variant="secondary" size="sm" onClick={() => { setBusqueda(''); setFiltroEstado('todas') }}>
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="inv-tabla-scroll">
                            <table className="inv-tabla">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        {esAdmin && <th>Unidad Médica</th>}
                                        <th>Artículo Solicitado</th>
                                        <th>Cant.</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaFiltrada.map(sol => {
                                        const unidadInfo = UNIDADES.find(u => u.clues === sol.cluesSolicitante)
                                        return (
                                            <tr key={sol.id} onClick={() => setViewingSolicitud(sol)}>
                                                <td>{sol.fecha}</td>
                                                {esAdmin && (
                                                    <td>
                                                        <span className="inv-clues-nombre">{unidadInfo?.nombre}</span>
                                                        <span className="inv-clues-code">{sol.cluesSolicitante}</span>
                                                    </td>
                                                )}
                                                <td>
                                                    <span className="inv-marca">{sol.modelo}</span>
                                                    <span className="inv-modelo">
                                                        {categoriaLabel(sol.categoria)} • {sol.descripcion}
                                                    </span>
                                                </td>
                                                <td><strong>{sol.cantidad}</strong></td>
                                                <td>
                                                    {sol.estado === 'pendiente' && <Badge style={{ backgroundColor: '#fff4e5', color: '#e65100' }}>Pendiente</Badge>}
                                                    {sol.estado === 'aprobada' && <Badge style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}><CheckCircle size={14} /> Aprobada</Badge>}
                                                    {sol.estado === 'rechazada' && <Badge style={{ backgroundColor: '#ffebee', color: '#c62828' }}><XCircle size={14} /> Rechazada</Badge>}
                                                </td>
                                                <td>
                                                    <div className="inv-acciones" onClick={e => e.stopPropagation()}>
                                                        {esAdmin && sol.estado === 'pendiente' && (
                                                            <>
                                                                <Button variant="icon-green" onClick={() => cambiarEstado(sol.id, 'aprobada')} title="Aprobar">
                                                                    <CheckCircle size={18} />
                                                                </Button>
                                                                <Button variant="icon-red" onClick={() => cambiarEstado(sol.id, 'rechazada')} title="Rechazar">
                                                                    <XCircle size={18} />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {!esAdmin && sol.estado === 'pendiente' && (
                                                            <Button variant="icon-red" onClick={() => setDeletingId(sol.id)} title="Cancelar solicitud">
                                                                <Trash2 size={18} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal: Nueva Solicitud ── */}
            {isCreating && (
                <Modal onClose={() => setIsCreating(false)}>
                    <div className="inv-add-card">
                        <aside className="inv-add-side">
                            <div className="inv-add-side-top">
                                <div className="inv-add-side-body">
                                    <h3>Indicaciones para la<br /><span>Solicitud</span></h3>
                                </div>
                            </div>
                            <div className="inv-add-side-list-wrap inv-add-side-list-wrap--open">
                                <ul className="inv-add-side-list">
                                    <li>
                                        <span className="inv-add-side-icon"><ClipboardList size={18} /></span>
                                        <p>Elige la categoría o usa la opción "Otro" si no encuentras tu artículo.</p>
                                    </li>
                                    <li>
                                        <span className="inv-add-side-icon"><CheckCircle2 size={18} /></span>
                                        <p>Asegúrate de pedir solo la cantidad necesaria.</p>
                                    </li>
                                    <li>
                                        <span className="inv-add-side-icon"><Hand size={18} /></span>
                                        <p>Añade una justificación clara para agilizar la aprobación.</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="inv-add-side-bar" />
                        </aside>

                        <div className="inv-add-main">
                            <header className="inv-add-header">
                                <h2>Nueva Solicitud</h2>
                                <p>Captura los datos del recurso que necesitas.</p>
                            </header>
                            <div className="inv-add-separador" />
                            <div className="inv-add-form-scroll">
                                <form id="sol-form" onSubmit={handleCrearSolicitud}>
                                    <div className="inv-add-grid">
                                        <div className="inv-add-field-full">
                                            <SelectField
                                                id="cat"
                                                label="1. Selecciona la Categoría"
                                                value={catSeleccionada}
                                                onChange={e => {
                                                    setCatSeleccionada(e.target.value as CategoriaInventario)
                                                    setItemSeleccionado('')
                                                    setItemOtro('')
                                                }}
                                                required
                                            >
                                                <option value="">-- Elige una categoría --</option>
                                                <option value="equipocomputo">Equipo de Cómputo</option>
                                                <option value="equipored">Equipo de Red</option>
                                                <option value="consumible">Consumible</option>
                                                <option value="refaccion">Refacción</option>
                                            </SelectField>
                                        </div>

                                        <div className="inv-add-field-full">
                                            <SelectField
                                                id="item"
                                                label="2. Selecciona el Artículo (Catálogo)"
                                                value={itemSeleccionado}
                                                onChange={e => setItemSeleccionado(e.target.value)}
                                                disabled={!catSeleccionada}
                                                required
                                            >
                                                <option value="">{catSeleccionada ? '-- Selecciona qué necesitas --' : 'Primero elige una categoría'}</option>
                                                {catSeleccionada && CATALOGO_ITEMS[catSeleccionada].map(item => (
                                                    <option key={item} value={item}>{item}</option>
                                                ))}
                                                {catSeleccionada && (
                                                    <option value="Otro">Otro (Especificar manualmente...)</option>
                                                )}
                                            </SelectField>
                                        </div>

                                        {itemSeleccionado === 'Otro' && (
                                            <div className="inv-add-field-full">
                                                <FormField
                                                    id="itemOtro"
                                                    label="Especifica qué artículo necesitas"
                                                    type="text"
                                                    placeholder="Ej. Cable HDMI a USB-C de 3 metros"
                                                    value={itemOtro}
                                                    onChange={e => setItemOtro(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <FormField
                                                id="cant"
                                                label="Cantidad solicitada"
                                                type="number"
                                                min="1"
                                                max="50"
                                                value={cantidad.toString()}
                                                onChange={e => setCantidad(parseInt(e.target.value) || 1)}
                                                required
                                            />
                                        </div>

                                        <div className="inv-add-field-full">
                                            <FormField
                                                id="notas"
                                                label="Justificación / Observaciones"
                                                type="text"
                                                placeholder="Ej. Tóner agotado en consultorio 3, urge reemplazo."
                                                value={notas}
                                                onChange={e => setNotas(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="inv-add-separador inv-add-separador--bottom" />
                            <div className="inv-add-actions">
                                <Button variant="secondary" size="md" type="button" onClick={() => setIsCreating(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" size="md" type="submit" form="sol-form" disabled={!catSeleccionada || !itemSeleccionado}>
                                    Enviar Solicitud
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── Modal: Detalle Solicitud ── */}
            {viewingSolicitud && (
                <Modal onClose={() => setViewingSolicitud(null)}>
                    <div className="inv-add-card inv-add-card-detalle">
                        <div className="inv-detalle-main">
                            <header className="inv-detalle-header">
                                <div>
                                    <h2>{viewingSolicitud.modelo}</h2>
                                    <p>Consulta la información de esta solicitud.</p>
                                </div>
                                <div className="inv-detalle-clues">
                                    <span className="inv-detalle-clues-code">{viewingSolicitud.cluesSolicitante}</span>
                                    <span className="inv-detalle-clues-nombre">
                                        {UNIDADES.find(u => u.clues === viewingSolicitud.cluesSolicitante)?.nombre}
                                    </span>
                                </div>
                            </header>

                            <div className="inv-detalle-separador" />

                            <div className="inv-detalle-scroll-area">
                                <div className="inv-detalle-icon-wrap">
                                    <div className="inv-detalle-icon-circle">
                                        {categoriaIcono(viewingSolicitud.categoria)}
                                    </div>
                                </div>
                                <div className="inv-detalle-section">
                                    <div className="inv-detalle-row">
                                        <div className="inv-detalle-card">
                                            <span className="inv-detalle-label">Categoría</span>
                                            <span className="inv-detalle-value">{categoriaLabel(viewingSolicitud.categoria)}</span>
                                        </div>
                                        <div className="inv-detalle-card">
                                            <span className="inv-detalle-label">Cantidad</span>
                                            <span className="inv-detalle-value">{viewingSolicitud.cantidad} unidades</span>
                                        </div>
                                    </div>
                                    <div className="inv-detalle-row">
                                        <div className="inv-detalle-card">
                                            <span className="inv-detalle-label">Estado</span>
                                            <span className="inv-detalle-value" style={{ textTransform: 'capitalize' }}>
                                                {viewingSolicitud.estado}
                                            </span>
                                        </div>
                                        <div className="inv-detalle-card">
                                            <span className="inv-detalle-label">Fecha de solicitud</span>
                                            <span className="inv-detalle-value">{viewingSolicitud.fecha}</span>
                                        </div>
                                    </div>
                                    <div className="inv-detalle-row">
                                        <div className="inv-detalle-card inv-detalle-card-full">
                                            <span className="inv-detalle-label">Justificación / Observaciones</span>
                                            <span className="inv-detalle-value">{viewingSolicitud.descripcion}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="inv-detalle-separador inv-detalle-separador-bottom" />

                            <footer className="inv-detalle-footer">
                                <div className="inv-detalle-footer-center">
                                    <Button variant="primary" size="md" onClick={() => setViewingSolicitud(null)}>
                                        Cerrar Detalle
                                    </Button>
                                </div>
                            </footer>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── Modal: Confirmar eliminación ── */}
            {deletingId && (
                <Modal onClose={() => setDeletingId(null)}>
                    <ConfirmDeleteModal
                        titulo="Cancelar Solicitud"
                        mensaje="¿Estás seguro que deseas cancelar y eliminar esta solicitud? Esta acción no se puede deshacer."
                        labelConfirmar="Sí, Cancelar Solicitud"
                        onCancel={() => setDeletingId(null)}
                        onConfirm={confirmarEliminacion}
                    />
                </Modal>
            )}
        </div>
    )
}