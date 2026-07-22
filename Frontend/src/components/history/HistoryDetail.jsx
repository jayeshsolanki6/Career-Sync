import { useState } from 'react'
import { TrendingUp, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { learningAPI } from '../../services/api'
import SkillsBreakdown from '../analysis/SkillsBreakdown'
import TailoringCard from '../analysis/TailoringCard'
import ScoreRing from '../analysis/ScoreRing'
import PhraseImprovements from '../analysis/PhraseImprovements'

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Work'
}

const HistoryDetail = ({ item, onLearnSkill }) => {
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  const handleLearnAll = async (skills) => {
    if (!skills || !skills.length) return
    setAdding(true)
    setMessage('')
    let addedCount = 0
    for (const skill of skills) {
      try {
        await learningAPI.addSkill({ skillName: skill })
        addedCount++
      } catch (e) {
        // silently skip
      }
    }
    setAdding(false)
    setMessage(`${addedCount} skills added to Learning Hub`)
    setTimeout(() => setMessage(''), 4000)
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-t-0 border-indigo-300 rounded-b-xl p-6 space-y-8"
    >
      {/* SECTION 1: HEADER & SECTION 2: EXPERIENCE */}
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <ScoreRing score={item.score} size={80} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{getScoreLabel(item.score)} Match</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.shortSummary}</p>
            
            {item.targetRole && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Target Role:</span>
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold">
                  {item.targetRole}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: EXPERIENCE COMPARISON */}
        {(item.requiredExperience || item.currentExperience) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">REQUIRED EXPERIENCE</p>
              <p className="text-lg font-semibold text-gray-900">{item.requiredExperience?.years || 0} years</p>
              {item.requiredExperience?.details && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.requiredExperience.details}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">YOUR EXPERIENCE</p>
              <p className={`text-lg font-semibold ${(item.currentExperience?.years || 0) < (item.requiredExperience?.years || 0) ? 'text-red-600' : 'text-green-600'}`}>
                {item.currentExperience?.years || 0} years
              </p>
              {item.currentExperience?.details && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.currentExperience.details}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* SECTION 3: SKILLS BREAKDOWN */}
      <div className="space-y-4">
        <SkillsBreakdown
          matchingSkills={item.matchingSkills}
          missingSkills={item.missingSkills}
          prioritySkills={item.importantMissingSkillsToLearn}
          onLearnAllMissing={handleLearnAll}
          onLearnAllPriority={handleLearnAll}
        />
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <CheckCircle size={14} /> {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <hr className="border-gray-200" />

      {/* SECTION 4: PHRASE IMPROVEMENTS */}
      {item.phraseImprovementSuggestions?.length > 0 && (
        <>
          <PhraseImprovements suggestions={item.phraseImprovementSuggestions} />
          <hr className="border-gray-200" />
        </>
      )}

      {/* SECTION 5: TAILORING SUGGESTIONS */}
      {item.resumeTailoringsuggestions?.length > 0 && (
        <TailoringCard suggestions={item.resumeTailoringsuggestions} />
      )}
    </motion.div>
  )
}

export default HistoryDetail
