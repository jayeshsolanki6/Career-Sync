import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Ghost, ArrowLeft, Home } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-surface-alt flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Animated Ghost Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary-100 via-accent-100 to-primary-50 flex items-center justify-center shadow-lg shadow-primary-200/30">
            <Ghost size={44} className="text-primary-500" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-500 to-primary-400 bg-clip-text text-transparent mb-3">
          404
        </h1>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-200/40 hover:shadow-lg hover:shadow-primary-300/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Home size={16} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-text-primary text-sm font-medium rounded-xl border border-border hover:border-primary-300 hover:text-primary-600 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        {/* Decorative dots */}
        <div className="mt-12 flex items-center justify-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-200"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
