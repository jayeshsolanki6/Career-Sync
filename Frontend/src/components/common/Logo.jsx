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
    <Link to={linkTo} className="flex items-center gap-2.5 no-underline group">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0f172a] text-white transition-transform group-hover:scale-105">
        <Zap size={s.icon} className="text-[#10b981]" strokeWidth={2.2} />
      </div>
      <span className={`${s.text} font-bold text-[#0f172a] tracking-tight font-display`}>
        Career<span className="text-[#475569]">Sync</span>
      </span>
    </Link>
  )
}

export default Logo
