import { Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ScoreRing from '../analysis/ScoreRing'

const getScoreLabel = (score) => {
  if (score >= 80) return { label: 'Excellent', cls: 'bg-indigo-100 text-indigo-700' }
  if (score >= 60) return { label: 'Good', cls: 'bg-green-100 text-green-700' }
  if (score >= 40) return { label: 'Fair', cls: 'bg-amber-100 text-amber-700' }
  return { label: 'Needs Work', cls: 'bg-red-100 text-red-700' }
}

const HistoryItem = ({ item }) => {
  const navigate = useNavigate()
  const { label, cls } = getScoreLabel(item.score)
  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      onClick={() => navigate(`/analysis/${item._id}`)}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-150 cursor-pointer"
    >
      <div className="shrink-0">
        <ScoreRing score={item.score} size={44} strokeWidth={5} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {item.shortSummary || item.jobTitle || 'Resume Analysis'}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Clock size={10} /> {date}
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
          {label}
        </span>
        <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 group">
          <span className="hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity">View</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  )
}

export default HistoryItem
