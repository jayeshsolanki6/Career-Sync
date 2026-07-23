import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Logo from '../components/common/Logo'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'
import { motion } from 'framer-motion'

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const [isLogin, setIsLogin] = useState(mode !== 'signup')

  useEffect(() => {
    setIsLogin(mode !== 'signup')
  }, [mode])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 sm:p-10"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-2">
          <Logo size="lg" />
        </div>

        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-xl border border-[#e2e8f0] p-8 sm:p-10 shadow-xs"
        >
          {isLogin ? (
            <LoginForm onToggle={() => setIsLogin(false)} />
          ) : (
            <SignupForm onToggle={() => setIsLogin(true)} />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AuthPage
