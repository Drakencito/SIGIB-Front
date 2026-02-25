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
    | 'equipo_computo'
    | 'equipo_red'
    | 'consumible_tinta'
    | 'consumible_toner'
    | 'refaccion'
  
  export type EstadoInventario = 'excelente' | 'bueno' | 'malo' | 'muy_malo'
  
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
  