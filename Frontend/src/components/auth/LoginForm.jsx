import { useState } from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useAuth } from '../../context/AuthContext'

const LoginForm = ({ onToggle }) => {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
        <p className="text-text-secondary text-sm mt-1.5">Sign in to continue your analysis</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      <Input
        id="login-email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        icon={Mail}
        value={form.email}
        onChange={handleChange}
        required
      />

      <Input
        id="login-password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={Lock}
        value={form.password}
        onChange={handleChange}
        required
      />

      <Button type="submit" fullWidth loading={loading} icon={LogIn} size="lg">
        Sign In
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onToggle} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors cursor-pointer">
          Create one
        </button>
      </p>
    </form>
  )
}

export default LoginForm
