import { useState } from 'react'

const SkillsBreakdown = ({ matchingSkills = [], missingSkills = [], prioritySkills = [], onLearnAllMissing, onLearnAllPriority }) => {
  const [showAllMissing, setShowAllMissing] = useState(false)
  const [showAllPriority, setShowAllPriority] = useState(false)

  const missingLimit = 8
  const displayedMissing = showAllMissing ? missingSkills : missingSkills.slice(0, missingLimit)

  const priorityLimit = prioritySkills.length > 8 ? 8 : prioritySkills.length
  const displayedPriority = showAllPriority ? prioritySkills : prioritySkills.slice(0, priorityLimit)

  return (
    <div className="space-y-6">
      {matchingSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-gray-700">Matching Skills</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              {matchingSkills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchingSkills.map((skill) => (
              <span
                key={skill}
                className="bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {prioritySkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-sm font-medium text-gray-700">Priority Skills to Learn</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              {prioritySkills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayedPriority.map((skill) => (
              <span
                key={skill}
                className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          {prioritySkills.length > priorityLimit && (
            <button
              onClick={() => setShowAllPriority(!showAllPriority)}
              className="text-gray-400 text-xs mt-2 block hover:underline cursor-pointer"
            >
              {showAllPriority ? 'Show less ←' : `Show ${prioritySkills.length - priorityLimit} more →`}
            </button>
          )}
          {onLearnAllPriority && (
            <button onClick={() => onLearnAllPriority(prioritySkills)} className="text-indigo-600 text-xs font-medium mt-2 block hover:underline cursor-pointer">
              Track these in Learning Hub →
            </button>
          )}
        </div>
      )}

      {missingSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-sm font-medium text-gray-700">Missing Skills</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              {missingSkills.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayedMissing.map((skill) => (
              <span
                key={skill}
                className="bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          {missingSkills.length > missingLimit && (
            <button
              onClick={() => setShowAllMissing(!showAllMissing)}
              className="text-gray-400 text-xs mt-2 block hover:underline cursor-pointer"
            >
              {showAllMissing ? 'Show less ←' : `Show ${missingSkills.length - missingLimit} more →`}
            </button>
          )}
          {onLearnAllMissing && (
            <button onClick={() => onLearnAllMissing(missingSkills)} className="text-indigo-600 text-xs font-medium mt-2 block hover:underline cursor-pointer">
              Track these in Learning Hub →
            </button>
          )}
        </div>
      )}

      {matchingSkills.length === 0 && missingSkills.length === 0 && prioritySkills.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No skills data available.</p>
      )}
    </div>
  )
}

export default SkillsBreakdown
