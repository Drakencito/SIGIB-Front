import type { FC, HTMLAttributes, ReactNode } from "react";
import "./Badge.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    color?: string;
    children: ReactNode;
}

const Badge: FC<BadgeProps> = ({ color, className, children, style, ...rest }) => {
    return (
        <span
            className={`badge-root${className ? ` ${className}` : ""}`}
            style={color ? { backgroundColor: color, ...style } : style}
            {...rest}
        >
            {children}
        </span>
    );
};

export default Badge;
