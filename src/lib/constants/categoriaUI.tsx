import {
    Monitor,
    Network,
    Package,
    Wrench,
} from 'lucide-react'
import type { CategoriaInventario } from '../types/types'
import type { ReactNode } from 'react'

interface CategoriaInfo {
    label: string
    icono: ReactNode
    color: string
}

const categoriaUI: Record<CategoriaInventario, CategoriaInfo> = {
    equipocomputo: {
        label: 'Equipo de Cómputo',
        icono: <Monitor size={28} />,
        color: '006657',
    },
    equipored: {
        label: 'Equipo de Red',
        icono: <Network size={28} />,
        color: '1565c0',
    },
    consumible: {
        label: 'Consumible',
        icono: <Package size={28} />,
        color: 'c6922b',
    },
    refaccion: {
        label: 'Refacción',
        icono: <Wrench size={28} />,
        color: '6a1e55',
    },
}

export const categoriaLabel = (cat: CategoriaInventario): string =>
    categoriaUI[cat]?.label ?? cat

export const categoriaIcono = (cat: CategoriaInventario): ReactNode =>
    categoriaUI[cat]?.icono ?? null

export const categoriaColor = (cat: CategoriaInventario): string =>
    categoriaUI[cat]?.color ?? '006657'

export default categoriaUI