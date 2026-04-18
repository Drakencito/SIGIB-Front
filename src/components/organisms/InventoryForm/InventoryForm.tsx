import { useState, useCallback, useEffect } from 'react'
import type { FC } from 'react'
import { CheckCircle2, MonitorSmartphone, Hand, Info, ChevronDown, ChevronUp } from 'lucide-react'
import type { ItemInventario } from '../../../lib/types/types'
import { categoriaLabel } from '../../../lib/constants/categoriaUI'
import { UNIDADES } from '../../../lib/constants/unidades'
import FormField from '../../molecules/Formfield/FormField'
import SelectField from '../../molecules/SelectField/SelectField'
import EstadoBar from '../../molecules/EstadoBar/EstadoBar'
import type { EstadoClave } from '../../molecules/EstadoBar/EstadoBar'
import Button from '../../atoms/Button/Button'
import Modal from '../Modal/Modal'
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal'
import './InventoryForm.css'

interface InventoryFormProps {
    modo: 'crear' | 'editar'
    itemActual?: ItemInventario | null
    estadoForm: EstadoClave | null
    onEstadoChange: (estado: EstadoClave) => void
    onCancel: () => void
    onSubmit: () => void
}

type FormState = {
    noInventario: string
    nombreGenerico: string
    marca: string
    modelo: string
    noSerie: string
    descripcion: string
    categoria: string
    clasImpr: string
    departamento: string
    clues: string
    subrogado: string
    nombreEmpresa: string
    funcional: string
    motivoFuncionamiento: string
    observaciones: string
    resguardo: string
}

type Errores = Partial<Record<keyof FormState | 'estado', string>>

const REQUERIDOS: (keyof FormState)[] = ['marca', 'modelo', 'categoria', 'departamento', 'noSerie', 'clues', 'nombreGenerico', 'subrogado', 'funcional']

const InventoryForm: FC<InventoryFormProps> = ({
    modo,
    itemActual,
    estadoForm,
    onEstadoChange,
    onCancel,
    onSubmit
}) => {
    const esEditar = modo === 'editar'

    const [form, setForm] = useState<FormState>({
        noInventario: itemActual?.noInventario || '',
        nombreGenerico: itemActual?.nombreGenerico || itemActual?.descripcion || '',
        marca: itemActual?.marca || '',
        modelo: itemActual?.modelo || '',
        noSerie: itemActual?.noSerie || '',
        descripcion: itemActual?.descripcion || '',
        categoria: itemActual?.categoria || '',
        clasImpr: itemActual?.clasImpr || '',
        departamento: itemActual?.departamento || '',
        clues: itemActual?.clues || '',
        subrogado: itemActual?.subrogado || '',
        nombreEmpresa: itemActual?.nombreEmpresa || '',
        funcional: itemActual?.funcional || '',
        motivoFuncionamiento: itemActual?.motivoFuncionamiento || '',
        observaciones: itemActual?.observaciones || '',
        resguardo: itemActual?.resguardo || '',
    })

    const [errores, setErrores] = useState<Errores>({})
    const [intentado, setIntentado] = useState(false)
    const [showUnsaved, setShowUnsaved] = useState(false)
    const [showIndicaciones, setShowIndicaciones] = useState(false)

    const set = (campo: keyof FormState, valor: string) => {
        const nuevo = { ...form, [campo]: valor }
        setForm(nuevo)
        if (intentado) {
            setErrores(prev => ({ ...prev, [campo]: valor ? undefined : prev[campo] }))
        }
    }

    const validar = (f: FormState, estado: EstadoClave | null): Errores => {
        const errs: Errores = {}
        REQUERIDOS.forEach(k => {
            if (!f[k]) errs[k] = 'Campo obligatorio'
        })
        if (!estado) errs.estado = 'Selecciona un estado'
        return errs
    }

    const isDirty = useCallback(() => {
        if (!esEditar) {
            return Object.values(form).some(v => v !== '') || estadoForm !== null
        }
        return (
            form.marca !== (itemActual?.marca ?? '') ||
            form.modelo !== (itemActual?.modelo ?? '') ||
            form.descripcion !== (itemActual?.descripcion ?? '') ||
            form.categoria !== (itemActual?.categoria ?? '') ||
            form.departamento !== (itemActual?.departamento ?? '') ||
            form.noSerie !== (itemActual?.noSerie ?? '') ||
            form.clues !== (itemActual?.clues ?? '') ||
            form.subrogado !== (itemActual?.subrogado ?? '') ||
            form.funcional !== (itemActual?.funcional ?? '') ||
            form.nombreGenerico !== (itemActual?.nombreGenerico ?? '') ||
            estadoForm !== (itemActual?.estado ?? null)
        )
    }, [form, estadoForm, esEditar, itemActual])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopImmediatePropagation()
                if (isDirty()) setShowUnsaved(true)
                else onCancel()
            }
        }
        document.addEventListener('keydown', handler, true)
        return () => document.removeEventListener('keydown', handler, true)
    }, [isDirty, onCancel])

    const handleCancel = () => {
        if (isDirty()) setShowUnsaved(true)
        else onCancel()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIntentado(true)
        const errs = validar(form, estadoForm)
        if (Object.keys(errs).length > 0) {
            setErrores(errs)
            return
        }
        onSubmit()
    }

    return (
        <div className="inv-add-card">
            <aside className="inv-add-side">
                <div className="inv-add-side-top">
                    <div className="inv-add-side-body">
                        <h3>Indicaciones para el<br /> <span>Registro</span> de equipos</h3>
                    </div>
                    <div className="inv-add-side-right">
                        <button
                            type="button"
                            className="inv-add-side-toggle"
                            onClick={() => setShowIndicaciones(v => !v)}
                            aria-label="Ver indicaciones"
                        >
                            <Info size={16} />
                            {showIndicaciones ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <div className="inv-add-side-image inv-add-side-image--mobile">
                            <img src="/imagotipo.png" alt="IMSS Bienestar" />
                        </div>
                    </div>
                </div>

                <div className={`inv-add-side-list-wrap${showIndicaciones ? ' inv-add-side-list-wrap--open' : ''}`}>
                    <ul className="inv-add-side-list">
                        <li>
                            <span className="inv-add-side-icon"><CheckCircle2 size={18} /></span>
                            <p>Verifica que la marca y modelo coincidan con la etiqueta física.</p>
                        </li>
                        <li>
                            <span className="inv-add-side-icon"><MonitorSmartphone size={18} /></span>
                            <p>Captura el número de serie exactamente como aparece.</p>
                        </li>
                        <li>
                            <span className="inv-add-side-icon"><Hand size={18} /></span>
                            <p>Selecciona la unidad médica correcta según su CLUES.</p>
                        </li>
                    </ul>
                </div>

                <div className="inv-add-side-bar"></div>
                <div className="inv-add-side-image inv-add-side-image--desktop">
                    <img src="/imagotipo.png" alt="IMSS Bienestar" />
                </div>
            </aside>

            <div className="inv-add-main">
                <header className="inv-add-header">
                    <h2>{esEditar ? 'Editar equipo' : 'Registrar nuevo equipo'}</h2>
                    <p>
                        {esEditar
                            ? 'Actualiza los datos del equipo seleccionado.'
                            : 'Captura los datos del equipo para agregarlo al inventario.'}
                    </p>
                </header>

                <div className="inv-add-separador"></div>

                <div className="inv-add-form-scroll">
                    <form id="inv-form" onSubmit={handleSubmit} noValidate>
                        <div className="inv-add-grid">

                            <div className={`inv-add-field${errores.noInventario ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    id="inv-noInventario"
                                    label="No. de Inventario"
                                    type="text"
                                    value={form.noInventario}
                                    onChange={e => set('noInventario', e.target.value)}
                                    placeholder="Ej. IMSS-00001"
                                />
                            </div>

                            <div className={`inv-add-field${errores.nombreGenerico ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    id="inv-nombreGenerico"
                                    label="Nombre Genérico"
                                    type="text"
                                    value={form.nombreGenerico}
                                    onChange={e => set('nombreGenerico', e.target.value)}
                                    placeholder="Ej. COMPUTADORA DE ESCRITORIO"
                                />
                                {errores.nombreGenerico && <span className="inv-field-error">{errores.nombreGenerico}</span>}
                            </div>

                            <div className={`inv-add-field${errores.marca ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    id="inv-marca"
                                    label="Marca"
                                    type="text"
                                    value={form.marca}
                                    onChange={e => set('marca', e.target.value)}
                                    placeholder="Ej. Dell"
                                />
                                {errores.marca && <span className="inv-field-error">{errores.marca}</span>}
                            </div>

                            <div className={`inv-add-field${errores.modelo ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    id="inv-modelo"
                                    label="Modelo"
                                    type="text"
                                    value={form.modelo}
                                    onChange={e => set('modelo', e.target.value)}
                                    placeholder="Ej. OptiPlex 3090"
                                />
                                {errores.modelo && <span className="inv-field-error">{errores.modelo}</span>}
                            </div>

                            <div className={`inv-add-field${errores.noSerie ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    id="inv-serie"
                                    label="No. de serie"
                                    type="text"
                                    value={form.noSerie}
                                    onChange={e => set('noSerie', e.target.value)}
                                    placeholder="Ej. DL3090-CHX-001"
                                />
                                {errores.noSerie && <span className="inv-field-error">{errores.noSerie}</span>}
                            </div>

                            <div className={`inv-add-field${errores.categoria ? ' inv-add-field--error' : ''}`}>
                                <SelectField
                                    id="inv-categoria"
                                    label="Categoría"
                                    value={form.categoria}
                                    onChange={e => set('categoria', e.target.value)}
                                >
                                    <option value="">Seleccione categoría</option>
                                    {Object.entries(categoriaLabel).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </SelectField>
                                {errores.categoria && <span className="inv-field-error">{errores.categoria}</span>}
                            </div>

                            <div className="inv-add-field">
                                <SelectField
                                    id="inv-subrogado"
                                    label="Subrogado"
                                    value={form.subrogado}
                                    onChange={e => set('subrogado', e.target.value)}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="SI">Sí</option>
                                    <option value="NO">No</option>
                                </SelectField>
                            </div>

                            <div className="inv-add-field">
                                <FormField
                                    id="inv-nombreEmpresa"
                                    label="Nombre Empresa (si es subrogado)"
                                    type="text"
                                    value={form.nombreEmpresa}
                                    onChange={e => set('nombreEmpresa', e.target.value)}
                                    placeholder="Ej. HP Leasing"
                                    disabled={form.subrogado !== 'SI'}
                                />
                            </div>

                            <div className={`inv-add-field${errores.departamento ? ' inv-add-field--error' : ''}`}>
                                <FormField
                                    id="inv-departamento"
                                    label="Departamento"
                                    type="text"
                                    value={form.departamento}
                                    onChange={e => set('departamento', e.target.value)}
                                    placeholder="Ej. Enfermería"
                                />
                                {errores.departamento && <span className="inv-field-error">{errores.departamento}</span>}
                            </div>

                            <div className={`inv-add-field${errores.clues ? ' inv-add-field--error' : ''}`}>
                                <SelectField
                                    id="inv-clues"
                                    label="Unidad médica (CLUES)"
                                    value={form.clues}
                                    onChange={e => set('clues', e.target.value)}
                                >
                                    <option value="">Seleccione unidad</option>
                                    {UNIDADES.filter(u => u.estatus === 'activa').map(u => (
                                        <option key={u.clues} value={u.clues}>{u.clues} - {u.nombre}</option>
                                    ))}
                                </SelectField>
                                {errores.clues && <span className="inv-field-error">{errores.clues}</span>}
                            </div>

                            <div className="inv-add-field">
                                <SelectField
                                    id="inv-funcional"
                                    label="¿Es Funcional?"
                                    value={form.funcional}
                                    onChange={e => set('funcional', e.target.value)}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="SI">Sí</option>
                                    <option value="NO">No</option>
                                </SelectField>
                            </div>

                            <div className="inv-add-field">
                                <FormField
                                    id="inv-motivoFuncionamiento"
                                    label="Motivo (Si no es funcional)"
                                    type="text"
                                    value={form.motivoFuncionamiento}
                                    onChange={e => set('motivoFuncionamiento', e.target.value)}
                                    placeholder="Ej. Tarjeta madre dañada"
                                    disabled={form.funcional !== 'NO'}
                                />
                            </div>

                            <div className="inv-add-field">
                                <FormField
                                    id="inv-resguardo"
                                    label="Resguardo"
                                    type="text"
                                    value={form.resguardo}
                                    onChange={e => set('resguardo', e.target.value)}
                                    placeholder="Nombre del responsable"
                                />
                            </div>

                            <div className="inv-add-field">
                                <FormField
                                    id="inv-clasImpr"
                                    label="Clasificación Impresora"
                                    type="text"
                                    value={form.clasImpr}
                                    onChange={e => set('clasImpr', e.target.value)}
                                    placeholder="Ej. K, L"
                                />
                            </div>

                            <div className="inv-add-field inv-add-field-full">
                                <FormField
                                    id="inv-descripcion"
                                    label="Descripción"
                                    type="text"
                                    value={form.descripcion}
                                    onChange={e => set('descripcion', e.target.value)}
                                    placeholder="Descripción breve del equipo"
                                />
                            </div>

                            <div className="inv-add-field inv-add-field-full">
                                <FormField
                                    id="inv-observaciones"
                                    label="Observaciones"
                                    type="text"
                                    value={form.observaciones}
                                    onChange={e => set('observaciones', e.target.value)}
                                    placeholder="Detalles adicionales"
                                />
                            </div>

                            <div className="inv-add-field inv-add-field-full" style={{ marginTop: '0.5rem' }}>
                                <label className="inv-add-estado-label">
                                    Estado
                                    {errores.estado && <span className="inv-field-error inv-field-error--inline">{errores.estado}</span>}
                                </label>
                                <EstadoBar
                                    mode="edit"
                                    value={estadoForm}
                                    onChange={(v) => {
                                        onEstadoChange(v)
                                        if (intentado) setErrores(prev => ({ ...prev, estado: undefined }))
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="inv-add-separador inv-add-separador--bottom"></div>

                <div className="inv-add-actions">
                    <Button variant="secondary" size="md" type="button" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button variant="primary" size="md" type="submit" form="inv-form">
                        {esEditar ? 'Actualizar' : 'Guardar'}
                    </Button>
                </div>
            </div>

            {showUnsaved && (
                <Modal onClose={() => setShowUnsaved(false)}>
                    <ConfirmDeleteModal
                        titulo="¿Descartar cambios?"
                        mensaje="Tienes cambios sin guardar. Si cierras ahora se perderán."
                        labelConfirmar="Sí, Descartar"
                        onCancel={() => setShowUnsaved(false)}
                        onConfirm={() => {
                            setShowUnsaved(false)
                            onCancel()
                        }}
                    />
                </Modal>
            )}
        </div>
    )
}

export default InventoryForm