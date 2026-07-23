import { useState } from 'react'
import { Plus, Check, Loader2, X, BookOpen, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { learningAPI } from '../../services/api'

const getSkillName = (s) => (typeof s === 'object' && s !== null ? s.skill || String(s) : String(s || ''))

const SkillsBreakdown = ({ matchingSkills = [], missingSkills = [], prioritySkills = [] }) => {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [addedSkills, setAddedSkills] = useState({})
  const [loadingSkill, setLoadingSkill] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleAddSkill = async (skillName) => {
    if (!skillName || addedSkills[skillName]) return
    setLoadingSkill(true)
    setStatusMessage('')
    try {
      await learningAPI.addSkill({ skillName })
      setAddedSkills(prev => ({ ...prev, [skillName]: true }))
      setStatusMessage(`"${skillName}" added to Learning Hub!`)
      setTimeout(() => setStatusMessage(''), 3000)
    } catch {
      setAddedSkills(prev => ({ ...prev, [skillName]: true }))
      setStatusMessage(`"${skillName}" is now in your Learning Hub.`)
      setTimeout(() => setStatusMessage(''), 3000)
    } finally {
      setLoadingSkill(false)
    }
  }

  // Deduplicate strings
  const formattedMatching = matchingSkills.map(getSkillName).filter(Boolean)
  const formattedMissing = missingSkills.map(getSkillName).filter(Boolean)
  const formattedPriority = prioritySkills.map(getSkillName).filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Matching Skills */}
      {formattedMatching.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-bold text-[#0f172a] font-display">Matching Skills</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              {formattedMatching.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {formattedMatching.map((name, idx) => (
              <span
                key={idx}
                className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
              >
                <Check size={12} className="text-emerald-600" /> {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {formattedMissing.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-sm font-bold text-[#0f172a] font-display">Missing Skills</span>
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
                {formattedMissing.length}
              </span>
            </div>
            <span className="text-[11px] text-[#64748b]">Click a skill to track it</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {formattedMissing.map((name, idx) => {
              const isAdded = addedSkills[name]
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedSkill({ name, type: 'missing' })}
                  className={`border rounded-lg px-3 py-1 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'
                  }`}
                >
                  {isAdded ? <Check size={12} /> : <Plus size={12} />}
                  {name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Priority Skill Gaps Banner */}
      {formattedPriority.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-display">
                Priority Skills to Learn
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
              Recommended
            </span>
          </div>
          <p className="text-xs text-amber-900/80 mb-3">
            Closing these core missing skills will give you the highest ATS score boost for this role. Click any skill to add it to your Learning Hub.
          </p>

          <div className="flex flex-wrap gap-2">
            {formattedPriority.map((name, idx) => {
              const isAdded = addedSkills[name]
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedSkill({ name, type: 'priority' })}
                  className={`border rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
                    isAdded
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                  }`}
                >
                  {isAdded ? <Check size={13} /> : <Plus size={13} />}
                  {name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {formattedMatching.length === 0 && formattedMissing.length === 0 && (
        <p className="text-sm text-[#64748b] text-center py-4">No skills data available.</p>
      )}

      {/* Interactive Skill Action Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl border border-[#e2e8f0] p-6 max-w-sm w-full shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-[#0f172a]" />
                  <h3 className="text-base font-bold text-[#0f172a] font-display">{selectedSkill.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-1 rounded-md text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedSkill.type === 'priority' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedSkill.type === 'priority' ? 'Priority Target Skill' : 'Missing Requirement'}
                </span>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Add <strong className="text-[#0f172a]">{selectedSkill.name}</strong> to your Learning Hub to receive curated courses, progress tracking, and AI-generated study roadmaps.
                </p>
              </div>

              {statusMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check size={14} /> {statusMessage}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="flex-1 py-2 bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleAddSkill(selectedSkill.name)}
                  disabled={loadingSkill || addedSkills[selectedSkill.name]}
                  className="flex-1 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loadingSkill ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : addedSkills[selectedSkill.name] ? (
                    <>
                      <Check size={14} /> Added
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Add to Learning Hub
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SkillsBreakdown
