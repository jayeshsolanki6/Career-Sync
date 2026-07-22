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
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    )
  }

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Inbox size={28} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No analyses yet</h3>
        <p className="text-sm text-gray-500 max-w-sm">
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
