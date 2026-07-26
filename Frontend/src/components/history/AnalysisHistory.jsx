import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAnalysisStore } from '../../stores/useAnalysisStore'
import HistoryList from './HistoryList'

/**
 * AnalysisHistory component connected directly to useAnalysisStore Zustand store.
 */
const AnalysisHistory = ({ onNavigate }) => {
  const history = useAnalysisStore((state) => state.history)
  const loading = useAnalysisStore((state) => state.loadingHistory)
  const error = useAnalysisStore((state) => state.historyError)
  const fetchHistory = useAnalysisStore((state) => state.fetchHistory)

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleLearnSkill = () => {
    onNavigate?.('learning')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full px-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] font-display">Analysis History</h1>
          <p className="text-[#64748b] text-sm mt-1">View your past resume analyses and track your progress.</p>
        </div>
        {!loading && history.length > 0 && (
          <button
            onClick={fetchHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] bg-white border border-[#e2e8f0] rounded-lg hover:border-[#cbd5e1] hover:text-[#0f172a] transition-all cursor-pointer"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        )}
      </div>

      <HistoryList
        history={history}
        loading={loading}
        error={error}
        onRefresh={fetchHistory}
        onLearnSkill={handleLearnSkill}
      />
    </motion.div>
  )
}

export default AnalysisHistory
