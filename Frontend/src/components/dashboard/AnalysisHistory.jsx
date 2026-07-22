import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { analysisAPI } from '../../services/api'
import HistoryList from '../history/HistoryList'

const AnalysisHistory = ({ onNavigate }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await analysisAPI.getHistory()
      setHistory(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const handleLearnSkill = (skill) => {
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
          <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
          <p className="text-gray-500 text-sm mt-1">View your past resume analyses and track your progress.</p>
        </div>
        {!loading && history.length > 0 && (
          <button
            onClick={fetchHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer"
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
