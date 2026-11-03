import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--color-navy)'
    }}>
      <form onSubmit={onSubmit} style={{
        background: 'white', padding: 32, borderRadius: 12,
        width: 380, boxShadow: 'var(--shadow-md)'
      }}>
        <h1 style={{ margin: 0, color: 'var(--color-navy)', fontSize: 22 }}>EduGestión IA</h1>
        <p style={{ color: 'var(--color-gray-600)', marginTop: 4 }}>Inicia sesión</p>

        <label style={{ display: 'block', marginTop: 16, fontSize: 14 }}>Email</label>
        <input type="email" required value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle} />

        <label style={{ display: 'block', marginTop: 12, fontSize: 14 }}>Contraseña</label>
        <input type="password" required value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle} />

        {error && <p style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</p>}

        <button disabled={loading} style={{
          marginTop: 20, width: '100%', padding: '10px 16px',
          background: 'var(--color-primary)', color: 'white',
          border: 'none', borderRadius: 'var(--radius)', fontWeight: 600
        }}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 12px', marginTop: 4,
  border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius)',
  fontSize: 14, boxSizing: 'border-box'
}