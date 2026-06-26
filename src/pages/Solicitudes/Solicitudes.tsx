import { useMemo, useState } from 'react'
import {
  Plus,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Clock,
  ClipboardList,
  Droplets,
  Printer,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import type {
  SolicitudRecurso,
  EstadoSolicitud,
  DetalleSolicitudConsumible,
  TipoImpresora,
  CompatibilidadConsumible,
} from '../../lib/types/types'
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

const ENTIDADES_FEDERATIVAS = ['Chiapas']

const OPCIONES_CONSUMIBLES = [
  'Tóner negro',
  'Tóner cyan',
  'Tóner magenta',
  'Tóner yellow',
  'Tinta negra',
  'Tinta color',
  'Tóner HP CF283A',
  'Tóner Brother TN-1060',
  'Cartucho HP 664XL Negro',
  'Tinta Epson T544 Cyan',
  'Tinta Epson T544 Magenta',
  'Tinta Epson T544 Yellow',
  'Otro',
]

const COMPATIBILIDADES: CompatibilidadConsumible[] = [
  'original',
  'compatible',
  'original/compatible',
]

const MOCK_SOLICITUDES: SolicitudRecurso[] = [
  {
    id: 1,
    cluesSolicitante: 'CSIMB000035',
    entidadFederativa: 'Chiapas',
    unidadMedica: 'C.S. Urbano Villa de Acala',
    ubicacion: 'Acala, Villa de Acala',
    nombreResponsable: 'Dr. Carlos Mendoza Ruiz',
    cargoResponsable: 'Administrador',
    telefonoResponsable: '9611234567',
    correoResponsable: 'carlos.mendoza@imssbienestar.gob.mx',
    proveedorFotocopiado: '',
    cantidadFotocopiadoTrimestral: '',
    observaciones: 'Consumibles para operación trimestral.',
    detalles: [
      {
        id: 11,
        tipoImpresora: 'laser',
        marcaModeloImpresora: 'Brother HL-1200',
        consumible: 'Tóner Brother TN-1060',
        compatibilidad: 'original',
        cantidadTrimestral: 3,
      },
      {
        id: 12,
        tipoImpresora: 'tinta',
        marcaModeloImpresora: 'HP Ink Tank 315',
        consumible: 'Tinta negra',
        compatibilidad: 'original/compatible',
        cantidadTrimestral: 2,
      },
    ],
    estado: 'pendiente',
    fecha: '2026-06-20',
  },
  {
    id: 2,
    cluesSolicitante: 'CSIMB000076',
    entidadFederativa: 'Chiapas',
    unidadMedica: 'C.S. La Laguna',
    ubicacion: 'Altamirano, La Laguna',
    nombreResponsable: 'Lic. Ana Ruiz Torres',
    cargoResponsable: 'Enlace administrativo',
    telefonoResponsable: '9619876543',
    correoResponsable: 'ana.ruiz@imssbienestar.gob.mx',
    proveedorFotocopiado: 'Proveedor Local',
    cantidadFotocopiadoTrimestral: 1200,
    observaciones: '',
    detalles: [
      {
        id: 21,
        tipoImpresora: 'laser',
        marcaModeloImpresora: 'HP LaserJet Pro M125',
        consumible: 'Tóner HP CF283A',
        compatibilidad: 'compatible',
        cantidadTrimestral: 2,
      },
    ],
    estado: 'aprobada',
    fecha: '2026-06-18',
  },
]

type DetalleForm = {
  id: number
  tipoImpresora: TipoImpresora
  marcaModeloImpresora: string
  consumible: string
  compatibilidad: CompatibilidadConsumible
  cantidadTrimestral: number
  consumibleOtro: string
}

const crearDetalleVacio = (): DetalleForm => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  tipoImpresora: 'laser',
  marcaModeloImpresora: '',
  consumible: '',
  compatibilidad: 'original',
  cantidadTrimestral: 1,
  consumibleOtro: '',
})

const estadoColor: Record<EstadoSolicitud, string> = {
  pendiente: '#c6922b',
  aprobada: '#006657',
  rechazada: '#9b2247',
}

const estadoLabel: Record<EstadoSolicitud, string> = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

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
  const [filtroEstado, setFiltroEstado] = useState<'todas' | EstadoSolicitud>('todas')
  const [busqueda, setBusqueda] = useState('')

  const [entidadFederativa, setEntidadFederativa] = useState('Chiapas')
  const [clues, setClues] = useState(miClues)
  const [unidadMedica, setUnidadMedica] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [nombreResponsable, setNombreResponsable] = useState(usuario?.nombre ?? '')
  const [cargoResponsable, setCargoResponsable] = useState('')
  const [telefonoResponsable, setTelefonoResponsable] = useState('')
  const [correoResponsable, setCorreoResponsable] = useState('')
  const [proveedorFotocopiado, setProveedorFotocopiado] = useState('')
  const [cantidadFotocopiadoTrimestral, setCantidadFotocopiadoTrimestral] = useState<number | ''>('')
  const [observaciones, setObservaciones] = useState('')
  const [detalles, setDetalles] = useState<DetalleForm[]>([crearDetalleVacio()])

  const syncUnidad = (cluesValue: string) => {
    const unidad = UNIDADES.find(u => u.clues === cluesValue)
    setClues(cluesValue)
    setUnidadMedica(unidad?.nombre ?? '')
    setUbicacion(unidad ? `${unidad.municipio}, ${unidad.localidad}` : '')
  }

  const resetFormulario = () => {
    setEntidadFederativa('Chiapas')
    syncUnidad(miClues)
    setNombreResponsable(usuario?.nombre ?? '')
    setCargoResponsable('')
    setTelefonoResponsable('')
    setCorreoResponsable('')
    setProveedorFotocopiado('')
    setCantidadFotocopiadoTrimestral('')
    setObservaciones('')
    setDetalles([crearDetalleVacio()])
  }

  const visibleSolicitudes = useMemo(() => {
    return solicitudes.filter(s => {
      if (!esAdmin && s.cluesSolicitante !== miClues) return false
      if (filtroEstado !== 'todas' && s.estado !== filtroEstado) return false

      if (busqueda.trim()) {
        const q = busqueda.toLowerCase()
        const detallesTexto = s.detalles
          .map(d => `${d.marcaModeloImpresora} ${d.consumible} ${d.tipoImpresora}`)
          .join(' ')
          .toLowerCase()

        const match =
          s.cluesSolicitante.toLowerCase().includes(q) ||
          s.unidadMedica.toLowerCase().includes(q) ||
          s.nombreResponsable.toLowerCase().includes(q) ||
          detallesTexto.includes(q)

        if (!match) return false
      }

      return true
    })
  }, [solicitudes, esAdmin, miClues, filtroEstado, busqueda])

  const solicitudesVisiblesBase = solicitudes.filter(s => esAdmin || s.cluesSolicitante === miClues)

  const resumen = {
    total: solicitudesVisiblesBase.length,
    pendientes: solicitudesVisiblesBase.filter(s => s.estado === 'pendiente').length,
    aprobadas: solicitudesVisiblesBase.filter(s => s.estado === 'aprobada').length,
    rechazadas: solicitudesVisiblesBase.filter(s => s.estado === 'rechazada').length,
  }

  const agregarDetalle = () => {
    setDetalles(prev => [...prev, crearDetalleVacio()])
  }

  const eliminarDetalle = (id: number) => {
    if (detalles.length === 1) {
      addToast('Debes conservar al menos un renglón de consumible', 'warning')
      return
    }
    setDetalles(prev => prev.filter(d => d.id !== id))
  }

  const actualizarDetalle = <K extends keyof DetalleForm>(
    id: number,
    field: K,
    value: DetalleForm[K]
  ) => {
    setDetalles(prev =>
      prev.map(detalle =>
        detalle.id === id ? { ...detalle, [field]: value } : detalle
      )
    )
  }

  const handleOpenCreate = () => {
    resetFormulario()
    setIsCreating(true)
  }

  const handleCrearSolicitud = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !entidadFederativa ||
      !clues ||
      !unidadMedica ||
      !ubicacion ||
      !nombreResponsable.trim() ||
      !cargoResponsable.trim() ||
      !telefonoResponsable.trim() ||
      !correoResponsable.trim()
    ) {
      addToast('Completa los datos obligatorios de la unidad y del responsable', 'error')
      return
    }

    const correoValido = /\S+@\S+\.\S+/.test(correoResponsable)
    if (!correoValido) {
      addToast('Ingresa un correo institucional válido', 'error')
      return
    }

    const detallesFinales: DetalleSolicitudConsumible[] = []
    for (const detalle of detalles) {
      const consumibleFinal =
        detalle.consumible === 'Otro' ? detalle.consumibleOtro.trim() : detalle.consumible

      if (!consumibleFinal || detalle.cantidadTrimestral < 1) {
        addToast('Todos los renglones deben tener consumible y cantidad trimestral válida', 'error')
        return
      }

      detallesFinales.push({
        id: detalle.id,
        tipoImpresora: detalle.tipoImpresora,
        marcaModeloImpresora: detalle.marcaModeloImpresora.trim(),
        consumible: consumibleFinal,
        compatibilidad: detalle.compatibilidad,
        cantidadTrimestral: detalle.cantidadTrimestral,
      })
    }

    const nueva: SolicitudRecurso = {
      id: Date.now(),
      cluesSolicitante: clues,
      entidadFederativa,
      unidadMedica,
      ubicacion,
      nombreResponsable: nombreResponsable.trim(),
      cargoResponsable: cargoResponsable.trim(),
      telefonoResponsable: telefonoResponsable.trim(),
      correoResponsable: correoResponsable.trim(),
      proveedorFotocopiado: proveedorFotocopiado.trim(),
      cantidadFotocopiadoTrimestral,
      observaciones: observaciones.trim(),
      detalles: detallesFinales,
      estado: 'pendiente',
      fecha: new Date().toISOString().split('T')[0],
    }

    setSolicitudes(prev => [nueva, ...prev])
    setIsCreating(false)
    resetFormulario()
    addToast('Solicitud de consumibles creada correctamente', 'success')
  }

  const cambiarEstado = (id: number, nuevoEstado: 'aprobada' | 'rechazada') => {
    setSolicitudes(prev => prev.map(s => (s.id === id ? { ...s, estado: nuevoEstado } : s)))
    addToast(`Solicitud marcada como ${estadoLabel[nuevoEstado].toLowerCase()}`, 'success')
  }

  const confirmarEliminacion = () => {
    if (!deletingId) return
    setSolicitudes(prev => prev.filter(s => s.id !== deletingId))
    setDeletingId(null)
    addToast('Solicitud eliminada correctamente', 'info')
  }

  return (
    <div className="solicitudes-page">
      <header className="sol-header">
        <div className="sol-header-texts">
          <h1>Solicitudes de consumibles</h1>
          <p>
            {esAdmin
              ? 'Gestiona solicitudes de tinta y tóner de todas las unidades médicas.'
              : 'Captura solicitudes técnicas de tinta y tóner para tu unidad médica.'}
          </p>
        </div>

        {!esAdmin && (
          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <Plus size={18} /> Nueva Solicitud
          </Button>
        )}
      </header>

      <div className="sol-content">
        <div className="sol-summary-grid">
          <SummaryCard
            icono={<ClipboardList size={28} />}
            titulo="Total"
            subtitulo={`${resumen.total} solicitudes`}
            numero={resumen.total}
          />
          <SummaryCard
            icono={<Clock size={28} />}
            titulo="Pendientes"
            subtitulo={`${resumen.pendientes} por revisar`}
            numero={resumen.pendientes}
          />
          <SummaryCard
            icono={<CheckCircle2 size={28} />}
            titulo="Aprobadas"
            subtitulo={`${resumen.aprobadas} autorizadas`}
            numero={resumen.aprobadas}
          />
          <SummaryCard
            icono={<XCircle size={28} />}
            titulo="Rechazadas"
            subtitulo={`${resumen.rechazadas} no autorizadas`}
            numero={resumen.rechazadas}
          />
        </div>

        <div className="sol-toolbar">
          <div className="sol-search">
            <Search size={16} className="sol-search-icon" />
            <Input
              placeholder="Buscar por CLUES, unidad, responsable o consumible..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          <select
            className="sol-estado-filter"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value as 'todas' | EstadoSolicitud)}
          >
            <option value="todas">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
        </div>

        <div className="sol-list">
          {visibleSolicitudes.length === 0 ? (
            <div className="sol-empty">
              <Droplets size={52} />
              <h3>Sin solicitudes</h3>
              <p>No hay solicitudes de tinta y tóner con los filtros actuales.</p>
            </div>
          ) : (
            visibleSolicitudes.map(solicitud => (
              <article key={solicitud.id} className="sol-card">
                <div className="sol-card-head">
                  <div>
                    <h3>{solicitud.unidadMedica}</h3>
                    <p>
                      {solicitud.cluesSolicitante} · {solicitud.ubicacion}
                    </p>
                  </div>
                  <Badge color={estadoColor[solicitud.estado]}>
                    {estadoLabel[solicitud.estado]}
                  </Badge>
                </div>

                <div className="sol-card-body">
                  <div className="sol-card-meta">
                    <span><strong>Responsable:</strong> {solicitud.nombreResponsable}</span>
                    <span><strong>Fecha:</strong> {solicitud.fecha}</span>
                    <span><strong>Renglones:</strong> {solicitud.detalles.length}</span>
                    <span>
                      <strong>Total trimestral:</strong>{' '}
                      {solicitud.detalles.reduce((acc, d) => acc + d.cantidadTrimestral, 0)}
                    </span>
                  </div>

                  <div className="sol-card-items">
                    {solicitud.detalles.map(det => (
                      <div key={det.id} className="sol-mini-item">
                        <Printer size={15} />
                        <span>
                          {det.tipoImpresora === 'laser' ? 'Láser' : 'Tinta'} · {det.consumible} ·{' '}
                          {det.cantidadTrimestral}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sol-card-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setViewingSolicitud(solicitud)}
                  >
                    <Eye size={16} /> Ver detalle
                  </Button>

                  {esAdmin && solicitud.estado === 'pendiente' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => cambiarEstado(solicitud.id, 'aprobada')}
                      >
                        <CheckCircle size={16} /> Aprobar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cambiarEstado(solicitud.id, 'rechazada')}
                      >
                        <XCircle size={16} /> Rechazar
                      </Button>
                    </>
                  )}

                  {(esAdmin || solicitud.cluesSolicitante === miClues) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setDeletingId(solicitud.id)}
                    >
                      <Trash2 size={16} /> Eliminar
                    </Button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {isCreating && (
        <Modal onClose={() => setIsCreating(false)}>
          <div className="sol-modal-card">
            <div className="sol-modal-top-green" />
            <div className="sol-modal-top-gold" />
            <div className="sol-modal-content">
              <div className="sol-modal-header">
                <h2>Nueva solicitud de consumibles</h2>
                <p>Captura tinta y tóner de acuerdo con la unidad médica y el responsable.</p>
              </div>

              <form className="sol-form" onSubmit={handleCrearSolicitud}>
                <section className="sol-form-section">
                  <h3>Información básica</h3>
                  <div className="sol-form-grid">
                    <SelectField
                      id="entidadFederativa"
                      label="Entidad Federativa"
                      value={entidadFederativa}
                      onChange={e => setEntidadFederativa(e.target.value)}
                    >
                      {ENTIDADES_FEDERATIVAS.map(entidad => (
                        <option key={entidad} value={entidad}>
                          {entidad}
                        </option>
                      ))}
                    </SelectField>

                    <SelectField
                      id="clues"
                      label="CLUES"
                      value={clues}
                      onChange={e => syncUnidad(e.target.value)}
                    >
                      {UNIDADES.filter(u => u.estatus === 'activa').map(unidad => (
                        <option key={unidad.clues} value={unidad.clues}>
                          {unidad.clues}
                        </option>
                      ))}
                    </SelectField>

                    <FormField
                      id="unidadMedica"
                      label="Denominación de la unidad médica"
                      value={unidadMedica}
                      readOnly
                    />

                    <FormField
                      id="ubicacion"
                      label="Ubicación de la unidad médica"
                      value={ubicacion}
                      readOnly
                    />
                  </div>
                </section>

                <section className="sol-form-section">
                  <h3>Responsable técnico y administrativo</h3>
                  <div className="sol-form-grid">
                    <FormField
                      id="nombreResponsable"
                      label="Nombre"
                      value={nombreResponsable}
                      onChange={e => setNombreResponsable(e.target.value)}
                      required
                    />
                    <FormField
                      id="cargoResponsable"
                      label="Cargo"
                      value={cargoResponsable}
                      onChange={e => setCargoResponsable(e.target.value)}
                      required
                    />
                    <FormField
                      id="telefonoResponsable"
                      label="Teléfono"
                      value={telefonoResponsable}
                      onChange={e => setTelefonoResponsable(e.target.value)}
                      required
                    />
                    <FormField
                      id="correoResponsable"
                      label="Correo electrónico institucional"
                      type="email"
                      value={correoResponsable}
                      onChange={e => setCorreoResponsable(e.target.value)}
                      required
                    />
                  </div>
                </section>

                <section className="sol-form-section">
                  <h3>Fotocopiado</h3>
                  <div className="sol-form-grid">
                    <FormField
                      id="proveedorFotocopiado"
                      label="Proveedor brinda el servicio"
                      value={proveedorFotocopiado}
                      onChange={e => setProveedorFotocopiado(e.target.value)}
                    />
                    <FormField
                      id="cantidadFotocopiadoTrimestral"
                      label="Cantidad trimestral"
                      type="number"
                      min={0}
                      value={cantidadFotocopiadoTrimestral}
                      onChange={e =>
                        setCantidadFotocopiadoTrimestral(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </section>

                <section className="sol-form-section">
                  <div className="sol-section-row">
                    <h3>Consumibles solicitados</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={agregarDetalle}>
                      <Plus size={16} /> Agregar renglón
                    </Button>
                  </div>

                  <div className="sol-detalles-list">
                    {detalles.map((detalle, index) => (
                      <div key={detalle.id} className="sol-detalle-card">
                        <div className="sol-detalle-card-head">
                          <h4>Renglón {index + 1}</h4>
                          <button
                            type="button"
                            className="sol-detalle-remove"
                            onClick={() => eliminarDetalle(detalle.id)}
                            aria-label="Eliminar renglón"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="sol-form-grid">
                          <SelectField
                            id={`tipoImpresora-${detalle.id}`}
                            label="Tipo de impresora"
                            value={detalle.tipoImpresora}
                            onChange={e =>
                              actualizarDetalle(
                                detalle.id,
                                'tipoImpresora',
                                e.target.value as TipoImpresora
                              )
                            }
                          >
                            <option value="laser">Impresora láser</option>
                            <option value="tinta">Impresora de tinta</option>
                          </SelectField>

                          <FormField
                            id={`marcaModeloImpresora-${detalle.id}`}
                            label="Marca y modelo de impresora"
                            value={detalle.marcaModeloImpresora}
                            onChange={e =>
                              actualizarDetalle(detalle.id, 'marcaModeloImpresora', e.target.value)
                            }
                            placeholder="Ej. HP LaserJet Pro M125"
                          />

                          <SelectField
                            id={`consumible-${detalle.id}`}
                            label={
                              detalle.tipoImpresora === 'laser'
                                ? 'Cartucho tóner'
                                : 'Tinta utilizada'
                            }
                            value={detalle.consumible}
                            onChange={e =>
                              actualizarDetalle(detalle.id, 'consumible', e.target.value)
                            }
                          >
                            <option value="">Selecciona</option>
                            {OPCIONES_CONSUMIBLES.map(opcion => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            ))}
                          </SelectField>

                          <SelectField
                            id={`compatibilidad-${detalle.id}`}
                            label="Original y/o compatible"
                            value={detalle.compatibilidad}
                            onChange={e =>
                              actualizarDetalle(
                                detalle.id,
                                'compatibilidad',
                                e.target.value as CompatibilidadConsumible
                              )
                            }
                          >
                            {COMPATIBILIDADES.map(opcion => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            ))}
                          </SelectField>

                          <FormField
                            id={`cantidadTrimestral-${detalle.id}`}
                            label="Cantidad trimestral"
                            type="number"
                            min={1}
                            value={detalle.cantidadTrimestral}
                            onChange={e =>
                              actualizarDetalle(
                                detalle.id,
                                'cantidadTrimestral',
                                Number(e.target.value || 1)
                              )
                            }
                            required
                          />

                          {detalle.consumible === 'Otro' && (
                            <FormField
                              id={`consumibleOtro-${detalle.id}`}
                              label="Especifica el consumible"
                              value={detalle.consumibleOtro}
                              onChange={e =>
                                actualizarDetalle(detalle.id, 'consumibleOtro', e.target.value)
                              }
                              required
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="sol-form-section">
                  <h3>Observaciones</h3>
                  <textarea
                    className="sol-textarea"
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                    placeholder="Observaciones adicionales..."
                    rows={4}
                  />
                </section>

                <div className="sol-form-actions">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setIsCreating(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Guardar solicitud
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {viewingSolicitud && (
        <Modal onClose={() => setViewingSolicitud(null)}>
          <div className="sol-modal-card sol-modal-card--detail">
            <div className="sol-modal-top-green" />
            <div className="sol-modal-top-gold" />
            <div className="sol-modal-content">
              <div className="sol-modal-header">
                <h2>Detalle de solicitud</h2>
                <p>{viewingSolicitud.unidadMedica}</p>
              </div>

              <div className="sol-detail-grid">
                <div><strong>Entidad:</strong> {viewingSolicitud.entidadFederativa}</div>
                <div><strong>CLUES:</strong> {viewingSolicitud.cluesSolicitante}</div>
                <div><strong>Unidad:</strong> {viewingSolicitud.unidadMedica}</div>
                <div><strong>Ubicación:</strong> {viewingSolicitud.ubicacion}</div>
                <div><strong>Responsable:</strong> {viewingSolicitud.nombreResponsable}</div>
                <div><strong>Cargo:</strong> {viewingSolicitud.cargoResponsable}</div>
                <div><strong>Teléfono:</strong> {viewingSolicitud.telefonoResponsable}</div>
                <div><strong>Correo:</strong> {viewingSolicitud.correoResponsable}</div>
                <div><strong>Fecha:</strong> {viewingSolicitud.fecha}</div>
                <div>
                  <strong>Estado:</strong>{' '}
                  <Badge color={estadoColor[viewingSolicitud.estado]}>
                    {estadoLabel[viewingSolicitud.estado]}
                  </Badge>
                </div>
              </div>

              <div className="sol-detail-block">
                <h3>Fotocopiado</h3>
                <p>
                  <strong>Proveedor:</strong>{' '}
                  {viewingSolicitud.proveedorFotocopiado || 'No especificado'}
                </p>
                <p>
                  <strong>Cantidad trimestral:</strong>{' '}
                  {viewingSolicitud.cantidadFotocopiadoTrimestral || 'No especificada'}
                </p>
              </div>

              <div className="sol-detail-block">
                <h3>Renglones solicitados</h3>
                <div className="sol-detail-items">
                  {viewingSolicitud.detalles.map(det => (
                    <div key={det.id} className="sol-detail-item">
                      <div><strong>Tipo:</strong> {det.tipoImpresora === 'laser' ? 'Impresora láser' : 'Impresora de tinta'}</div>
                      <div><strong>Impresora:</strong> {det.marcaModeloImpresora || 'No especificada'}</div>
                      <div><strong>Consumible:</strong> {det.consumible}</div>
                      <div><strong>Compatibilidad:</strong> {det.compatibilidad}</div>
                      <div><strong>Cantidad trimestral:</strong> {det.cantidadTrimestral}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sol-detail-block">
                <h3>Observaciones</h3>
                <p>{viewingSolicitud.observaciones || 'Sin observaciones'}</p>
              </div>

              <div className="sol-form-actions">
                <Button type="button" variant="secondary" size="sm" onClick={() => setViewingSolicitud(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {deletingId !== null && (
        <Modal onClose={() => setDeletingId(null)}>
          <ConfirmDeleteModal
            titulo="Eliminar solicitud"
            mensaje="¿Deseas eliminar esta solicitud de consumibles? Esta acción no se puede deshacer."
            labelConfirmar="Sí, eliminar"
            onCancel={() => setDeletingId(null)}
            onConfirm={confirmarEliminacion}
          />
        </Modal>
      )}
    </div>
  )
}