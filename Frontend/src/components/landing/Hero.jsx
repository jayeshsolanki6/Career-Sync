import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, BarChart3, BookOpen } from 'lucide-react'
import Button from '../common/Button'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-44">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-primary-100/60 via-accent-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-primary-50/80 to-transparent rounded-full blur-3xl" />
        {/* Extra animated dot grid */}
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-primary-300/40 animate-pulse" />
        <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-accent-400/30 animate-pulse delay-300" />
        <div className="absolute bottom-32 left-1/4 w-2.5 h-2.5 rounded-full bg-primary-400/25 animate-pulse delay-700" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold tracking-wide uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            AI-Powered Resume Analysis
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-text-primary leading-[1.1] tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Bridge the Gap Between{' '}
          <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent">
            Your Resume
          </span>{' '}
          & Your{' '}
          <span className="bg-gradient-to-r from-accent-500 to-primary-600 bg-clip-text text-transparent">
            Dream Job
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="max-w-2xl mx-auto text-lg sm:text-xl text-text-secondary leading-relaxed mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Upload your resume and job description. Our AI analyzes skill gaps, generates a match score,
          and creates a personalized learning path to help you land the role.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button size="lg" icon={ArrowRight} onClick={() => navigate('/auth?mode=signup')}>
            Get Started Free
          </Button>
          <Button variant="secondary" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            See How It Works
          </Button>
        </motion.div>

        {/* Stats — redesigned with icons */}
        <motion.div
          className="mt-20 grid grid-cols-3 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { value: '10K+', label: 'Resumes Analyzed', icon: Sparkles, color: 'text-primary-500' },
            { value: '95%', label: 'Accuracy Rate', icon: BarChart3, color: 'text-accent-500' },
            { value: '50+', label: 'Skill Categories', icon: BookOpen, color: 'text-primary-500' },
          ].map((stat, i) => (
            <div key={stat.label} className={`text-center ${i !== 1 ? '' : 'border-x border-border'} py-4`}>
              <stat.icon size={20} className={`mx-auto ${stat.color} mb-2`} />
              <p className="text-2xl sm:text-3xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs sm:text-sm text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
