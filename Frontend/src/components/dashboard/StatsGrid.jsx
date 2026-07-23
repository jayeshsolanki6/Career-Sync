import { Activity, Target, Award, Zap } from 'lucide-react'

const StatsGrid = ({ totalAnalyses, avgScore, bestScore, latestScore }) => {
  const stats = [
    {
      icon: Activity,
      label: 'Total Analyses',
      value: totalAnalyses ?? '—',
      color: 'text-[#0f172a]',
      bg: 'bg-[#f8fafc] border border-[#e2e8f0]',
    },
    {
      icon: Target,
      label: 'Average Score',
      value: avgScore !== undefined ? `${avgScore}%` : '—',
      color: 'text-[#0f172a]',
      bg: 'bg-[#f8fafc] border border-[#e2e8f0]',
    },
    {
      icon: Award,
      label: 'Best Score',
      value: bestScore !== undefined ? `${bestScore}%` : '—',
      color: 'text-[#0f172a]',
      bg: 'bg-[#f8fafc] border border-[#e2e8f0]',
    },
    {
      icon: Zap,
      label: 'Latest Score',
      value: latestScore !== undefined ? `${latestScore}%` : '—',
      color: 'text-[#0f172a]',
      bg: 'bg-[#f8fafc] border border-[#e2e8f0]',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs p-3.5 sm:p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={18} className={color} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#0f172a] font-display">{value}</p>
          <p className="text-xs text-[#64748b] mt-0.5 font-medium">{label}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsGrid
