import { useState } from 'react'
import { ChevronDown, ChevronUp, Sparkles, Zap, Target, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ProfileSummary = ({ profile }) => {
  const [expanded, setExpanded] = useState(false)

  if (!profile) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Sparkles size={18} className="text-indigo-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">Profile Summary</p>
            <p className="text-xs text-gray-500">AI-generated career overview</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-4">
              {/* AI Summary */}
              {profile.experienceSummary && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-500" /> AI Career Summary
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-200">
                    {profile.experienceSummary}
                  </p>
                </div>
              )}

              {/* Targeted Roles */}
              {profile.targetRoles?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1.5">
                    <Target size={12} /> Targeted Roles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.targetRoles.map((role, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Arsenal */}
              {profile.skills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1.5">
                    <Zap size={12} className="text-indigo-500" /> Skills Arsenal ({profile.skills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, 20).map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 20 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                        +{profile.skills.length - 20} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Baseline Health */}
              {profile.resumeHealth && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-1.5">
                    <Briefcase size={12} /> Baseline Health
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Action Verb Score</p>
                      <p className="text-xl font-bold text-indigo-600">{profile.resumeHealth.actionVerbScore}%</p>
                      {profile.resumeHealth.actionVerbFeedback && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{profile.resumeHealth.actionVerbFeedback}</p>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Readability Score</p>
                      <p className="text-xl font-bold text-green-600">{profile.resumeHealth.readabilityScore}%</p>
                      {profile.resumeHealth.readabilityFeedback && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{profile.resumeHealth.readabilityFeedback}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileSummary
