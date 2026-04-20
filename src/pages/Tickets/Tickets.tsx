import { useState, useRef, useEffect, useMemo } from 'react'
import {
    MessageSquare,
    Plus,
    Send,
    CheckCircle2,
    TicketIcon,
    ArrowLeft,
    Search,
    Paperclip,
    ShieldAlert
} from 'lucide-react'
import { useAuth } from '../../lib/store/AuthContext'
import { useToast } from '../../lib/store/ToastContext'
import { UNIDADES } from '../../lib/constants/unidades'
import Button from '../../components/atoms/Button/Button'
import Badge from '../../components/atoms/Badge/Badge'
import Modal from '../../components/organisms/Modal/Modal'
import FormField from '../../components/molecules/Formfield/FormField'
import SelectField from '../../components/molecules/SelectField/SelectField'

import './Tickets.css'

type Prioridad = 'baja' | 'media' | 'alta'
type EstadoTicket = 'abierto' | 'resuelto'

interface Mensaje {
    id: number
    autor: string
    texto: string
    hora: string
}

interface Ticket {
    id: number
    titulo: string
    descripcion: string
    cluesSolicitante: string
    prioridad: Prioridad
    estado: EstadoTicket
    fechaCreacion: string
    mensajes: Mensaje[]
}

const MOCK_TICKETS: Ticket[] = [
    {
        id: 101,
        titulo: 'Fallo en sistema de red local',
        descripcion: 'No tenemos acceso a internet en los consultorios 3 y 4 desde ayer en la mañana. Ya revisamos los cables.',
        cluesSolicitante: 'CSIMB000035',
        prioridad: 'alta',
        estado: 'abierto',
        fechaCreacion: '2026-04-06',
        mensajes: [
            { id: 1, autor: 'CSIMB000035', texto: 'Hola, abro este ticket porque no tenemos red en dos consultorios.', hora: '09:00 AM' },
            { id: 2, autor: 'admin', texto: 'Enterado. ¿Ya intentaron reiniciar el switch principal que está en el pasillo?', hora: '09:15 AM' },
            { id: 3, autor: 'CSIMB000035', texto: 'Sí, lo reiniciamos pero los focos siguen en rojo intermitente.', hora: '09:20 AM' }
        ]
    },
    {
        id: 102,
        titulo: 'Duda sobre solicitud de tóner',
        descripcion: 'Quiero saber si mi solicitud de tóner Brother ya fue enviada porque nos urge en urgencias.',
        cluesSolicitante: 'CSIMB000076',
        prioridad: 'baja',
        estado: 'resuelto',
        fechaCreacion: '2026-04-02',
        mensajes: [
            { id: 1, autor: 'CSIMB000076', texto: 'Buen día, ¿saben cuándo llega el pedido de consumibles que hicimos el lunes?', hora: '11:00 AM' },
            { id: 2, autor: 'admin', texto: 'Hola, verificando en sistema... Sale mañana a primera hora hacia tu unidad.', hora: '12:30 PM' },
            { id: 3, autor: 'CSIMB000076', texto: 'Perfecto, muchísimas gracias. Quedo al pendiente.', hora: '01:00 PM' }
        ]
    },
    {
        id: 103,
        titulo: 'Impresora mancha las hojas',
        descripcion: 'La impresora del área de recepción está imprimiendo con rayas negras en el borde derecho de la hoja.',
        cluesSolicitante: 'CSIMB000303',
        prioridad: 'media',
        estado: 'abierto',
        fechaCreacion: '2026-04-07',
        mensajes: [
            { id: 1, autor: 'CSIMB000303', texto: 'Buen día. La impresora de recepción está dejando rayas negras en todas las recetas.', hora: '08:45 AM' },
            { id: 2, autor: 'admin', texto: 'Parece ser un problema del tambor del tóner. ¿Hace cuánto lo cambiaron?', hora: '09:10 AM' }
        ]
    },
    {
        id: 104,
        titulo: 'Actualización de Sistema SIGIB',
        descripcion: 'Las computadoras de enfermería no abren el módulo nuevo de inventario, marca error 404.',
        cluesSolicitante: 'CSIMB000035',
        prioridad: 'alta',
        estado: 'abierto',
        fechaCreacion: '2026-04-07',
        mensajes: [
            { id: 1, autor: 'CSIMB000035', texto: 'Soporte, urge apoyo. Enfermería no puede cargar los equipos al inventario por error 404.', hora: '10:30 AM' }
        ]
    },
    {
        id: 105,
        titulo: 'Solicitud de Cable HDMI',
        descripcion: 'Necesitamos un cable HDMI de 5 metros para conectar la laptop al proyector de la sala de juntas.',
        cluesSolicitante: 'CSIMB000076',
        prioridad: 'baja',
        estado: 'abierto',
        fechaCreacion: '2026-04-07',
        mensajes: [
            { id: 1, autor: 'CSIMB000076', texto: 'Hola. ¿Podrían autorizarnos un cable HDMI largo? Hice la solicitud en el módulo de insumos.', hora: '11:15 AM' },
            { id: 2, autor: 'admin', texto: 'Claro, reviso la solicitud en un momento y la apruebo.', hora: '11:30 AM' }
        ]
    },
    {
        id: 106,
        titulo: 'Teclado con teclas atoradas',
        descripcion: 'El teclado de la computadora del consultorio 1 tiene varias teclas que no funcionan (barra espaciadora y enter).',
        cluesSolicitante: 'CSIMB000303',
        prioridad: 'media',
        estado: 'resuelto',
        fechaCreacion: '2026-04-01',
        mensajes: [
            { id: 1, autor: 'CSIMB000303', texto: 'El teclado del consultorio 1 falló por completo.', hora: '02:00 PM' },
            { id: 2, autor: 'admin', texto: 'Enviaremos un kit nuevo mañana con la paquetería.', hora: '03:15 PM' },
            { id: 3, autor: 'CSIMB000303', texto: 'Equipo recibido e instalado. Gracias.', hora: '10:00 AM' }
        ]
    },
    {
        id: 107,
        titulo: 'Falla eléctrica en UPS',
        descripcion: 'El No-Break del site principal está pitando constantemente y marca luz roja.',
        cluesSolicitante: 'CSIMB000035',
        prioridad: 'alta',
        estado: 'abierto',
        fechaCreacion: '2026-04-07',
        mensajes: [
            { id: 1, autor: 'CSIMB000035', texto: 'Alerta en el Site, el UPS está pitando sin parar.', hora: '12:45 PM' }
        ]
    },
    {
        id: 108,
        titulo: 'Ratón USB no detectado',
        descripcion: 'Al conectar el mouse en el puerto frontal, Windows dice que el dispositivo no se reconoce.',
        cluesSolicitante: 'CSIMB000076',
        prioridad: 'baja',
        estado: 'resuelto',
        fechaCreacion: '2026-03-28',
        mensajes: [
            { id: 1, autor: 'CSIMB000076', texto: 'Los puertos USB frontales no leen mi ratón.', hora: '10:00 AM' },
            { id: 2, autor: 'admin', texto: 'Conéctalo en los puertos de atrás, directamente a la tarjeta madre. Los frontales pueden estar dañados.', hora: '10:15 AM' },
            { id: 3, autor: 'CSIMB000076', texto: 'Solucionado, atrás sí funciona bien.', hora: '10:20 AM' }
        ]
    },
    {
        id: 109,
        titulo: 'Error de inicio de sesión de enfermera',
        descripcion: 'Una enfermera olvidó su contraseña y el sistema no le permite restaurarla.',
        cluesSolicitante: 'CSIMB000303',
        prioridad: 'media',
        estado: 'abierto',
        fechaCreacion: '2026-04-07',
        mensajes: [
            { id: 1, autor: 'CSIMB000303', texto: '¿Podrían resetear la contraseña del usuario ENF-04?', hora: '01:30 PM' },
            { id: 2, autor: 'admin', texto: 'Contraseña reseteada temporalmente a "Temporal123". Pídele que ingrese y la cambie.', hora: '01:45 PM' }
        ]
    },
    {
        id: 110,
        titulo: 'Disco duro lleno',
        descripcion: 'La computadora del director marca que tiene 0 bytes disponibles en el disco local C.',
        cluesSolicitante: 'CSIMB000035',
        prioridad: 'alta',
        estado: 'resuelto',
        fechaCreacion: '2026-03-25',
        mensajes: [
            { id: 1, autor: 'CSIMB000035', texto: 'La PC de dirección ya no deja guardar ni un Word, disco lleno.', hora: '09:00 AM' },
            { id: 2, autor: 'admin', texto: 'Me conecto vía remota para limpiar archivos temporales.', hora: '09:20 AM' },
            { id: 3, autor: 'admin', texto: 'Listo, liberé 40GB borrando descargas y temporales. Ya puede trabajar.', hora: '10:00 AM' }
        ]
    },
    {
        id: 111,
        titulo: 'Cámara web no enciende',
        descripcion: 'Para la videollamada nacional, la cámara Logitech no da imagen, solo se ve negro.',
        cluesSolicitante: 'CSIMB000076',
        prioridad: 'media',
        estado: 'abierto',
        fechaCreacion: '2026-04-07',
        mensajes: [
            { id: 1, autor: 'CSIMB000076', texto: 'Ayuda, tenemos junta en 20 minutos y la cámara no da imagen.', hora: '03:10 PM' }
        ]
    },
    {
        id: 112,
        titulo: 'Monitor parpadea',
        descripcion: 'El monitor parpadea cada 5 segundos y los colores se ven amarillentos.',
        cluesSolicitante: 'CSIMB000303',
        prioridad: 'media',
        estado: 'resuelto',
        fechaCreacion: '2026-03-20',
        mensajes: [
            { id: 1, autor: 'CSIMB000303', texto: 'Monitor fallando en farmacia.', hora: '11:00 AM' },
            { id: 2, autor: 'admin', texto: 'Revisen si el cable VGA/HDMI está bien apretado de ambos lados.', hora: '11:10 AM' },
            { id: 3, autor: 'CSIMB000303', texto: 'Era eso, estaba flojo. Ya se ve normal.', hora: '11:15 AM' }
        ]
    }
]

export default function Tickets() {
    const auth = useAuth()
    const usuario = auth?.usuario
    const { addToast } = useToast()
    const chatEndRef = useRef<HTMLDivElement>(null)

    const esAdmin = usuario?.rol === 'admin'
    const miClues = usuario?.clues || 'CSIMB000035'

    const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS)
    const [filtroEstado, setFiltroEstado] = useState<'abierto' | 'resuelto'>('abierto')
    const [busqueda, setBusqueda] = useState('')
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const [isCreating, setIsCreating] = useState(false)
    const [nuevoTitulo, setNuevoTitulo] = useState('')
    const [nuevaDesc, setNuevaDesc] = useState('')
    const [nuevaPrio, setNuevaPrio] = useState<Prioridad>('media')

    const [mensajeInput, setMensajeInput] = useState('')

    const ticketsVisibles = useMemo(() => {
        return tickets.filter(t => {
            const matchUser = esAdmin || t.cluesSolicitante === miClues
            const matchEstado = t.estado === filtroEstado
            const textoBusqueda = busqueda.toLowerCase()

            const matchBusqueda =
                t.titulo.toLowerCase().includes(textoBusqueda) ||
                t.cluesSolicitante.toLowerCase().includes(textoBusqueda) ||
                t.descripcion.toLowerCase().includes(textoBusqueda)

            return matchUser && matchEstado && matchBusqueda
        })
    }, [tickets, filtroEstado, busqueda, esAdmin, miClues])

    const ticketActivo = tickets.find(t => t.id === selectedId)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [ticketActivo?.mensajes])

    const handleCrearTicket = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nuevoTitulo.trim() || !nuevaDesc.trim()) return

        const nuevoTicket: Ticket = {
            id: Date.now(),
            titulo: nuevoTitulo.trim(),
            descripcion: nuevaDesc.trim(),
            cluesSolicitante: miClues,
            prioridad: nuevaPrio,
            estado: 'abierto',
            fechaCreacion: new Date().toISOString().split('T')[0],
            mensajes: [
                {
                    id: Date.now(),
                    autor: miClues,
                    texto: nuevaDesc.trim(),
                    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]
        }

        setTickets([nuevoTicket, ...tickets])
        setIsCreating(false)
        setNuevoTitulo('')
        setNuevaDesc('')
        setNuevaPrio('media')
        setSelectedId(nuevoTicket.id)
        setFiltroEstado('abierto')
        setBusqueda('')
        addToast('Ticket creado exitosamente', 'success')
    }

    const handleEnviarMensaje = () => {
        if (!mensajeInput.trim() || !ticketActivo) return

        const nuevoMensaje: Mensaje = {
            id: Date.now(),
            autor: esAdmin ? 'admin' : miClues,
            texto: mensajeInput.trim(),
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setTickets(prev =>
            prev.map(t =>
                t.id === ticketActivo.id
                    ? { ...t, mensajes: [...t.mensajes, nuevoMensaje] }
                    : t
            )
        )

        setMensajeInput('')
    }

    const handleResolver = () => {
        if (!ticketActivo) return

        setTickets(prev =>
            prev.map(t =>
                t.id === ticketActivo.id ? { ...t, estado: 'resuelto' } : t
            )
        )

        addToast('Ticket marcado como resuelto. Conversación cerrada.', 'success')
    }

    const prioridadColor = {
        alta: { bg: '#fdeceb', text: '#b3261e' },
        media: { bg: '#fff3df', text: '#9a5a00' },
        baja: { bg: '#e8f4ed', text: '#2f6f44' }
    }

    return (
        <div className="tickets-page">
            <header className="tk-header">
                <h1>Soporte y Tickets</h1>
                <p>Centro de ayuda y comunicación directa para resolución de problemas.</p>
            </header>

            <div className="tk-layout">
                <aside className="tk-sidebar">
                    <div className="tk-sidebar-top">
                        <Button variant="primary" fullWidth size="md" onClick={() => setIsCreating(true)}>
                            <Plus size={18} /> Abrir Nuevo Ticket
                        </Button>

                        <div className="tk-tabs">
                            <button
                                className={`tk-tab ${filtroEstado === 'abierto' ? 'tk-tab--active' : ''}`}
                                onClick={() => setFiltroEstado('abierto')}
                            >
                                Activos
                            </button>
                            <button
                                className={`tk-tab ${filtroEstado === 'resuelto' ? 'tk-tab--active' : ''}`}
                                onClick={() => setFiltroEstado('resuelto')}
                            >
                                Resueltos
                            </button>
                        </div>

                        <div className="tk-search">
                            <Search size={16} className="tk-search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar ticket..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="tk-list">
                        {ticketsVisibles.length === 0 ? (
                            <div className="tk-chat-empty" style={{ marginTop: '2rem' }}>
                                <CheckCircle2 size={36} color="#c4d0c4" />
                                <p style={{ fontSize: '0.85rem' }}>No se encontraron tickets.</p>
                            </div>
                        ) : (
                            ticketsVisibles.map(t => {
                                const unidad = UNIDADES.find(u => u.clues === t.cluesSolicitante)
                                const lastMsg = t.mensajes[t.mensajes.length - 1]
                                const isUnread = t.estado === 'abierto' && lastMsg?.autor !== (esAdmin ? 'admin' : miClues)

                                return (
                                    <div
                                        key={t.id}
                                        className={`tk-card ${selectedId === t.id ? 'tk-card--active' : ''}`}
                                        onClick={() => setSelectedId(t.id)}
                                    >
                                        <div className="tk-avatar" style={{ background: isUnread ? '#b58122' : '#006657' }}>
                                            {esAdmin ? t.cluesSolicitante.slice(-2) : 'ST'}
                                        </div>

                                        <div className="tk-card-content">
                                            <div className="tk-card-top">
                                                <h3 className="tk-card-title">#{t.id} - {t.titulo}</h3>
                                                <span className="tk-card-date">{lastMsg?.hora || t.fechaCreacion}</span>
                                            </div>

                                            {esAdmin && (
                                                <span className="tk-card-unit">{unidad?.nombre}</span>
                                            )}

                                            <p
                                                className="tk-card-desc"
                                                style={{
                                                    fontWeight: isUnread ? 700 : 500,
                                                    color: isUnread ? '#162824' : '#5e6962'
                                                }}
                                            >
                                                {lastMsg?.texto || 'Sin mensajes'}
                                            </p>

                                            <Badge style={{ backgroundColor: prioridadColor[t.prioridad].bg, color: prioridadColor[t.prioridad].text }}>
                                                {t.prioridad.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </aside>

                <main className={`tk-chat-area ${selectedId ? 'tk-chat-area--open' : ''}`}>
                    {!ticketActivo ? (
                        <div className="tk-chat-empty">
                            <MessageSquare size={64} opacity={0.15} color="#006657" />
                            <h3 style={{ color: '#1a2e2b', margin: 0 }}>Selecciona un ticket</h3>
                            <p style={{ marginTop: 0 }}>Elige una conversación de la lista para continuar o abre un nuevo ticket.</p>
                        </div>
                    ) : (
                        <>
                            <header className="tk-chat-header">
                                <div className="tk-chat-header-info">
                                    <button className="tk-mobile-back" onClick={() => setSelectedId(null)}>
                                        <ArrowLeft size={22} />
                                    </button>

                                    <div className="tk-avatar" style={{ width: '42px', height: '42px', boxShadow: 'none', borderRadius: '14px' }}>
                                        {esAdmin ? ticketActivo.cluesSolicitante.slice(-2) : 'ST'}
                                    </div>

                                    <div className="tk-chat-header-texts">
                                        <h2>#{ticketActivo.id} - {ticketActivo.titulo}</h2>
                                        <span className="tk-chat-header-sub">
                                            {esAdmin
                                                ? UNIDADES.find(u => u.clues === ticketActivo.cluesSolicitante)?.nombre
                                                : 'Soporte Técnico Administrador'}
                                        </span>
                                    </div>
                                </div>

                                {ticketActivo.estado === 'abierto' && (
                                    <Button variant="secondary" size="sm" onClick={handleResolver}>
                                        <CheckCircle2 size={16} /> Marcar Resuelto
                                    </Button>
                                )}
                            </header>

                            <div className="tk-chat-messages">
                                <div className="tk-context-banner">
                                    <h4>
                                        <ShieldAlert size={15} />
                                        Motivo del ticket
                                    </h4>
                                    <p>{ticketActivo.descripcion}</p>
                                </div>

                                {ticketActivo.mensajes.map(msg => {
                                    const isMine = esAdmin ? msg.autor === 'admin' : msg.autor !== 'admin'

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`tk-bubble-wrap ${isMine ? 'tk-bubble-wrap--mine' : 'tk-bubble-wrap--other'}`}
                                        >
                                            <span className="tk-bubble-author">
                                                {isMine ? 'Tú' : (msg.autor === 'admin' ? 'Soporte Técnico' : 'Unidad Médica')}
                                            </span>

                                            <div className={`tk-bubble ${isMine ? 'tk-bubble--mine' : 'tk-bubble--other'}`}>
                                                {msg.texto}
                                                <span className="tk-bubble-time">{msg.hora}</span>
                                            </div>
                                        </div>
                                    )
                                })}

                                <div ref={chatEndRef} />
                            </div>

                            {ticketActivo.estado === 'abierto' ? (
                                <div className="tk-chat-input-area">
                                    <div className="tk-chat-input-wrapper">
                                        <button className="tk-chat-btn-attach" title="Adjuntar archivo" type="button">
                                            <Paperclip size={20} />
                                        </button>

                                        <textarea
                                            rows={1}
                                            placeholder="Escribe un mensaje..."
                                            value={mensajeInput}
                                            onChange={e => {
                                                setMensajeInput(e.target.value)
                                                e.target.style.height = 'auto'
                                                e.target.style.height = `${e.target.scrollHeight}px`
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleEnviarMensaje()
                                                }
                                            }}
                                        />

                                        <button
                                            className="tk-chat-btn-send"
                                            onClick={handleEnviarMensaje}
                                            disabled={!mensajeInput.trim()}
                                            type="button"
                                        >
                                            <Send size={18} style={{ marginLeft: '-2px' }} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="tk-resolved-banner">
                                    <CheckCircle2 size={20} />
                                    Este ticket ha sido resuelto y cerrado.
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {isCreating && (
                <Modal onClose={() => setIsCreating(false)}>
                    <div className="tk-modal-card">
                        <div className="tk-modal-top"></div>
                        <div className="tk-modal-gold"></div>

                        <div className="tk-modal-content">
                            <header className="tk-modal-header">
                                <div className="tk-modal-icon">
                                    <TicketIcon size={28} />
                                </div>

                                <div className="tk-modal-header-texts">
                                    <h2>Abrir Ticket</h2>
                                    <p>Describe el problema para recibir soporte técnico.</p>
                                </div>
                            </header>

                            <form onSubmit={handleCrearTicket} className="tk-modal-form">
                                <div className="tk-modal-input-wrap">
                                    <FormField
                                        id="titulo"
                                        label="Título del problema"
                                        placeholder="Ej. Falla en impresora de urgencias"
                                        value={nuevoTitulo}
                                        onChange={e => setNuevoTitulo(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="tk-modal-textarea-block">
                                    <label htmlFor="desc">Descripción detallada</label>
                                    <textarea
                                        id="desc"
                                        className="tk-modal-textarea"
                                        placeholder="Describe qué sucede, desde cuándo, y qué equipo está afectado..."
                                        value={nuevaDesc}
                                        onChange={e => setNuevaDesc(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="tk-modal-select-wrap">
                                    <SelectField
                                        id="prio"
                                        label="Nivel de prioridad"
                                        value={nuevaPrio}
                                        onChange={e => setNuevaPrio(e.target.value as Prioridad)}
                                    >
                                        <option value="baja">Baja (Dudas, consultas generales)</option>
                                        <option value="media">Media (Falla de equipo no crítico)</option>
                                        <option value="alta">Alta (Urgencia, red caída, equipo vital)</option>
                                    </SelectField>
                                </div>

                                <div className="tk-modal-actions">
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        variant="primary"
                                        size="md"
                                        type="submit"
                                        disabled={!nuevoTitulo.trim() || !nuevaDesc.trim()}
                                    >
                                        Enviar Ticket
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}