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
                            {unidad?.nombre ?? 'Unidad médica'}
                        </span>
                    </div>
                </header>

                <div className="inv-detalle-separador"></div>

                <div className="inv-detalle-scroll-area">
                    <div className="inv-detalle-icon-wrap">
                        <div className="inv-detalle-icon-circle">
                            {categoriaIcono[item.categoria]}
                        </div>
                    </div>

                    <div className="inv-detalle-section">
                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">No. de inventario</span>
                                <span className="inv-detalle-value inv-detalle-value-mono">{item.noInventario || 'N/A'}</span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">No. de serie</span>
                                <span className="inv-detalle-value inv-detalle-value-mono">{item.noSerie}</span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Nombre Genérico</span>
                                <span className="inv-detalle-value">{item.nombreGenerico}</span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Categoría</span>
                                <span className="inv-detalle-value">{categoriaLabel[item.categoria]}</span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Subrogado</span>
                                <span className="inv-detalle-value">{item.subrogado}</span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Nombre de Empresa</span>
                                <span className="inv-detalle-value">{item.nombreEmpresa || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Estado</span>
                                <EstadoBar mode="view" estadoInventario={item.estado} />
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Departamento</span>
                                <span className="inv-detalle-value">{item.departamento}</span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Funcional</span>
                                <span className="inv-detalle-value">{item.funcional}</span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Motivo (si no funciona)</span>
                                <span className="inv-detalle-value">{item.motivoFuncionamiento || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Clasif. Impresora</span>
                                <span className="inv-detalle-value">{item.clasImpr || 'N/A'}</span>
                            </div>
                            <div className="inv-detalle-card">
                                <span className="inv-detalle-label">Resguardo</span>
                                <span className="inv-detalle-value">{item.resguardo || 'Sin asignar'}</span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card inv-detalle-card-full">
                                <span className="inv-detalle-label">Descripción</span>
                                <span className="inv-detalle-value">{item.descripcion}</span>
                            </div>
                        </div>

                        <div className="inv-detalle-row">
                            <div className="inv-detalle-card inv-detalle-card-full">
                                <span className="inv-detalle-label">Observaciones</span>
                                <span className="inv-detalle-value">{item.observaciones || 'Ninguna'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inv-detalle-separador inv-detalle-separador-bottom"></div>

                <footer className="inv-detalle-footer">
                    <span className="inv-detalle-footnote">Última actualización: información demostrativa</span>
                    <div className="inv-detalle-footer-center">
                        <Button variant="primary" size="md" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                    <img className="inv-detalle-footer-img" src="/imagotipo.png" alt="IMSS Bienestar" />
                </footer>
            </div>
        </div>
    )
}

export default InventoryDetail