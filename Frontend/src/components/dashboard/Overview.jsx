import { useEffect } from 'react'
import { Plus, RefreshCw, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/useAuthStore'
import { useProfileStore } from '../../stores/useProfileStore'
import { useAnalysisStore } from '../../stores/useAnalysisStore'
import StatsGrid from './StatsGrid'
import ScoreChart from './ScoreChart'
import RecentScans from './RecentScans'
import ProfileSummary from '../profile/ProfileSummary'
import ResumeUploadZone from '../profile/ResumeUploadZone'

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}


const Overview = ({ onNavigate }) => {
  const user = useAuthStore((state) => state.user)
  const profile = useProfileStore((state) => state.profile)

  const history = useAnalysisStore((state) => state.history)
  const loading = useAnalysisStore((state) => state.loadingHistory)
  const error = useAnalysisStore((state) => state.historyError)
  const analytics = useAnalysisStore((state) => state.analytics)
  const fetchHistory = useAnalysisStore((state) => state.fetchHistory)

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-pulse flex-1 w-full">
        <div className="h-8 bg-gray-100 rounded-xl w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 flex-1">
          <div className="col-span-2 bg-gray-100 rounded-xl min-h-[256px]" />
          <div className="bg-gray-100 rounded-xl min-h-[256px]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm max-w-md">{error}</div>
        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white text-sm font-medium rounded-lg hover:bg-[#1e293b] cursor-pointer"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    )
  }

  if (!history.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a] font-display">
            Welcome, {capitalizeFirstLetter(user?.fullName?.split(' ')[0]) || 'User'}! 👋
          </h1>
          <p className="text-[#64748b] text-sm mt-1 font-normal">Let's start by running your first resume analysis.</p>
        </div>

        {profile ? (
          <ProfileSummary profile={profile} />
        ) : (
          <div className="mb-6">
            <ResumeUploadZone />
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-[#e2e8f0]">
          <div className="w-16 h-16 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex items-center justify-center mb-4">
            <Target size={28} className="text-[#0f172a]" />
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] font-display mb-2">No analyses yet</h2>
          <p className="text-[#64748b] text-sm max-w-sm mb-6">
            {profile
              ? 'Your master profile is set up. Run an analysis against any job description to get started.'
              : 'Upload your resume and run it against a job description to get your match score.'}
          </p>
          <button
            onClick={() => onNavigate('new-analysis')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={16} /> Start New Analysis
          </button>
        </div>
      </motion.div>
    )
  }

  const { scoreTimeline, totalAnalyses, avgScore, bestScore, latestScore, recentAnalyses } = analytics || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4 max-w-7xl mx-auto flex-1 min-h-0 w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] font-display">
            Welcome back, {capitalizeFirstLetter(user?.fullName?.split(' ')[0]) || 'User'} 👋
          </h1>
          <p className="text-[#64748b] text-xs mt-0.5">Here's your career readiness snapshot.</p>
        </div>
        <button
          onClick={() => onNavigate('new-analysis')}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={14} /> New Analysis
        </button>
      </div>

      {/* Profile Summary or Upload Zone */}
      {profile ? <ProfileSummary profile={profile} /> : <ResumeUploadZone />}

      {/* Stats Grid */}
      <StatsGrid
        totalAnalyses={totalAnalyses}
        avgScore={avgScore}
        bestScore={bestScore}
        latestScore={latestScore}
      />

      {/* Chart + Recent Scans */}
      <div className="grid lg:grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#e2e8f0] shadow-xs p-4 flex flex-col min-h-[280px]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748b] mb-3">Score Progression</p>
          <div className="flex-1 min-h-0">
            <ScoreChart data={scoreTimeline} />
          </div>
        </div>
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#e2e8f0] shadow-xs p-4 min-h-[280px]">
          <RecentScans analyses={recentAnalyses} onViewAll={() => onNavigate('history')} />
        </div>
      </div>
    </motion.div>
  )
}

export default Overview
