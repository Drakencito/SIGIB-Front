import type { FC } from "react";
import type { ItemInventario } from "../../../lib/types/types";
import { categoriaLabel, categoriaIcono } from "../../../lib/constants/categoriaUI";
import { UNIDADES } from "../../../lib/constants/unidades";
import EstadoBar from "../../molecules/EstadoBar/EstadoBar";
import Button from "../../atoms/Button/Button";
import "../InventoryForm/InventoryForm.css";
import "./InventoryDetail.css";

interface InventoryDetailProps {
    item: ItemInventario;
    onClose: () => void;
}

const InventoryDetail: FC<InventoryDetailProps> = ({ item, onClose }) => {
    const unidad = UNIDADES.find((u) => u.clues === item.clues);

    return (
        <div className="inv-add-card inv-add-card-detalle">
            <div className="inv-detalle-main">
                <header className="inv-detalle-header">
                    <div>
                        <h2>
                            {item.marca} {item.modelo}
                        </h2>
                        <p>Consulta la información registrada de este equipo.</p>
                    </div>
                    <div className="inv-detalle-clues">
                        <span className="inv-detalle-clues-code">{item.clues}</span>
                        <span className="inv-detalle-clues-nombre">
                            {unidad?.nombre ?? "Unidad médica"}
                        </span>
                    </div>
                </header>

                <div className="inv-detalle-separador" />

                <div className="inv-detalle-icon-wrap">
                    <div className="inv-detalle-icon-circle">
                        {categoriaIcono[item.categoria]}
                    </div>
                </div>

                <div className="inv-detalle-section">
                    <div className="inv-detalle-row">
                        <div className="inv-detalle-card">
                            <span className="inv-detalle-label">No. de serie</span>
                            <span className="inv-detalle-value inv-detalle-value-mono">
                                {item.noSerie}
                            </span>
                        </div>
                        <div className="inv-detalle-card">
                            <span className="inv-detalle-label">Categoría</span>
                            <span className="inv-detalle-value">
                                {categoriaLabel[item.categoria]}
                            </span>
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
                        <div className="inv-detalle-card inv-detalle-card-full">
                            <span className="inv-detalle-label">Descripción</span>
                            <span className="inv-detalle-value">{item.descripcion}</span>
                        </div>
                    </div>

                    <div className="inv-detalle-row">
                        <div className="inv-detalle-card inv-detalle-card-full">
                            <span className="inv-detalle-label">Unidad médica</span>
                            <span className="inv-detalle-value">
                                {unidad?.nombre ?? "—"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="inv-detalle-separador inv-detalle-separador-bottom" />

                <footer className="inv-detalle-footer">
                    <span className="inv-detalle-footnote">
                        Última actualización: información demostrativa
                    </span>
                    <div className="inv-detalle-footer-center">
                        <Button variant="primary" size="md" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                    <img
                        className="inv-detalle-footer-img"
                        src="/imagotipo.png"
                        alt="IMSS Bienestar"
                    />
                </footer>
            </div>
        </div>
    );
};

export default InventoryDetail;
