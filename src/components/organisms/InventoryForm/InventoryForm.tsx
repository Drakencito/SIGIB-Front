import { useState, useEffect } from 'react'
import type { FC} from 'react'
import {
    ClipboardList, MapPin, FileText, Tag, Building2, ChevronDown, ChevronUp
} from 'lucide-react'
import type {
    ItemInventario,
    CategoriaInventario,
    EstadoInventario,
    NivelAtencion
} from '../../../lib/types/types'
import SelectField from '../../molecules/SelectField/SelectField'
import FormField from '../../molecules/Formfield/FormField'
import EstadoBar from '../../molecules/EstadoBar/EstadoBar'
import Button from '../../atoms/Button/Button'
import './InventoryForm.css'
import type { ModoFormulario } from '../../../lib/hooks/useInventario'
interface InventoryFormProps {
    onCancel: () => void
    onSubmit: (item: Omit<ItemInventario, 'id'>) => void
    modo?: ModoFormulario      
    itemActual?: ItemInventario | null
    estadoForm?: EstadoInventario | null
    onEstadoChange?: (estado: EstadoInventario | null) => void
    inicial?: Partial<ItemInventario>
}

type FormData = Omit<ItemInventario, 'id'>

const EMPTY: FormData = {
    noInventario: '',
    responsable: '',
    descripcion: '',
    marca: '',
    modelo: '',
    noSerie: '',
    entidadFederativa: '',
    clues: '',
    nombreClues: '',
    nivelAtencion: 'TERCER NIVEL',
    cucop: '',
    cabms: '',
    estado: 'F',
    observaciones: '',
    categoria: 'equipocomputo',
    fechaDocumento: '',
    valorFactura: undefined,
    valorLibros: undefined,
    nombreArchivo: '',
    remision: '',
    actaEntrega: '',
    fuenteOrigen: '',
}
type Errors = Partial<Record<keyof FormData, string>>

function validate(f: FormData): Errors {
    const e: Errors = {}
    if (!f.noInventario.trim()) e.noInventario = 'Requerido'
    if (!f.responsable.trim()) e.responsable = 'Requerido'
    if (!f.descripcion.trim()) e.descripcion = 'Requerido'
    if (!f.marca.trim()) e.marca = 'Requerido'
    if (!f.modelo.trim()) e.modelo = 'Requerido'
    if (!f.noSerie.trim()) e.noSerie = 'Requerido'
    if (!f.entidadFederativa.trim()) e.entidadFederativa = 'Requerido'
    if (!f.clues.trim()) e.clues = 'Requerido'
    if (!f.nombreClues.trim()) e.nombreClues = 'Requerido'
    if (!f.cabms.trim()) e.cabms = 'Requerido'
    if (!f.estado) e.estado = 'Requerido'
    return e
}

function buildInitial(
    modo: ModoFormulario,
    itemActual: ItemInventario | null | undefined,
    inicial: Partial<ItemInventario> | undefined
): FormData {
    const base = modo === 'editar' && itemActual
        ? { ...EMPTY, ...itemActual }
        : { ...EMPTY }

    return inicial ? { ...base, ...inicial } : base
}

const InventoryForm: FC<InventoryFormProps> = ({
    onCancel,
    onSubmit,
    modo = 'crear',
    itemActual,
    estadoForm,
    onEstadoChange,
    inicial,
}) => {
    const [form, setForm] = useState<FormData>(() =>
        buildInitial(modo, itemActual, inicial)
    )
    const [errors, setErrors] = useState<Errors>({})
    const [showDocs, setShowDocs] = useState(false)

    useEffect(() => {
        setForm(buildInitial(modo, itemActual, inicial))
        setErrors({})
    }, [itemActual?.id, modo]) 
    const estadoEfectivo = (estadoForm != null ? estadoForm : form.estado) as EstadoInventario

    const handleEstadoChange = (v: EstadoInventario) => {
        setForm(prev => ({ ...prev, estado: v }))
        onEstadoChange?.(v)
    }

    const set = (field: keyof FormData, value: string | number | undefined) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const errs = validate({ ...form, estado: estadoEfectivo })
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        onSubmit({ ...form, estado: estadoEfectivo })
    }

    const tituloFormulario = modo === 'editar' ? 'Editar Bien' : 'Alta de Bien'
    const subtituloFormulario = modo === 'editar'
        ? 'Modifica los datos del bien registrado.'
        : 'Completa los campos conforme al documento que acredita la propiedad.'
    const labelBotonPrimario = modo === 'editar' ? 'Guardar Cambios' : 'Guardar Bien'

    return (
        <div className="inv-add-card">

            <div className="inv-add-main">
                <div className="inv-add-header">
                    <h2>{tituloFormulario}</h2>
                    <p>{subtituloFormulario}</p>
                </div>
                <div className="inv-add-separador" />

                <div className="inv-add-form-scroll">
                    <form onSubmit={handleSubmit} noValidate>

                        <div className="inv-add-grid">

                            <div className={`inv-add-field${errors.noInventario ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="No. Inventario Anterior"
                                    id="noInventario"
                                    value={form.noInventario}
                                    onChange={e => set('noInventario', e.target.value)}
                                    placeholder="Ej: HJGGM/ADMH/021"
                                />
                                {errors.noInventario && <span className="inv-field-error">{errors.noInventario}</span>}
                            </div>

                            <div className="inv-add-field">
                                <SelectField label="Categoría" id="categoria"
                                    value={form.categoria}
                                    onChange={e => set('categoria', e.target.value as CategoriaInventario)}>
                                    <option value="equipocomputo">Equipo de Cómputo</option>
                                    <option value="equipored">Equipo de Red</option>
                                    <option value="consumible">Consumible</option>
                                    <option value="refaccion">Refacción</option>
                                </SelectField>
                            </div>

                            <div className={`inv-add-field inv-add-field-full${errors.descripcion ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="Descripción"
                                    id="descripcion"
                                    value={form.descripcion}
                                    onChange={e => set('descripcion', e.target.value)}
                                    placeholder="Ej: MOUSE OPTICO USB"
                                />
                                {errors.descripcion && <span className="inv-field-error">{errors.descripcion}</span>}
                            </div>

                            <div className={`inv-add-field${errors.marca ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="Marca"
                                    id="marca"
                                    value={form.marca}
                                    onChange={e => set('marca', e.target.value)}
                                    placeholder="Ej: HP"
                                />
                                {errors.marca && <span className="inv-field-error">{errors.marca}</span>}
                            </div>

                            <div className={`inv-add-field${errors.modelo ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="Modelo"
                                    id="modelo"
                                    value={form.modelo}
                                    onChange={e => set('modelo', e.target.value)}
                                    placeholder="Ej: ProDesk 400 G7"
                                />
                                {errors.modelo && <span className="inv-field-error">{errors.modelo}</span>}
                            </div>

                            <div className={`inv-add-field${errors.noSerie ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="No. de Serie"
                                    id="noSerie"
                                    value={form.noSerie}
                                    onChange={e => set('noSerie', e.target.value)}
                                    placeholder="Ej: MXL1234567"
                                />
                                {errors.noSerie && <span className="inv-field-error">{errors.noSerie}</span>}
                            </div>

                            <div className={`inv-add-field inv-add-field-full${errors.responsable ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="Responsable de la Unidad Médica-Administrativa"
                                    id="responsable"
                                    value={form.responsable}
                                    onChange={e => set('responsable', e.target.value)}
                                    placeholder="Ej: DR. CESAR ALONSO CARRILLO SANCHEZ"
                                />
                                {errors.responsable && <span className="inv-field-error">{errors.responsable}</span>}
                            </div>
                        </div>

                        <div className="inv-add-separador inv-add-separador--bottom" />
                        <div className="inv-add-grid">

                            <div className={`inv-add-field${errors.entidadFederativa ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="Entidad Federativa"
                                    id="entidadFederativa"
                                    value={form.entidadFederativa}
                                    onChange={e => set('entidadFederativa', e.target.value)}
                                    placeholder="Ej: Chiapas"
                                />
                                {errors.entidadFederativa && <span className="inv-field-error">{errors.entidadFederativa}</span>}
                            </div>

                            <div className="inv-add-field">
                                <SelectField label="Nivel de Atención" id="nivelAtencion"
                                    value={form.nivelAtencion}
                                    onChange={e => set('nivelAtencion', e.target.value as NivelAtencion)}>
                                    <option value="PRIMER NIVEL">Primer Nivel</option>
                                    <option value="SEGUNDO NIVEL">Segundo Nivel</option>
                                    <option value="TERCER NIVEL">Tercer Nivel</option>
                                </SelectField>
                            </div>

                            <div className={`inv-add-field${errors.clues ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="CLUES"
                                    id="clues"
                                    value={form.clues}
                                    onChange={e => set('clues', e.target.value)}
                                    placeholder="Ej: CSIMB006533"
                                />
                                {errors.clues && <span className="inv-field-error">{errors.clues}</span>}
                            </div>

                            <div className={`inv-add-field${errors.nombreClues ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="Nombre de CLUES"
                                    id="nombreClues"
                                    value={form.nombreClues}
                                    onChange={e => set('nombreClues', e.target.value)}
                                    placeholder="Nombre del establecimiento"
                                />
                                {errors.nombreClues && <span className="inv-field-error">{errors.nombreClues}</span>}
                            </div>
                        </div>

                        <div className="inv-add-separador inv-add-separador--bottom" />
                        <div className="inv-add-grid">

                            <div className="inv-add-field">
                                <FormField
                                    label="CUCOP"
                                    id="cucop"
                                    value={form.cucop}
                                    onChange={e => set('cucop', e.target.value)}
                                    placeholder="Clave CUCOP (opcional)"
                                />
                            </div>

                            <div className={`inv-add-field${errors.cabms ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    label="CABMS"
                                    id="cabms"
                                    value={form.cabms}
                                    onChange={e => set('cabms', e.target.value)}
                                    placeholder="Ej: I180000000"
                                />
                                {errors.cabms && <span className="inv-field-error">{errors.cabms}</span>}
                            </div>
                        </div>

                        <div className="inv-add-separador inv-add-separador--bottom" />
                        <div className="inv-add-grid">
                            <div className="inv-add-field inv-add-field-full">
                                <span className="inv-add-estado-label">Estado Físico</span>
                                <EstadoBar
                                    mode="edit"
                                    value={estadoEfectivo}
                                    onChange={v => handleEstadoChange(v as EstadoInventario)}
                                />
                                {errors.estado && <span className="inv-field-error">{errors.estado}</span>}
                            </div>

                            <div className="inv-add-field inv-add-field-full">
                                <FormField
                                    label="Observaciones"
                                    id="observaciones"
                                    value={form.observaciones}
                                    onChange={e => set('observaciones', e.target.value)}
                                    placeholder="Observaciones adicionales (opcional)"
                                />
                            </div>
                        </div>

                        <div className="inv-add-separador inv-add-separador--bottom" />
                        <button
                            type="button"
                            className="inv-add-docs-toggle"
                            onClick={() => setShowDocs(v => !v)}
                        >
                            <FileText size={16} />
                            Documentación e información de valor
                            {showDocs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {showDocs && (
                            <div className="inv-add-grid" style={{ marginTop: '1rem' }}>

                                <div className="inv-add-field">
                                    <FormField
                                        label="Fecha del Documento"
                                        id="fechaDocumento"
                                        type="date"
                                        value={form.fechaDocumento ?? ''}
                                        onChange={e => set('fechaDocumento', e.target.value)}
                                    />
                                </div>

                                <div className="inv-add-field">
                                    <FormField
                                        label="Valor Factura (con IVA)"
                                        id="valorFactura"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.valorFactura ?? ''}
                                        onChange={e => set('valorFactura', e.target.value ? Number(e.target.value) : undefined)}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="inv-add-field">
                                    <FormField
                                        label="Valor Actual en Libros"
                                        id="valorLibros"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.valorLibros ?? ''}
                                        onChange={e => set('valorLibros', e.target.value ? Number(e.target.value) : undefined)}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="inv-add-field">
                                    <FormField
                                        label="Nombre del Archivo"
                                        id="nombreArchivo"
                                        value={form.nombreArchivo ?? ''}
                                        onChange={e => set('nombreArchivo', e.target.value)}
                                        placeholder="Ej: factura_001.pdf"
                                    />
                                </div>

                                <div className="inv-add-field">
                                    <FormField
                                        label="Remisión / Orden de Suministro"
                                        id="remision"
                                        value={form.remision ?? ''}
                                        onChange={e => set('remision', e.target.value)}
                                        placeholder="No. de remisión"
                                    />
                                </div>

                                <div className="inv-add-field">
                                    <FormField
                                        label="Acta Entrega-Recepción"
                                        id="actaEntrega"
                                        value={form.actaEntrega ?? ''}
                                        onChange={e => set('actaEntrega', e.target.value)}
                                        placeholder="Nombre o folio del acta"
                                    />
                                </div>

                                <div className="inv-add-field inv-add-field-full">
                                    <FormField
                                        label="Fuente de Origen"
                                        id="fuenteOrigen"
                                        value={form.fuenteOrigen ?? ''}
                                        onChange={e => set('fuenteOrigen', e.target.value)}
                                        placeholder="Ej: Donación, Adquisición directa..."
                                    />
                                </div>

                            </div>
                        )}

                        <div className="inv-add-separador inv-add-separador--bottom" />
                        <div className="inv-add-actions">
                            <Button type="button" variant="secondary" size="md" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" size="md">
                                {labelBotonPrimario}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>

            <div className="inv-add-side">
                <div className="inv-add-side-top">
                    <div className="inv-add-side-body">
                        <h3>Registro de <span>Bienes</span> IMSS Bienestar</h3>
                    </div>
                    <div className="inv-add-side-right">
                        <div className="inv-add-side-image inv-add-side-image--mobile">
                            <img src="imagotipo.png" alt="IMSS Bienestar" />
                        </div>
                    </div>
                </div>

                <div className="inv-add-side-list-wrap">
                    <ul className="inv-add-side-list">
                        <li>
                            <div className="inv-add-side-icon"><ClipboardList size={18} /></div>
                            <p>Registra los datos tal como aparecen en el documento que acredita la propiedad.</p>
                        </li>
                        <li>
                            <div className="inv-add-side-icon"><Tag size={18} /></div>
                            <p>El No. Inventario Anterior es el identificador previo del bien en el sistema institucional.</p>
                        </li>
                        <li>
                            <div className="inv-add-side-icon"><MapPin size={18} /></div>
                            <p>La CLUES y el Nombre de CLUES deben corresponder al establecimiento donde se resguarda el bien.</p>
                        </li>
                        <li>
                            <div className="inv-add-side-icon"><Building2 size={18} /></div>
                            <p>Los campos de documentación son opcionales pero recomendados para la trazabilidad del bien.</p>
                        </li>
                    </ul>
                </div>

                <div className="inv-add-side-bar" />
                <div className="inv-add-side-image inv-add-side-image--desktop">
                    <img src="imagotipo.png" alt="IMSS Bienestar" />
                </div>
            </div>

        </div>
    )
}

export default InventoryForm