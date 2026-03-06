import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import "./IconButton.css";

type Variant = "default" | "danger";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    children: ReactNode;
}

const IconButton: FC<IconButtonProps> = ({
    variant = "default",
    className,
    children,
    ...rest
}) => {
    return (
        <button
            type="button"
            className={`icon-btn icon-btn--${variant}${className ? ` ${className}` : ""}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default IconButton;
