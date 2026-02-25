export interface UsuarioDummy {
  clues: string
  password: string
  nombre: string
  rol: 'admin' | 'operador' | 'consulta'
}

export const USUARIOS: UsuarioDummy[] = [
  { clues: 'CHIS001', password: 'imss2026', nombre: 'Dr. Carlos Mendoza Ruiz', rol: 'admin' },
  { clues: 'CHIS002', password: 'imss2026', nombre: 'Enf. María García López', rol: 'operador' },
  { clues: 'CHIS003', password: 'imss2026', nombre: 'Lic. Juan Pérez Hernández', rol: 'consulta' },
]
