import { Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ScoreRing from '../analysis/ScoreRing'

const getScoreLabel = (score) => {
  if (score >= 80) return { label: 'Excellent', cls: 'bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0]' }
  if (score >= 60) return { label: 'Good', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
  if (score >= 40) return { label: 'Fair', cls: 'bg-amber-50 text-amber-700 border border-amber-200' }
  return { label: 'Needs Work', cls: 'bg-red-50 text-red-700 border border-red-200' }
}

const HistoryItem = ({ item }) => {
  const navigate = useNavigate()
  const scoreVal = typeof item?.score === 'object' && item?.score !== null ? item.score.overall || 0 : Number(item?.score) || 0
  const { label, cls } = getScoreLabel(scoreVal)
  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      onClick={() => navigate(`/analysis/${item._id}`)}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#e2e8f0] hover:border-[#cbd5e1] hover:shadow-xs transition-all duration-150 cursor-pointer"
    >
      <div className="shrink-0">
        <ScoreRing score={scoreVal} size={44} strokeWidth={5} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0f172a] truncate">
          {item.shortSummary || item.jobTitle || 'Resume Analysis'}
        </p>
        <p className="text-xs text-[#64748b] flex items-center gap-1 mt-0.5">
          <Clock size={10} /> {date}
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
          {label}
        </span>
        <div className="flex items-center gap-1 text-xs font-semibold text-[#0f172a] group">
          <span className="hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity">View</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  )
}

export default HistoryItem
