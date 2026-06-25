import { useRef, useState } from 'react'
import type { FC } from 'react'
import { read, utils } from 'xlsx'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X, Info, ChevronDown, ChevronUp } from 'lucide-react'
import type { ItemInventario, EstadoInventario, NivelAtencion } from '../../../lib/types/types'
import Button from '../../atoms/Button/Button'
import './ImportExcelModal.css'

// ─── Tipos (Originales) ───────────────────────────────────────────────────────
interface Props {
  onCancel: () => void
  onImport: (items: Omit<ItemInventario, 'id'>[]) => void
}

type FilaRaw = Record<string, string>

interface FilaParsed extends Omit<ItemInventario, 'id'> {
  _errores: string[]
}

// ─── Constantes (Originales) ──────────────────────────────────────────────────
const ESTADOS_VALIDOS: EstadoInventario[] = ['F', 'B', 'R', 'M']

const NIVEL_MAP: Record<string, NivelAtencion> = {
  'PRIMER NIVEL': 'PRIMER NIVEL',
  'SEGUNDO NIVEL': 'SEGUNDO NIVEL',
  'TERCER NIVEL': 'TERCER NIVEL',
}

const COLUMNAS_GUIA = [
  { campo: 'NO INVENTARIO ANTERIOR', desc: 'Clave previa del bien' },
  { campo: 'RESPONSABLE DE LA UNIDAD MEDICA-ADMINISTRATIVA', desc: 'Nombre del responsable del bien' },
  { campo: 'DESCRIPCIÓN', desc: 'Descripción del bien (CPU, MONITOR, etc.)' },
  { campo: 'MARCA', desc: 'Marca del equipo' },
  { campo: 'MODELO', desc: 'Modelo específico' },
  { campo: 'SERIE', desc: 'Número de serie físico' },
  { campo: 'ENTIDAD FEDERATIVA', desc: 'Estado de la república' },
  { campo: 'CLUES', desc: 'Clave única de la unidad médica' },
  { campo: 'NOMBRE DE CLUES', desc: 'Nombre oficial de la unidad' },
  { campo: 'NIVEL DE ATENCIÓN', desc: 'PRIMER / SEGUNDO / TERCER NIVEL' },
  { campo: 'CUCOP', desc: 'Clave CUCOP del bien' },
  { campo: 'CABMS', desc: 'Clave CABMS del bien' },
  { campo: 'ESTADO FÍSICO FUNCIONAL/NO FUNCIONAL', desc: 'F = Bueno, B = Bajo resguardo, R = Regular, M = Malo' },
  { campo: 'OBSERVACIONES', desc: 'Notas adicionales (opcional)' },
]

// ─── Parser (Tu lógica original intacta) ──────────────────────────────────────
function get(raw: FilaRaw, ...keys: string[]): string {
  for (const k of keys) {
    const val = raw[k] ?? raw[k.toUpperCase()] ?? raw[k.toLowerCase()]
    if (val !== undefined && String(val).trim() !== '') return String(val).trim()
  }
  return ''
}

function parsearFila(raw: FilaRaw, idx: number): FilaParsed {
  const errores: string[] = []

  const marca = get(raw, 'MARCA')
  const noSerie = get(raw, 'SERIE', 'NO. SERIE')
  const clues = get(raw, 'CLUES')
  const estadoRaw = get(raw, 'ESTADO FÍSICO FUNCIONAL/NO FUNCIONAL', 'ESTADO FISICO FUNCIONAL/NO FUNCIONAL', 'ESTADO')
  const estadoCast = estadoRaw.toUpperCase() as EstadoInventario
  const nivelRaw = get(raw, 'NIVEL DE ATENCIÓN', 'NIVEL DE ATENCION', 'NIVEL').toUpperCase()

  if (!marca) errores.push('Sin marca')
  if (!noSerie) errores.push('Sin número de serie')
  if (!clues) errores.push('Sin CLUES')
  if (!ESTADOS_VALIDOS.includes(estadoCast)) errores.push(`Estado inválido: "${estadoRaw || 'vacío'}"`)

  const item: Omit<ItemInventario, 'id'> = {
    noInventario: get(raw, 'NO INVENTARIO ANTERIOR', 'NO_INVENTARIO'),
    responsable: get(raw, 'RESPONSABLE DE LA UNIDAD MEDICA-ADMINISTRATIVA', 'RESPONSABLE'),
    descripcion: get(raw, 'DESCRIPCIÓN', 'DESCRIPCION'),
    marca: marca || `Fila ${idx + 1}`,
    modelo: get(raw, 'MODELO') || '---',
    noSerie: noSerie || '---',
    entidadFederativa: get(raw, 'ENTIDAD FEDERATIVA', 'ENTIDAD'),
    clues,
    nombreClues: get(raw, 'NOMBRE DE CLUES', 'NOMBRE CLUES'),
    nivelAtencion: NIVEL_MAP[nivelRaw] ?? 'PRIMER NIVEL',
    cucop: get(raw, 'CUCOP'),
    cabms: get(raw, 'CABMS'),
    estado: ESTADOS_VALIDOS.includes(estadoCast) ? estadoCast : 'F',
    observaciones: get(raw, 'OBSERVACIONES'),
    fechaDocumento: get(raw, 'FECHA DEL DOCUMENTO QUE ACREDITA LA PROPIEDAD', 'FECHA DOC') || undefined,
    valorFactura: parseFloat(get(raw, 'VALOR FACTURA O DEL DOC CON IVA', 'VALOR FACTURA')) || undefined,
    valorLibros: parseFloat(get(raw, 'VALOR ACTUAL EN LIBROS', 'VALOR LIBROS')) || undefined,
    nombreArchivo: get(raw, 'FACTURA O DOC (NOMBRE DEL ARCHIVO)') || undefined,
    remision: get(raw, 'REMISION', 'REMISIÓN') || undefined,
    actaEntrega: get(raw, 'ACTA ENTREGA-RECEPCION', 'ACTA ENTREGA') || undefined,
    fuenteOrigen: get(raw, 'FUENTE DE ORIGEN') || undefined,
    categoria: 'equipocomputo',
  }

  return { ...item, _errores: errores }
}

// ─── Componente ───────────────────────────────────────────────────────────────
const ImportExcelModal: FC<Props> = ({ onCancel, onImport }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [filas, setFilas] = useState<FilaParsed[]>([])
  const [archivo, setArchivo] = useState('')
  const [paso, setPaso] = useState<'upload' | 'preview'>('upload')
  const [dragging, setDragging] = useState(false)
  const [verGuia, setVerGuia] = useState(false)

  const procesarArchivo = (file: File) => {
    setArchivo(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer)
      const wb = read(data, { type: 'array' })
      const hoja = wb.SheetNames.find(n =>
        !n.toLowerCase().includes('instruc') &&
        !n.toLowerCase().includes('clave') &&
        !n.toLowerCase().includes('descrip')
      ) ?? wb.SheetNames[0]
      const ws = wb.Sheets[hoja]
      const json: FilaRaw[] = utils.sheet_to_json(ws, { defval: '' })
      setFilas(json.map((row, i) => parsearFila(row, i)))
      setPaso('preview')
    }
    reader.readAsArrayBuffer(file)
  }

  const handleFile = (file?: File) => {
    if (!file) return
    if (!file.name.match(/\.xlsx?$/i)) {
      alert('Solo se aceptan archivos .xlsx o .xls')
      return
    }
    procesarArchivo(file)
  }

  const validas = filas.filter(f => f._errores.length === 0)
  const invalidas = filas.filter(f => f._errores.length > 0)

  const handleImport = () => {
    const items = validas.map(({ _errores: _e, ...rest }) => rest)
    onImport(items)
  }

  // PASO 1: SUBIR
  if (paso === 'upload') return (
    <div className="imp-card imp-card--upload">
      <div className="imp-header">
        <div className="imp-header-icon"><FileSpreadsheet size={24} /></div>
        <div className="imp-header-text">
          <h2>Importar desde Excel</h2>
          <p>Sube el archivo con el formato oficial IMSS Bienestar</p>
        </div>
        <button className="imp-close" onClick={onCancel}><X size={20} /></button>
      </div>

      <div className="imp-separador" />

      <div className="imp-body-scroll">
        <div
          className={`imp-dropzone${dragging ? ' imp-dropzone--drag' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={44} className="imp-dropzone-icon" />
          <h3>Arrastra tu archivo aquí</h3>
          <p>o haz clic para seleccionar</p>
          <span className="imp-dropzone-badge">EXCEL (.XLSX / .XLS)</span>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" hidden onChange={e => handleFile(e.target.files?.[0])} />
        </div>

        {/* Guía en modo Grid para evitar cortes */}
        <div className="imp-guia-container">
          <button
            className={`imp-guia-toggle ${verGuia ? 'open' : ''}`}
            onClick={() => setVerGuia(!verGuia)}
            type="button"
          >
            <Info size={18} />
            <span>Ver columnas requeridas en el Excel</span>
            {verGuia ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {verGuia && (
            <div className="imp-guia-grid">
              {COLUMNAS_GUIA.map(c => (
                <div key={c.campo} className="imp-guia-card">
                  <div className="imp-guia-tag"><code>{c.campo}</code></div>
                  <p className="imp-guia-txt">{c.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="imp-actions">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  )

  // PASO 2: PREVIEW
  return (
    <div className="imp-card imp-card--wide">
      <div className="imp-header">
        <div className="imp-header-icon"><FileSpreadsheet size={24} /></div>
        <div className="imp-header-text">
          <h2>Previsualizar importación</h2>
          <p className="imp-filename-text">{archivo}</p>
        </div>
        <button className="imp-close" onClick={onCancel}><X size={20} /></button>
      </div>

      <div className="imp-separador" />

      <div className="imp-resumen">
        <div className="imp-pill ok"><strong>{validas.length}</strong> Filas válidas</div>
        <div className="imp-pill err"><strong>{invalidas.length}</strong> Con errores</div>
        <div className="imp-pill total">Total: <strong>{filas.length}</strong></div>
      </div>

      <div className="imp-tabla-wrap">
        <table className="imp-tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Descripción</th>
              <th>Marca</th>
              <th>Serie</th>
              <th>CLUES</th>
              <th>Estado</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={i} className={f._errores.length > 0 ? 'fila-err' : ''}>
                <td>{i + 1}</td>
                <td className="imp-txt-truncate">{f.descripcion || '—'}</td>
                <td>{f.marca}</td>
                <td className="imp-mono">{f.noSerie}</td>
                <td className="imp-mono">{f.clues}</td>
                <td>
                  <span className={`imp-st st-${f.estado.toLowerCase()}`}>{f.estado}</span>
                </td>
                <td>
                  {f._errores.length === 0
                    ? <span className="badg-ok"><CheckCircle2 size={12} /> Válido</span>
                    : <span className="badg-err" title={f._errores.join(' · ')}>
                        <AlertCircle size={12} /> {f._errores[0]}
                      </span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="imp-actions">
        <Button variant="secondary" onClick={() => setPaso('upload')}>Atrás</Button>
        <Button
          variant="primary"
          onClick={handleImport}
          disabled={validas.length === 0}
        >
          Cargar {validas.length} registros
        </Button>
      </div>
    </div>
  )
}

export default ImportExcelModal