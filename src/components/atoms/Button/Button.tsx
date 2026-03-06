import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import "./Button.css";

type Variant = "primary" | "secondary" | "danger" | "gradient" | "icon-green" | "icon-red";
type Size = "sm" | "md" | "lg";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children?: ReactNode;
}

const Button: FC<IButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...rest
}) => {
  const isIcon = variant === "icon-green" || variant === "icon-red";

  const classes = [
    "btn",
    isIcon ? "btn--icon" : `btn--${size}`,
    isIcon ? `btn--${variant}` : `btn--${variant}`,
    fullWidth ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
