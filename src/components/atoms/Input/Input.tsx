import type { InputHTMLAttributes, FC } from 'react'

type IInputProps = InputHTMLAttributes<HTMLInputElement>

const Input: FC<IInputProps> = ({ ...rest }) => {
  return <input {...rest} />
}

export default Input
