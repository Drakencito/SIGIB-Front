import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Login.css'


function Login() {
  const [usuario, setUsuario]   = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [verPwd, setVerPwd]     = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate('/Inicio')
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
            <div className="field">
              <label htmlFor="usuario">Clues</label>
              <input
                id="usuario"
                type="text"
                placeholder="Ingresa la clues"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={verPwd ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pwd"
                  onClick={() => setVerPwd(!verPwd)}
                >
                  {verPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="forgot-wrap">
              <a href="#" className="link-forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="btn-ingresar">
              Ingresar
            </button>
          </form>

          <p className="card-footer-text">
            IMSS BIENESTAR · Sistema de Gestión Integral · 2026
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
