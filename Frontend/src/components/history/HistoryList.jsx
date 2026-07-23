import { Inbox, RefreshCw } from 'lucide-react'
import HistoryItem from './HistoryItem'

const HistoryList = ({ history, loading, error, onRefresh }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm max-w-md">
          {error}
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors cursor-pointer"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    )
  }

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-4">
          <Inbox size={28} className="text-[#94a3b8]" />
        </div>
        <h3 className="text-lg font-bold text-[#0f172a] font-display mb-1">No analyses yet</h3>
        <p className="text-sm text-[#64748b] max-w-sm">
          Your analysis history will appear here once you run your first resume analysis.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {history.map((item) => (
        <div key={item._id} className="rounded-xl overflow-hidden">
          <HistoryItem item={item} />
        </div>
      ))}
    </div>
  )
}

export default HistoryList
