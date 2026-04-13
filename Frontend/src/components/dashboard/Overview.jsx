import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, Activity, Zap, FilePlus2, ChevronRight, 
  GraduationCap, Clock, Award, Loader2, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { analysisAPI } from '../../services/api'
import Button from '../common/Button'
import CourseModal from './CourseModal'

/* ═══════════════════════════════════════════
   Custom Tooltip for Charts
   ═══════════════════════════════════════════ */
const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-border rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-text-primary mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="font-bold text-text-primary">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   Stat Card
   ═══════════════════════════════════════════ */
const StatCard = ({ icon: Icon, label, value, subtext, trend, color, delay = 0 }) => {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-500 bg-red-50',
    neutral: 'text-text-muted bg-surface-alt',
  }
  const TrendIcon = trend?.direction === 'up' ? ArrowUpRight : trend?.direction === 'down' ? ArrowDownRight : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-white rounded-2xl border border-border p-5 hover:shadow-md hover:border-primary-100 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-semibold ${trendColors[trend.direction]}`}>
            <TrendIcon size={13} />
            {trend.value}
          </div>
        )}
      </div>
      <p className="text-2xl font-extrabold text-text-primary">{value}</p>
      <p className="text-xs font-medium text-text-muted mt-0.5">{label}</p>
      {subtext && <p className="text-[11px] text-text-muted mt-1">{subtext}</p>}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Chart Wrapper
   ═══════════════════════════════════════════ */
const ChartCard = ({ title, subtitle, icon: Icon, children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className={`bg-white rounded-2xl border border-border overflow-hidden flex flex-col ${className}`}
  >
    <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-surface-alt to-white flex-shrink-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={15} className="text-primary-500" />}
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">{title}</h3>
      </div>
      {subtitle && <p className="text-[11px] text-text-muted mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-5 flex-1 min-h-0">
      {children}
    </div>
  </motion.div>
)

/* ─── Skill Horizontal Bar ─── */
const SkillBar = ({ skill, count, max, color, index }) => {
  const percentage = max > 0 ? (count / max) * 100 : 0
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-text-primary truncate max-w-[180px]">{skill}</span>
        <span className="text-[10px] font-bold text-text-muted">{count}×</span>
      </div>
      <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.6, delay: 0.1 + index * 0.04 }}
          className="h-full rounded-full" style={{ background: color }}
        />
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Main Dashboard Component
   ═══════════════════════════════════════════ */
const Overview = ({ onNavigate }) => {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSkill, setSelectedSkill] = useState(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await analysisAPI.getHistory()
      setHistory(res.data.data)
    } catch (err) {
      setError('Failed to load dashboard data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  /* ─── Computed Analytics ─── */
  const analytics = useMemo(() => {
    if (!history.length) return null

    const sorted = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    const recentAnalyses = [...sorted].reverse().slice(0, 3)
    const latestAnalysis = recentAnalyses[0]

    // Score over time
    const scoreTimeline = sorted.map((item, i) => ({
      name: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: item.score,
      index: i + 1,
    }))

    // Stats
    const scores = sorted.map(h => h.score)
    const totalAnalyses = history.length
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const bestScore = Math.max(...scores)
    const latestScore = scores[scores.length - 1]
    const previousScore = scores.length > 1 ? scores[scores.length - 2] : null
    const scoreDelta = previousScore !== null ? latestScore - previousScore : null

    const firstThreeAvg = scores.length >= 3 ? Math.round(scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3) : scores[0]
    const lastThreeAvg = scores.length >= 3 ? Math.round(scores.slice(-3).reduce((a, b) => a + b, 0) / 3) : scores[scores.length - 1]
    const overallTrend = lastThreeAvg - firstThreeAvg

    // Skills
    const matchingFreq = {}
    const missingFreq = {}
    sorted.forEach(item => {
      item.matchingSkills?.forEach(s => { matchingFreq[s] = (matchingFreq[s] || 0) + 1 })
      item.missingSkills?.forEach(s => { missingFreq[s] = (missingFreq[s] || 0) + 1 })
    })

    const topMatching = Object.entries(matchingFreq).sort(([, a], [, b]) => b - a).slice(0, 5).map(([skill, count]) => ({ skill, count }))
    const topMissing = Object.entries(missingFreq).sort(([, a], [, b]) => b - a).slice(0, 5).map(([skill, count]) => ({ skill, count }))
    
    const topMissingSkill = latestAnalysis?.importantMissingSkillsToLearn?.[0] || latestAnalysis?.missingSkills?.[0]

    return {
      scoreTimeline, totalAnalyses, avgScore, bestScore, latestScore,
      scoreDelta, overallTrend, topMatching, topMissing,
      recentAnalyses, topMissingSkill
    }
  }, [history])

  const getScoreColor = (val) => {
    if (val >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' }
    if (val >= 60) return { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200' }
    if (val >= 40) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' }
    return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' }
  }

  /* ─── Rendering States ─── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 h-full">
        <Loader2 size={28} className="text-primary-500 animate-spin mb-4" />
        <p className="text-sm text-text-muted font-medium">Building your dashboard…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm max-w-md">{error}</div>
        <Button onClick={fetchHistory} variant="secondary" icon={RefreshCw}>Try Again</Button>
      </div>
    )
  }

  // Empty State
  if (!history.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-sm">
          <Target size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-3">Welcome to CareerSync!</h1>
        <p className="text-text-secondary text-base max-w-lg mx-auto mb-8">
          You don't have any resume analyses yet. Run your first scan to instantly unlock personalized insights, AI-curated learning roadmaps, and progress tracking.
        </p>
        <Button size="lg" icon={FilePlus2} onClick={() => onNavigate('new-analysis')}>
          Start New Analysis
        </Button>
      </motion.div>
    )
  }

  const { 
    scoreTimeline, totalAnalyses, avgScore, bestScore, latestScore, 
    scoreDelta, overallTrend, topMatching, topMissing, recentAnalyses, topMissingSkill
  } = analytics

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Here's a snapshot of your career readiness and recent progress.
          </p>
        </div>
        <Button icon={FilePlus2} onClick={() => onNavigate('new-analysis')} className="flex-shrink-0 shadow-sm">
          New Analysis
        </Button>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Activity} label="Total Analyses" value={totalAnalyses}
          subtext={`${totalAnalyses} resume${totalAnalyses > 1 ? 's' : ''} analyzed`} color="#6366f1" delay={0.05}
        />
        <StatCard
          icon={Target} label="Average Score" value={`${avgScore}%`} color="#3b82f6"
          trend={overallTrend !== 0 ? {
            direction: overallTrend > 0 ? 'up' : 'down', value: `${Math.abs(overallTrend)}pts`
          } : { direction: 'neutral', value: 'Stable' }} delay={0.1}
        />
        <StatCard
          icon={Award} label="Best Score" value={`${bestScore}%`} subtext="Personal best" color="#10b981" delay={0.15}
        />
        <StatCard
          icon={Zap} label="Latest Score" value={`${latestScore}%`} color="#f59e0b"
          trend={scoreDelta !== null ? {
            direction: scoreDelta > 0 ? 'up' : scoreDelta < 0 ? 'down' : 'neutral',
            value: scoreDelta !== 0 ? `${scoreDelta > 0 ? '+' : ''}${scoreDelta}pts` : 'Same'
          } : null} delay={0.2}
        />
      </div>

      {/* ─── Main Content Split ─── */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Score Progression */}
        <div className="lg:col-span-8 flex flex-col min-h-[380px]">
          <ChartCard
            title="Score Progression"
            subtitle="How your match scores have evolved over time"
            icon={TrendingUp}
            delay={0.25}
            className="flex-1"
          >
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <AreaChart data={scoreTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                <Area
                  type="monotone" dataKey="score" name="Score" stroke="#6366f1" strokeWidth={3} fill="url(#scoreGradient)"
                  dot={{ fill: '#6366f1', strokeWidth: 2, stroke: '#fff', r: 4 }}
                  activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Column: Actions & History */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Actionable Next Step */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary-100 mb-4">
                <Target size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-widest">Next Action</span>
              </div>
              
              {topMissingSkill ? (
                <>
                  <h3 className="text-lg font-bold mb-2">
                    Master <span className="text-white bg-white/20 px-2 py-0.5 rounded-lg ml-1">{topMissingSkill}</span>
                  </h3>
                  <p className="text-xs text-primary-100 leading-relaxed mb-5">
                    This was a key missing skill in your last scan. Add it to your repertoire to boost your score.
                  </p>
                  <button 
                    onClick={() => setSelectedSkill(topMissingSkill)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-primary-700 font-bold text-sm rounded-xl hover:bg-primary-50 transition-colors shadow-sm cursor-pointer"
                  >
                    <GraduationCap size={16} />
                    View Courses
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-2">You're on track!</h3>
                  <p className="text-xs text-primary-100 leading-relaxed mb-5">
                    Your last analysis showed a strong skill match. Great job!
                  </p>
                  <button 
                    onClick={() => onNavigate('learning')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-primary-700 font-bold text-sm rounded-xl hover:bg-primary-50 transition-colors shadow-sm cursor-pointer"
                  >
                    <GraduationCap size={16} />
                    Explore Courses
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Recent Activity List */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl border border-border overflow-hidden flex-1 flex flex-col"
          >
            <div className="px-5 py-3.5 border-b border-border/50 flex justify-between items-center bg-surface-alt">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} className="text-primary-500" />
                Recent Scans
              </h3>
              <button 
                onClick={() => onNavigate('history')}
                className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                View All <ChevronRight size={12} />
              </button>
            </div>
            
            <div className="p-2 flex-1">
              <div className="space-y-1">
                {recentAnalyses.map((item) => {
                  const style = getScoreColor(item.score)
                  const date = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  return (
                    <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-xs border ${style.bg} ${style.text} ${style.border}`}>
                        {item.score}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{item.shortSummary || item.jobTitle || "Resume Analysis"}</p>
                        <p className="text-[11px] font-medium text-text-muted mt-0.5">{date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Bottom Row: Skills Overview ─── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Strongest Skills */}
        <ChartCard title="Your Strongest Skills" subtitle="Most frequently matched across analyses" icon={TrendingUp} delay={0.4}>
          <div className="space-y-3 pt-1">
            {topMatching.length > 0 ? topMatching.map((item, i) => (
              <SkillBar key={item.skill} skill={item.skill} count={item.count} max={topMatching[0].count} color="#10b981" index={i} />
            )) : (
              <p className="text-xs font-medium text-text-muted py-6 text-center">No matching skills data yet.</p>
            )}
          </div>
        </ChartCard>

        {/* Weakest Skills */}
        <ChartCard title="Skills to Improve" subtitle="Most frequently missing across analyses" icon={TrendingDown} delay={0.45}>
          <div className="space-y-3 pt-1">
            {topMissing.length > 0 ? topMissing.map((item, i) => (
              <SkillBar key={item.skill} skill={item.skill} count={item.count} max={topMissing[0].count} color="#f87171" index={i} />
            )) : (
              <p className="text-xs font-medium text-text-muted py-6 text-center">No missing skills data yet.</p>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Course Modal overlay */}
      {selectedSkill && (
        <CourseModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </motion.div>
  )
}

export default Overview
