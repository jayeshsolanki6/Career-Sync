import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-surface-alt flex"
    >
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500">
        {/* Decorative shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-accent-400/20 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-lg font-bold">CS</span>
              </div>
              <span className="text-white/90 text-xl font-bold tracking-tight">CareerSync</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-5">
              Your career<br />
              accelerator,<br />
              <span className="text-white/70">powered by AI.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-md">
              Smart resume analysis, skill gap detection, and personalized learning paths — all in one platform.
            </p>
          </div>

          {/* Testimonial-like card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-md">
            <p className="text-white/80 text-sm leading-relaxed italic mb-4">
              &quot;CareerSync helped me identify the exact skills I was missing for my dream role. I landed the job within 3 weeks.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-white">Alex Chen</p>
                <p className="text-xs text-white/50">Software Engineer at Google</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden flex justify-center">
            <Logo size="lg" />
          </div>

          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-border p-8 sm:p-10 shadow-sm"
          >
            {isLogin ? (
              <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
              <SignupForm onToggle={() => setIsLogin(true)} />
            )}
          </motion.div>

          <p className="text-center text-xs text-text-muted mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default AuthPage
