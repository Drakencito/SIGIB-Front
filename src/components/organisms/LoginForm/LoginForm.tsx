import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../lib/store/AuthContext'
import FormField from '../../molecules/Formfield/FormField'
import PasswordField from '../../molecules/PasswordField/PasswordField'
import Button from '../../atoms/Button/Button'
import './LoginForm.css'

function LoginForm() {
  const [clues, setClues]       = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError]       = useState<string>('')
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const ok = login(clues, password)
    if (ok) {
      navigate('/inicio')
    } else {
      setError('CLUES o contraseña incorrectos')
    }
  }

  return (
    <div className="login-page">

      <div className="deco deco-1" />
      <div className="deco deco-2" />
      <div className="deco deco-3" />
      <div className="deco deco-4" />

      <div className="login-img-bottom-right">
        <img src="/imagotipo.png" alt="" />
      </div>

      <div className="login-card">

        <div className="card-top">
          <img src="/Logo.png" alt="" />
          <h1>Sistema Integral IMSS Bienestar</h1>
        </div>

        <div className="card-separator" />

        <div className="card-body">

          <div className="card-form-header">
            <h2>INICIO <strong>SESIÓN</strong></h2>
            <div className="title-underline" />
          </div>

          <form onSubmit={handleSubmit}>

            <FormField
              id="clues"
              label="Clues"
              type="text"
              placeholder="Ingresa tu CLUES"
              value={clues}
              onChange={e => setClues(e.target.value)}
              required
            />

            <PasswordField
              id="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            {error && (
              <p style={{
                color: '#9b2247',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                textAlign: 'center',
                fontWeight: 600
              }}>
                {error}
              </p>
            )}

            <div className="forgot-wrap">
              <a href="#" className="link-forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <Button type="submit" className="btn-ingresar" label="Ingresar" />

          </form>

          <p className="card-footer-text">
            IMSS BIENESTAR · Sistema de Gestión Integral · 2026
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginForm
