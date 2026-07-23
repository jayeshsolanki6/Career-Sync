import { useState } from 'react'
import { FileText, Target, Award, CheckCircle2, Sparkles, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * ProfileSummary component with collapse/expand toggle.
 * Displays career overview, target roles, complete skill set (all skills without clipping),
 * and full unclipped Action Verb & Readability health feedback.
 */
const ProfileSummary = ({ profile }) => {
  const [expanded, setExpanded] = useState(false)

  if (!profile) return null

  const experienceYears = profile.experienceYears ?? 0

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-xs transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#e2e8f0]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#0f172a] font-display">Profile Summary</h3>
              {profile.resumeFileName && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] bg-[#f8fafc] px-2.5 py-0.5 rounded-md border border-[#e2e8f0]">
                  <FileText size={12} className="text-[#0f172a]" /> {profile.resumeFileName}
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">Parsed resume profile & baseline health metrics</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer border border-[#e2e8f0]"
        >
          <span>{expanded ? 'Collapse' : 'Expand'}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Collapsible Body Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Career Overview Section */}
              {profile.experienceSummary && (
                <div className="bg-[#f8fafc] rounded-xl p-4.5 border-l-4 border-[#0f172a] border-t border-r border-b border-[#e2e8f0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0f172a] font-display flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#0f172a]" /> Career Overview
                    </span>
                    {experienceYears > 0 && (
                      <span className="text-xs font-semibold text-[#0f172a] bg-white px-3 py-0.5 rounded-full border border-[#e2e8f0]">
                        {experienceYears} {experienceYears === 1 ? 'Year' : 'Years'} Experience
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">
                    {profile.experienceSummary}
                  </p>
                </div>
              )}

              {/* Target Roles & All Skills */}
              <div className="space-y-4">
                {/* Target Roles */}
                {profile.targetRoles?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b] font-display mb-2">
                      <Target size={14} className="text-[#0f172a]" /> Target Roles
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.targetRoles.map((role, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#0f172a] text-white rounded-lg text-xs font-semibold shadow-2xs"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Skills (No clipping or truncation) */}
                {profile.skills?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] font-display flex items-center gap-1.5">
                        <Layers size={14} className="text-[#0f172a]" /> Skills ({profile.skills.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0] rounded-md text-xs font-medium hover:border-[#cbd5e1] transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Resume Baseline Health */}
              {profile.resumeHealth && (
                <div className="pt-4 border-t border-[#e2e8f0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0f172a] font-display flex items-center gap-1.5">
                      <Award size={15} className="text-[#0f172a]" /> Resume Baseline Health
                    </span>
                    <span className="text-xs font-medium text-[#64748b] flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600" /> Complete Analysis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Action Verbs Score & Full Feedback */}
                    <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#0f172a] font-display">Action Verbs Usage</span>
                          <span className="text-xs font-extrabold text-[#0f172a] bg-white px-2.5 py-0.5 rounded-full border border-[#e2e8f0]">
                            {profile.resumeHealth.actionVerbScore}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mb-2.5">
                          <div
                            className="h-full bg-[#0f172a] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(profile.resumeHealth.actionVerbScore || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                      {profile.resumeHealth.actionVerbFeedback && (
                        <p className="text-xs text-[#475569] leading-relaxed font-normal">
                          {profile.resumeHealth.actionVerbFeedback}
                        </p>
                      )}
                    </div>

                    {/* Readability Score & Full Feedback */}
                    <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#0f172a] font-display">Readability & Structure</span>
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {profile.resumeHealth.readabilityScore}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mb-2.5">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(profile.resumeHealth.readabilityScore || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                      {profile.resumeHealth.readabilityFeedback && (
                        <p className="text-xs text-[#475569] leading-relaxed font-normal">
                          {profile.resumeHealth.readabilityFeedback}
                        </p>
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
