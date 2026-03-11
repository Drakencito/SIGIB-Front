import {
    createContext, useContext, useState,
    useCallback, type ReactNode
} from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import './Toast.css'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: number
    message: string
    type: ToastType
}

interface ToastContextValue {
    addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

const ICONS: Record<ToastType, ReactNode> = {
    success: <CheckCircle2 size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = ++nextId
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3500)
    }, [])

    const remove = (id: number) =>
        setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-stack">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast--${t.type}`}>
                        <span className="toast-icon">{ICONS[t.type]}</span>
                        <span className="toast-msg">{t.message}</span>
                        <button
                            className="toast-close"
                            onClick={() => remove(t.id)}
                            aria-label="Cerrar"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
    return ctx
}
