import { useEffect, type FC, type ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
    onClose: () => void
    children: ReactNode
}

const Modal: FC<ModalProps> = ({ onClose, children }) => {

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <div
            className="modal-backdrop"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            {children}
        </div>
    )
}

export default Modal
