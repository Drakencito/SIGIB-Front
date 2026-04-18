import { useState } from 'react'
import type { EstadoInventario } from '../../../lib/types/types'
import './EstadoBar.css'

export type EstadoClave = 'malo' | 'regular' | 'bueno'

interface EstadoInfo {
    key: EstadoClave
    label: string
    color: string
}

// Ahora solo mostramos 3 botones (Rojo, Amarillo, Verde)
export const ESTADOS: EstadoInfo[] = [
    { key: 'malo', label: 'Malo', color: '#f44336' },
    { key: 'regular', label: 'Regular', color: '#ff9800' },
    { key: 'bueno', label: 'Bueno', color: '#4caf50' }
]

export const estadoLabel: Record<EstadoInventario, string> = Object.fromEntries(
    ESTADOS.map(e => [e.key, e.label])
) as Record<EstadoInventario, string>

type EstadoBarProps = {
    mode: 'edit'
    value: EstadoClave | null
    onChange: (estado: EstadoClave) => void
} | {
    mode: 'view'
    estadoInventario: EstadoInventario
}

export default function EstadoBar(props: EstadoBarProps) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)

    const currentIndex = props.mode === 'edit'
        ? (props.value !== null ? ESTADOS.findIndex(e => e.key === props.value) : null)
        : ESTADOS.findIndex(e => e.key === props.estadoInventario)

    const controllingIndex = props.mode === 'edit' && hoverIndex !== null ? hoverIndex : currentIndex
    const controllingEstado = controllingIndex !== null ? ESTADOS[controllingIndex] : null

    const showLabel = props.mode === 'edit'
        ? (controllingEstado?.label ?? 'Sin estado seleccionado')
        : estadoLabel[props.estadoInventario]

    return (
        <div className="estado-selector-wrapper">
            <div className="estado-selector-line">
                {ESTADOS.map((estado, index) => {
                    const active = controllingIndex !== null && index <= controllingIndex
                    const color = controllingEstado?.color

                    const className = [
                        'estado-selector-dot',
                        active ? 'estado-selector-dot--activo' : ''
                    ].filter(Boolean).join(' ')

                    if (props.mode === 'view') {
                        return (
                            <div
                                key={estado.key}
                                className={className}
                                style={active && color ? { backgroundColor: color } : undefined}
                            />
                        )
                    }

                    return (
                        <button
                            key={estado.key}
                            type="button"
                            className={className}
                            style={active && color ? { backgroundColor: color } : undefined}
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