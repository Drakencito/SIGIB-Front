import type { LabelHTMLAttributes, FC } from 'react'

interface ILabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  text: string
}

const Label: FC<ILabelProps> = ({ text, ...rest }) => {
  return <label {...rest}>{text}</label>
}

export default Label
