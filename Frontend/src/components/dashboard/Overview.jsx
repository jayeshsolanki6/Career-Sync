import { useState, useEffect, useMemo } from 'react'
import { Plus, RefreshCw, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import { analysisAPI } from '../../services/api'
import StatsGrid from './StatsGrid'
import ScoreChart from './ScoreChart'
import RecentScans from './RecentScans'
import ProfileSummary from './ProfileSummary'
import ResumeUploadZone from './ResumeUploadZone'
import AnalysisDrawer from '../analysis/AnalysisDrawer'

const DashboardSection = ({ onNavigate }) => {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await analysisAPI.getHistory()
      setHistory(res.data.data)
    } catch {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const analytics = useMemo(() => {
    if (!history.length) return null
    const sorted = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    const scores = sorted.map(h => h.score)
    const scoreTimeline = sorted.map(item => ({
      name: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: item.score,
    }))
    const recentAnalyses = [...sorted].reverse().slice(0, 3)
    return {
      scoreTimeline,
      totalAnalyses: history.length,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      bestScore: Math.max(...scores),
      latestScore: scores[scores.length - 1],
      recentAnalyses,
    }
  }, [history])

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-100 rounded-xl w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-64 bg-gray-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm max-w-md">{error}</div>
        <button onClick={fetchHistory} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 cursor-pointer">
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    )
  }

  if (!history.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.fullName?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Let's start by running your first resume analysis.</p>
        </div>

        {profile ? (
          <ProfileSummary profile={profile} />
        ) : (
          <div className="mb-6"><ResumeUploadZone /></div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
            <Target size={28} className="text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No analyses yet</h2>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            {profile
              ? 'Your master profile is set up. Run an analysis against any job description to get started.'
              : 'Upload your resume and run it against a job description to get your match score.'}
          </p>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={16} /> Start New Analysis
          </button>
        </div>

        <AnalysisDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={onNavigate} />
      </motion.div>
    )
  }

  const { scoreTimeline, totalAnalyses, avgScore, bestScore, latestScore, recentAnalyses } = analytics

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's your career readiness snapshot.</p>
        </div>
      </div>

      {/* Profile Summary (collapsible) or Upload Zone */}
      {profile ? <ProfileSummary profile={profile} /> : <ResumeUploadZone />}

      {/* Stats Grid */}
      <StatsGrid
        totalAnalyses={totalAnalyses}
        avgScore={avgScore}
        bestScore={bestScore}
        latestScore={latestScore}
      />

      {/* Chart + Recent Scans */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Score Progression</p>
          <div className="h-64">
            <ScoreChart data={scoreTimeline} />
          </div>
        </div>
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <RecentScans analyses={recentAnalyses} onViewAll={() => onNavigate('history')} />
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer"
        title="New Analysis"
      >
        <Plus size={24} />
      </button>

      <AnalysisDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={onNavigate} />
    </motion.div>
  )
}

export default DashboardSection
