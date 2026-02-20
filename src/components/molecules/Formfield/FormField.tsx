import type { FC } from 'react'
import Label from '../../atoms/Label/Label'
import Input from '../../atoms/Input/Input'
import type { InputHTMLAttributes } from 'react'

interface IFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

const FormField: FC<IFormFieldProps> = ({ label, id, ...rest }) => {
  return (
    <div className="field">
      <Label text={label} htmlFor={id} />
      <Input id={id} {...rest} />
    </div>
  )
}

export default FormField
