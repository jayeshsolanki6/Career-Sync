import { useState } from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useAuthStore } from '../../stores/useAuthStore'

const LoginForm = ({ onToggle }) => {
  const login = useAuthStore((state) => state.login)
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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#0f172a] font-display">Welcome back</h2>
        <p className="text-[#475569] text-sm mt-1">Sign in to continue your analysis</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
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

      <p className="text-center text-sm text-[#475569]">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onToggle} className="text-[#0f172a] font-semibold hover:underline transition-colors cursor-pointer">
          Create one
        </button>
      </p>
    </form>
  )
}

export default LoginForm
