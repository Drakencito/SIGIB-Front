import type { FC } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../../atoms/Button/Button";
import "./ConfirmDeleteModal.css";

interface ConfirmDeleteModalProps {
    titulo?: string;
    mensaje?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
    titulo = "Eliminar equipo",
    mensaje = "¿Estás seguro que deseas eliminar este equipo? Esta acción no se puede deshacer.",
    onCancel,
    onConfirm,
}) => {
    return (
        <div className="confirm-modal-card">
            <div className="confirm-modal-top-green" />
            <div className="confirm-modal-top-gold" />
            <div className="confirm-modal-content">
                <div className="confirm-modal-icon-circle">
                    <AlertTriangle className="confirm-modal-icon" />
                </div>
                <div className="confirm-modal-texts">
                    <h2>{titulo}</h2>
                    <p>{mensaje}</p>
                    <div className="confirm-modal-actions">
                        <Button variant="secondary" size="sm" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button variant="danger" size="sm" onClick={onConfirm}>
                            Sí, Eliminar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
