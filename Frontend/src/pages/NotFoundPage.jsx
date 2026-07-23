import { Link } from 'react-router-dom'
import { Ghost, ArrowLeft, Home } from 'lucide-react'
import { motion } from 'framer-motion'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-[#e2e8f0] flex items-center justify-center shadow-xs">
            <Ghost size={38} className="text-[#0f172a]" />
          </div>
        </motion.div>

        <h1 className="text-6xl font-extrabold text-[#0f172a] font-display mb-2">
          404
        </h1>
        <h2 className="text-lg font-bold text-[#0f172a] mb-2 font-display">
          Page Not Found
        </h2>
        <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium rounded-lg shadow-xs transition-all duration-200"
          >
            <Home size={16} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0f172a] text-sm font-medium rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all duration-200 cursor-pointer"
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
