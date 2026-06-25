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

// INVENTARIO
export type CategoriaInventario =
  | 'equipocomputo'
  | 'equipored'
  | 'consumible'
  | 'refaccion'

// F=Funcional, R=Regular, M=Malo, B=Bueno
export type EstadoInventario = 'F' | 'R' | 'M' | 'B'

// Alias para uso en EstadoBar y formularios — mismo tipo
export type EstadoClave = EstadoInventario

export type NivelAtencion = 'PRIMER NIVEL' | 'SEGUNDO NIVEL' | 'TERCER NIVEL'

export interface ItemInventario {
  id: number
  noInventario: string
  responsable: string
  descripcion: string
  marca: string
  modelo: string
  noSerie: string
  entidadFederativa: string
  clues: string
  nombreClues: string
  nivelAtencion: NivelAtencion
  cucop: string
  cabms: string
  estado: EstadoInventario
  observaciones: string
  categoria: CategoriaInventario
  fechaDocumento?: string
  valorFactura?: number
  valorLibros?: number
  nombreArchivo?: string
  remision?: string
  actaEntrega?: string
  fuenteOrigen?: string
}

// SOLICITUDES
export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada'

export interface SolicitudRecurso {
  id: number
  cluesSolicitante: string
  categoria: CategoriaInventario
  cantidad: number
  modelo: string
  descripcion: string
  estado: EstadoSolicitud
  fecha: string
}