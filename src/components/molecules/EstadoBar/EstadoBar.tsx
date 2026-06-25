import { useState } from 'react'
import type { EstadoInventario } from '../../../lib/types/types'
import './EstadoBar.css'

interface EstadoInfo {
    key: EstadoInventario
    label: string
    color: string
}

export const ESTADOS: EstadoInfo[] = [
    { key: 'M', label: 'Malo', color: 'f44336' },
    { key: 'R', label: 'Regular', color: 'ff9800' },
    { key: 'B', label: 'Bueno', color: '4caf50' },
    { key: 'F', label: 'Funcional', color: '2196f3' },
]

export const estadoLabel: Record<EstadoInventario, string> = {
    M: 'Malo',
    R: 'Regular',
    B: 'Bueno',
    F: 'Funcional',
}

type EstadoBarProps =
    | { mode: 'edit'; value: EstadoInventario | null; onChange: (estado: EstadoInventario) => void }
    | { mode: 'view'; estadoInventario: EstadoInventario }

export default function EstadoBar(props: EstadoBarProps) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)

    const currentIndex = props.mode === 'edit'
        ? props.value !== null ? ESTADOS.findIndex(e => e.key === props.value) : null
        : ESTADOS.findIndex(e => e.key === props.estadoInventario)

    const controllingIndex = props.mode === 'edit' && hoverIndex !== null ? hoverIndex : currentIndex
    const controllingEstado = controllingIndex !== null ? ESTADOS[controllingIndex] : null

    const showLabel = props.mode === 'edit'
        ? controllingEstado?.label ?? 'Sin estado seleccionado'
        : estadoLabel[props.estadoInventario]

    return (
        <div className="estado-selector-wrapper">
            <div className="estado-selector-line">
                {ESTADOS.map((estado, index) => {
                    const active = controllingIndex !== null && index === controllingIndex
                    const color = controllingEstado?.color
                    const className = [
                        'estado-selector-dot',
                        active ? 'estado-selector-dot--activo' : '',
                    ].filter(Boolean).join(' ')

                    if (props.mode === 'view') {
                        return (
                            <div
                                key={estado.key}
                                className={className}
                                style={active && color ? { backgroundColor: `#${color}` } : undefined}
                            />
                        )
                    }

                    return (
                        <button
                            key={estado.key}
                            type="button"
                            className={className}
                            style={active && color ? { backgroundColor: `#${color}` } : undefined}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onClick={() => props.onChange(estado.key)}
                            aria-label={estado.label}
                        />
                    )
                })}
            </div>
            <p className="estado-selector-text">{showLabel}</p>
        </div>
    )
}