import type { FC, ReactNode } from 'react'
import './SummaryCard.css'

interface SummaryCardProps {
    icono: ReactNode
    titulo: string
    subtitulo: string
    activo?: boolean
    onClick?: () => void
}

const SummaryCard: FC<SummaryCardProps> = ({ icono, titulo, subtitulo, activo, onClick }) => {
    return (
        <div
            className={`summary-card${activo ? ' summary-card--activo' : ''}${onClick ? ' summary-card--clickable' : ''}`}
            onClick={onClick}
        >
            <div className="summary-card-top-green" />
            <div className="summary-card-top-gold" />
            <div className="summary-card-content">
                <div className="summary-card-icon-circle">{icono}</div>
                <div className="summary-card-texts">
                    <div className="summary-card-title">{titulo}</div>
                    <div className="summary-card-sub">{subtitulo}</div>
                </div>
            </div>
        </div>
    )
}

export default SummaryCard
