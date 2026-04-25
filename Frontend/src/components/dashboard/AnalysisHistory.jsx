import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Clock, Inbox, Loader2, RefreshCw, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle, Lightbulb, TrendingUp, GraduationCap } from 'lucide-react'
import { analysisAPI } from '../../services/api'
import CourseModal from './CourseModal'
import { motion } from 'framer-motion'

const AnalysisHistory = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)

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

  useEffect(() => {
    fetchHistory()
  }, [])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getScoreColor = (val) => {
    if (val >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', color: '#10b981' }
    if (val >= 60) return { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200', color: '#6366f1' }
    if (val >= 40) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', color: '#f59e0b' }
    return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', color: '#ef4444' }
  }

  const getScoreLabel = (val) => {
    if (val >= 80) return 'Excellent'
    if (val >= 60) return 'Good'
    if (val >= 40) return 'Fair'
    return 'Needs Work'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analysis History</h1>
          <p className="text-text-secondary text-sm mt-1">View your past resume analyses and track your progress.</p>
        </div>
        {!loading && history.length > 0 && (
          <button
            onClick={fetchHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-white border border-border rounded-xl hover:border-primary-300 hover:text-primary-600 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 size={28} className="text-primary-500 animate-spin mb-4" />
          <p className="text-sm text-text-muted">Loading your analysis history…</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm max-w-md">{error}</div>
          <button
            onClick={fetchHistory}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-alt flex items-center justify-center mb-4">
            <Inbox size={28} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">No analyses yet</h3>
          <p className="text-sm text-text-muted max-w-sm">
            Your analysis history will appear here once you run your first resume analysis.
          </p>
        </div>
      )}

      {/* History List */}
      {!loading && !error && history.length > 0 && (
        <div className="space-y-3">
          {history.map((item, i) => {
            const scoreStyle = getScoreColor(item.score)
            const isExpanded = expandedId === item._id

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                {/* Summary Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item._id)}
                  className={`flex items-center gap-4 p-4 bg-white rounded-2xl border transition-all duration-200 cursor-pointer ${isExpanded
                      ? 'border-primary-300 shadow-md rounded-b-none'
                      : 'border-border hover:border-primary-200 hover:shadow-sm'
                    }`}
                >
                  {/* Score Badge */}
                  <div className={`w-12 h-12 rounded-xl ${scoreStyle.bg} flex flex-col items-center justify-center flex-shrink-0 border ${scoreStyle.border}`}>
                    <span className={`text-lg font-bold leading-none ${scoreStyle.text}`}>{item.score}</span>
                    <span className="text-[8px] font-medium text-text-muted mt-0.5">/ 100</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {item.shortSummary || 'Resume Analysis'}
                    </p>
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {formatDate(item.createdAt)}
                    </p>
                  </div>

                  {/* Score Label + Expand */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`hidden sm:inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${scoreStyle.bg} ${scoreStyle.text} border ${scoreStyle.border}`}>
                      {getScoreLabel(item.score)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-text-muted" />
                    ) : (
                      <ChevronDown size={16} className="text-text-muted" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white border border-t-0 border-primary-300 rounded-b-2xl p-5 space-y-5">
                        {/* Summary */}
                        {item.shortSummary && (
                          <div className="flex items-start gap-2 p-3 bg-surface-alt rounded-xl">
                            <TrendingUp size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-text-secondary leading-relaxed">{item.shortSummary}</p>
                          </div>
                        )}

                        {/* Score Ring */}
                        <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                              <circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke={scoreStyle.color}
                                strokeWidth="8"
                                strokeDasharray={`${(item.score / 100) * 264} 264`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-xl font-extrabold" style={{ color: scoreStyle.color }}>{item.score}</span>
                              <span className="text-[9px] text-text-muted font-medium">/ 100</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: scoreStyle.color }}>{getScoreLabel(item.score)} Match</p>
                            <p className="text-xs text-text-muted mt-0.5">
                              {item.matchingSkills?.length || 0} matching · {item.missingSkills?.length || 0} missing skills
                            </p>
                          </div>
                        </div>

                        {/* Skills Grid */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          {item.matchingSkills?.length > 0 && (
                            <SkillBadgeGroup
                              title="Matching Skills"
                              skills={item.matchingSkills}
                              icon={<CheckCircle2 size={13} className="text-emerald-500" />}
                              colors="bg-emerald-50 text-emerald-700 border-emerald-200"
                              hoverColor="hover:bg-emerald-100"
                              onSkillClick={setSelectedSkill}
                            />
                          )}
                          {item.missingSkills?.length > 0 && (
                            <SkillBadgeGroup
                              title="Missing Skills"
                              skills={item.missingSkills}
                              icon={<XCircle size={13} className="text-red-400" />}
                              colors="bg-red-50 text-red-700 border-red-200"
                              hoverColor="hover:bg-red-100"
                              onSkillClick={setSelectedSkill}
                            />
                          )}
                        </div>

                        {/* Important Missing Skills */}
                        {item.importantMissingSkillsToLearn?.length > 0 && (
                          <SkillBadgeGroup
                            title="Priority Skills to Learn"
                            skills={item.importantMissingSkillsToLearn}
                            icon={<AlertTriangle size={13} className="text-amber-500" />}
                            colors="bg-amber-50 text-amber-700 border-amber-200"
                            hoverColor="hover:bg-amber-100"
                            onSkillClick={setSelectedSkill}
                            showCourseHint
                          />
                        )}

                        {/* Suggestions */}
                        {item.resumeTailoringsuggestions?.length > 0 && (
                          <div className="bg-surface-alt rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5 mb-3">
                              <Lightbulb size={13} className="text-amber-500" />
                              Tailoring Suggestions
                            </h4>
                            <ul className="space-y-2">
                              {item.resumeTailoringsuggestions.map((s, idx) => (
                                <li key={idx} className="flex gap-2 text-xs text-text-secondary">
                                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-[9px] font-bold mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed">{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Experience */}
                        {(item.requiredExperience || item.currentExperience) && (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {item.requiredExperience && (
                              <div className="bg-surface-alt rounded-xl p-3">
                                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Required Experience</p>
                                <p className="text-sm font-bold text-text-primary">{item.requiredExperience.years} years</p>
                                {item.requiredExperience.details && (
                                  <p className="text-xs text-text-secondary mt-1">{item.requiredExperience.details}</p>
                                )}
                              </div>
                            )}
                            {item.currentExperience && (
                              <div className="bg-surface-alt rounded-xl p-3">
                                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Your Experience</p>
                                <p className="text-sm font-bold text-text-primary">{item.currentExperience.years} years</p>
                                {item.currentExperience.details && (
                                  <p className="text-xs text-text-secondary mt-1">{item.currentExperience.details}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Course Modal */}
      {selectedSkill && (
        <CourseModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </motion.div>
  )
}

/* ─── Skill Badge Group ─── */
const SkillBadgeGroup = ({ title, skills, icon, colors, hoverColor, onSkillClick, showCourseHint }) => (
  <div>
    <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-2">
      {icon} {title}
      <span className="ml-auto text-[10px] font-bold text-text-muted bg-surface-alt px-1.5 py-0.5 rounded-full">
        {skills.length}
      </span>
    </h4>
    {showCourseHint && (
      <div className="flex items-center gap-1 mb-2 px-2 py-1 rounded-lg bg-primary-50/60 border border-primary-100">
        <GraduationCap size={10} className="text-primary-500" />
        <p className="text-[9px] text-primary-600 font-medium">Click to view free courses</p>
      </div>
    )}
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <button
          key={skill}
          onClick={() => onSkillClick?.(skill)}
          className={`group inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-all duration-200 cursor-pointer ${colors} ${hoverColor} active:scale-95`}
          title={`View courses for ${skill}`}
        >
          {skill}
          <GraduationCap size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  </div>
)

export default AnalysisHistory
