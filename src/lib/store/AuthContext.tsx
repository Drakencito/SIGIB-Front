import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { UsuarioAuth } from '../types/types'
import { USUARIOS } from '../constants/users'

interface AuthContextType {
  usuario: UsuarioAuth | null
  login: (clues: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  login: () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null)

  const login = (clues: string, password: string): boolean => {
    const encontrado = USUARIOS.find(
      u => u.clues === clues && u.password === password
    )
    if (encontrado) {
      setUsuario({ clues: encontrado.clues, nombre: encontrado.nombre, rol: encontrado.rol })
      return true
    }
    return false
  }

  const logout = () => setUsuario(null)

  const value = useMemo(() => ({ usuario, login, logout }), [usuario])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth(): AuthContextType {
  return useContext(AuthContext)
}
