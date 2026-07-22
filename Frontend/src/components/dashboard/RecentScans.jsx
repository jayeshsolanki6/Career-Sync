import { ChevronRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const getScoreStyle = (score) => {
  if (score >= 80) return 'text-indigo-600 bg-indigo-50 border-indigo-200'
  if (score >= 60) return 'text-green-600 bg-green-50 border-green-200'
  if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

const RecentScans = ({ analyses = [], onViewAll }) => {
  const navigate = useNavigate()

  if (!analyses.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-center px-4">
        <p className="text-gray-400 text-sm">No analyses yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Recent Scans</p>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          View All <ChevronRight size={13} />
        </button>
      </div>
      <div className="space-y-2 flex-1">
        {analyses.slice(0, 3).map((item) => {
          const scoreStyle = getScoreStyle(item.score)
          const date = new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
          return (
            <div
              key={item._id}
              onClick={() => navigate(`/analysis/${item._id}`)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-extrabold text-xs border shrink-0 ${scoreStyle}`}
              >
                {item.score}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.shortSummary || item.jobTitle || 'Resume Analysis'}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock size={10} /> {date}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentScans
