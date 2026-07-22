import { Activity, Target, Award, Zap } from 'lucide-react'

const StatsGrid = ({ totalAnalyses, avgScore, bestScore, latestScore }) => {
  const stats = [
    {
      icon: Activity,
      label: 'Total Analyses',
      value: totalAnalyses ?? '—',
      color: 'text-gray-500',
      bg: 'bg-gray-100',
    },
    {
      icon: Target,
      label: 'Average Score',
      value: avgScore !== undefined ? `${avgScore}%` : '—',
      color: 'text-gray-500',
      bg: 'bg-gray-100',
    },
    {
      icon: Award,
      label: 'Best Score',
      value: bestScore !== undefined ? `${bestScore}%` : '—',
      color: 'text-gray-500',
      bg: 'bg-gray-100',
    },
    {
      icon: Zap,
      label: 'Latest Score',
      value: latestScore !== undefined ? `${latestScore}%` : '—',
      color: 'text-gray-500',
      bg: 'bg-gray-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsGrid
