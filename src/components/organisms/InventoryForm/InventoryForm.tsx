import type { FC } from "react";
import { CheckCircle2, MonitorSmartphone, Hand } from "lucide-react";
import type { ItemInventario } from "../../../lib/types/types";
import { categoriaLabel } from "../../../lib/constants/categoriaUI";
import { UNIDADES } from "../../../lib/constants/unidades";
import FormField from "../../molecules/Formfield/FormField";
import SelectField from "../../molecules/SelectField/SelectField";
import EstadoBar from "../../molecules/EstadoBar/EstadoBar";
import type { EstadoClave } from "../../molecules/EstadoBar/EstadoBar";
import Button from "../../atoms/Button/Button";
import "./InventoryForm.css";

interface InventoryFormProps {
    modo: "crear" | "editar";
    itemActual?: ItemInventario | null;
    estadoForm: EstadoClave | null;
    onEstadoChange: (estado: EstadoClave) => void;
    onCancel: () => void;
    onSubmit: () => void;
}

const InventoryForm: FC<InventoryFormProps> = ({
    modo, itemActual, estadoForm, onEstadoChange, onCancel, onSubmit,
}) => {
    const esEditar = modo === "editar";

    return (
        <div className="inv-add-card">
            <div className="inv-add-main">
                <header className="inv-add-header">
                    <h2>{esEditar ? "Editar equipo" : "Registrar nuevo equipo"}</h2>
                    <p>
                        {esEditar
                            ? "Actualiza los datos del equipo seleccionado."
                            : "Captura los datos del equipo para agregarlo al inventario."}
                    </p>
                </header>

                <form className="inv-add-form">
                    <div className="inv-add-grid">

                        <div className="inv-add-field">
                            <FormField
                                id="inv-marca"
                                label="Marca"
                                type="text"
                                defaultValue={esEditar ? (itemActual?.marca ?? "") : ""}
                            />
                        </div>

                        <div className="inv-add-field">
                            <FormField
                                id="inv-modelo"
                                label="Modelo"
                                type="text"
                                defaultValue={esEditar ? (itemActual?.modelo ?? "") : ""}
                            />
                        </div>

                        <div className="inv-add-field inv-add-field-full">
                            <FormField
                                id="inv-descripcion"
                                label="Descripción"
                                type="text"
                                defaultValue={esEditar ? (itemActual?.descripcion ?? "") : ""}
                            />
                        </div>

                        <div className="inv-add-field">
                            <SelectField
                                id="inv-categoria"
                                label="Categoría"
                                defaultValue={esEditar ? (itemActual?.categoria ?? "") : ""}
                            >
                                <option value="">Seleccione categoría…</option>
                                {Object.entries(categoriaLabel).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </SelectField>
                        </div>

                        <div className="inv-add-field">
                            <FormField
                                id="inv-departamento"
                                label="Departamento"
                                type="text"
                                defaultValue={esEditar ? (itemActual?.departamento ?? "") : ""}
                            />
                        </div>

                        <div className="inv-add-field">
                            <FormField
                                id="inv-serie"
                                label="No. de serie"
                                type="text"
                                defaultValue={esEditar ? (itemActual?.noSerie ?? "") : ""}
                            />
                        </div>

                        <div className="inv-add-field">
                            <SelectField
                                id="inv-clues"
                                label="Unidad médica (CLUES)"
                                defaultValue={esEditar ? (itemActual?.clues ?? "") : ""}
                            >
                                <option value="">Seleccione unidad…</option>
                                {UNIDADES.filter(u => u.estatus === "activa").map(u => (
                                    <option key={u.clues} value={u.clues}>{u.nombre}</option>
                                ))}
                            </SelectField>
                        </div>

                        <div className="inv-add-field inv-add-field-full">
                            <label className="inv-add-estado-label">Estado</label>
                            <EstadoBar mode="edit" value={estadoForm} onChange={onEstadoChange} />
                        </div>

                    </div>

                    <div className="inv-add-actions">
                        <Button variant="secondary" size="md" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button variant="primary" size="md" onClick={onSubmit}>
                            {esEditar ? "Actualizar" : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>

            <aside className="inv-add-side">
                <div className="inv-add-side-body">
                    <h3>Indicaciones para el<br /><span>Registro</span> de equipos</h3>
                    <ul className="inv-add-side-list">
                        <li>
                            <span className="inv-add-side-icon"><CheckCircle2 size={18} /></span>
                            <p>Verifica que la marca y modelo coincidan con la etiqueta física.</p>
                        </li>
                        <li>
                            <span className="inv-add-side-icon"><MonitorSmartphone size={18} /></span>
                            <p>Captura el número de serie exactamente como aparece.</p>
                        </li>
                        <li>
                            <span className="inv-add-side-icon"><Hand size={18} /></span>
                            <p>Selecciona la unidad médica correcta según su CLUES.</p>
                        </li>
                    </ul>
                    <div className="inv-add-side-bar" />
                </div>
                <div className="inv-add-side-image">
                    <img src="/imagotipo.png" alt="IMSS Bienestar" />
                </div>
            </aside>
        </div>
    );
};

export default InventoryForm;
