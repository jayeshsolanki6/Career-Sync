import { Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const Logo = ({ size = 'md', linkTo = '/' }) => {
  const sizes = {
    sm: { icon: 18, text: 'text-lg' },
    md: { icon: 22, text: 'text-xl' },
    lg: { icon: 28, text: 'text-2xl' },
  }

  const s = sizes[size]

  return (
    <Link to={linkTo} className="flex items-center gap-2 no-underline group">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-primary-200 group-hover:shadow-lg group-hover:shadow-primary-300 transition-all duration-300">
        <Zap size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`${s.text} font-bold text-text-primary tracking-tight`}>
        Career<span className="text-primary-600">Sync</span>
      </span>
    </Link>
  )
}

export default Logo
