import { useState } from 'react'
import { Mail, Lock, User, UserPlus } from 'lucide-react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useAuth } from '../../context/AuthContext'

const SignupForm = ({ onToggle }) => {
  const { signup } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)

    try {
      await signup(form)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Create your account</h2>
        <p className="text-text-secondary text-sm mt-1.5">Start analyzing your resume in seconds</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      <Input
        id="signup-name"
        name="fullName"
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon={User}
        value={form.fullName}
        onChange={handleChange}
        required
      />

      <Input
        id="signup-email"
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
        id="signup-password"
        name="password"
        label="Password"
        type="password"
        placeholder="Minimum 8 characters"
        icon={Lock}
        value={form.password}
        onChange={handleChange}
        required
      />

      <Button type="submit" fullWidth loading={loading} icon={UserPlus} size="lg">
        Create Account
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <button type="button" onClick={onToggle} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors cursor-pointer">
          Sign in
        </button>
      </p>
    </form>
  )
}

export default SignupForm
