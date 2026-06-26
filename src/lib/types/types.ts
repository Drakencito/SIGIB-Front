export interface UsuarioAuth {
  clues: string
  nombre: string
  rol: 'admin' | 'operador' | 'consulta'
}

export type EstatusUnidad = 'activa' | 'inactiva'

export interface UnidadMedica {
  clues: string
  nombre: string
  clave: string
  municipio: string
  localidad: string
  estatus: EstatusUnidad
}

export type RolEmpleado = 'admin' | 'operador' | 'consulta'

export interface Empleado {
  id: number
  nombre: string
  rfc: string
  curp: string
  cluesAdscripcion: string
  cluesActual: string
  departamento: string
  rol: RolEmpleado
}

export type CategoriaInventario = 'equipocomputo' | 'equipored' | 'consumible' | 'refaccion'
export type EstadoInventario = 'malo' | 'regular' | 'bueno'
export type EstadoClave = EstadoInventario
export type NivelAtencion = 'PRIMER NIVEL' | 'SEGUNDO NIVEL' | 'TERCER NIVEL'

export interface ItemInventario {
  id: number
  marca: string
  modelo: string
  noSerie: string
  descripcion: string
  categoria: CategoriaInventario
  departamento: string
  estado: EstadoInventario
  clues: string
  noInventario: string
  nombreGenerico: string
  clasImpr: string
  subrogado: 'SI' | 'NO'
  nombreEmpresa: string
  funcional: 'SI' | 'NO'
  motivoFuncionamiento: string
  observaciones: string
  resguardo: string
}

export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada'
export type TipoConsumible = 'toner' | 'tinta'
export type TipoImpresora = 'laser' | 'tinta'
export type CompatibilidadConsumible = 'original' | 'compatible' | 'original/compatible'

export interface DetalleSolicitudConsumible {
  id: number
  tipoImpresora: TipoImpresora
  marcaModeloImpresora: string
  consumible: string
  compatibilidad: CompatibilidadConsumible
  cantidadTrimestral: number
}

export interface SolicitudRecurso {
  id: number
  cluesSolicitante: string
  entidadFederativa: string
  unidadMedica: string
  ubicacion: string
  nombreResponsable: string
  cargoResponsable: string
  telefonoResponsable: string
  correoResponsable: string
  proveedorFotocopiado?: string
  cantidadFotocopiadoTrimestral?: number | ''
  observaciones: string
  detalles: DetalleSolicitudConsumible[]
  estado: EstadoSolicitud
  fecha: string
}