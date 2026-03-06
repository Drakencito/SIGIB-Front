import type { FC, ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
    children: ReactNode;
    onBackdropClick?: () => void;
}

const Modal: FC<ModalProps> = ({ children, onBackdropClick }) => {
    return (
        <div className="modal-backdrop" onClick={onBackdropClick}>
            <div onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
