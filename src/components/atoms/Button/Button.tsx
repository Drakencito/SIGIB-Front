import type { ButtonHTMLAttributes, FC } from 'react'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

const Button: FC<IButtonProps> = ({ label, children, ...rest }) => {
  return <button {...rest}>{label ?? children}</button>
}

export default Button
