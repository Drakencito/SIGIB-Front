import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Label from '../../atoms/Label/Label'
import Input from '../../atoms/Input/Input'
import Button from '../../atoms/Button/Button'

interface IPasswordFieldProps {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

function PasswordField({ id, label, placeholder, value, onChange, required }: IPasswordFieldProps) {
  const [verPwd, setVerPwd] = useState<boolean>(false)

  return (
    <div className="field">
      <Label text={label} htmlFor={id} />
      <div className="password-wrap">
        <Input
          id={id}
          type={verPwd ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <Button
          type="button"
          className="toggle-pwd"
          onClick={() => setVerPwd(!verPwd)}
        >
          {verPwd ? <EyeOff size={17} /> : <Eye size={17} />}
        </Button>
      </div>
    </div>
  )
}

export default PasswordField
