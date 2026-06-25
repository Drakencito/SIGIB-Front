import type { FC } from 'react'
import type { ItemInventario } from '../../../lib/types/types'
import { categoriaLabel, categoriaIcono } from '../../../lib/constants/categoriaUI'
import { UNIDADES } from '../../../lib/constants/unidades'
import EstadoBar from '../../molecules/EstadoBar/EstadoBar'
import Button from '../../atoms/Button/Button'
import './InventoryDetail.css'

interface InventoryDetailProps {
    item: ItemInventario
    onClose: () => void
}

const InventoryDetail: FC<InventoryDetailProps> = ({ item, onClose }) => {
    const unidad = UNIDADES.find(u => u.clues === item.clues)

    return (
        <div className="inv-add-card inv-add-card-detalle">
            <div className="inv-detalle-main">

                <header className="inv-detalle-header">
                    <div>
                        <h2>{item.marca} {item.modelo}</h2>
                        <p>Consulta la información registrada de este equipo.</p>
                    </div>
                    <div className="inv-detalle-clues">
                        <span className="inv-detalle-clues-code">{item.clues}</span>
                        <span className="inv-detalle-clues-nombre">
                            {unidad?.nombre ?? item.nombreClues}
                        </span>
                    </div>
                </header>

                <div className="inv-detalle-separador" />

                <div className="inv-detalle-scroll-area">

                    <div className="inv-detalle-icon-wrap">
                        <div className="inv-detalle-icon-circle">
                            {categoriaIcono(item.categoria)}
                        </div>
                    </div>

                    {/* Identificación */}
                    <div className="inv-detalle-section">
                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">No. Inventario Anterior</span>
                                <span className="inv-detalle-value inv-detalle-value-mono">
                                    {item.noInventario ?? 'N/A'}
                                </span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">No. de Serie</span>
                                <span className="inv-detalle-value inv-detalle-value-mono">
                                    {item.noSerie}
                                </span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Categoría</span>
                                <span className="inv-detalle-value">
                                    {categoriaLabel(item.categoria)}
                                </span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Estado Físico</span>
                                <EstadoBar mode="view" estadoInventario={item.estado} />
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card inv-detalle-card-full">
                                <span className="inv-detalle-label">Descripción</span>
                                <span className="inv-detalle-value">{item.descripcion}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div className="inv-detalle-section">
                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Entidad Federativa</span>
                                <span className="inv-detalle-value">{item.entidadFederativa}</span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Nivel de Atención</span>
                                <span className="inv-detalle-value">{item.nivelAtencion}</span>
                            </div>
                        </div>
                    </div>

                    {/* Claves */}
                    <div className="inv-detalle-section">
                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">CUCOP</span>
                                <span className="inv-detalle-value inv-detalle-value-mono">
                                    {item.cucop || 'N/A'}
                                </span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">CABMS</span>
                                <span className="inv-detalle-value inv-detalle-value-mono">
                                    {item.cabms || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Responsable */}
                    <div className="inv-detalle-section">
                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card inv-detalle-card-full">
                                <span className="inv-detalle-label">Responsable de la Unidad Médica-Administrativa</span>
                                <span className="inv-detalle-value">{item.responsable}</span>
                            </div>
                        </div>
                    </div>

                    {/* Documentación */}
                    <div className="inv-detalle-section">
                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Fecha del Documento</span>
                                <span className="inv-detalle-value">
                                    {item.fechaDocumento || 'N/A'}
                                </span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Valor Factura (con IVA)</span>
                                <span className="inv-detalle-value">
                                    {item.valorFactura != null
                                        ? `$${item.valorFactura.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
                                        : 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Valor Actual en Libros</span>
                                <span className="inv-detalle-value">
                                    {item.valorLibros != null
                                        ? `$${item.valorLibros.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Nombre del Archivo</span>
                                <span className="inv-detalle-value">
                                    {item.nombreArchivo || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Remisión / Orden de Suministro</span>
                                <span className="inv-detalle-value">
                                    {item.remision || 'N/A'}
                                </span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Acta Entrega-Recepción</span>
                                <span className="inv-detalle-value">
                                    {item.actaEntrega || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card inv-detalle-card-full">
                                <span className="inv-detalle-label">Fuente de Origen</span>
                                <span className="inv-detalle-value">
                                    {item.fuenteOrigen || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="inv-detalle-section">
                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card inv-detalle-card-full">
                                <span className="inv-detalle-label">Observaciones</span>
                                <span className="inv-detalle-value">
                                    {item.observaciones || 'Ninguna'}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>{/* end scroll-area */}

                <div className="inv-detalle-separador inv-detalle-separador-bottom" />

                <footer className="inv-detalle-footer">
                    <span className="inv-detalle-footnote">
                        Información del inventario IMSS Bienestar
                    </span>
                    <div className="inv-detalle-footer-center">
                        <Button variant="primary" size="md" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                    <img className="inv-detalle-footer-img" src="imagotipo.png" alt="IMSS Bienestar" />
                </footer>

            </div>
        </div>
    )
}

export default InventoryDetail