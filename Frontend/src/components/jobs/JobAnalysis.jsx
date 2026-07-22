import { ArrowLeft } from 'lucide-react'
import ScoreRing from '../analysis/ScoreRing'
import SkillsBreakdown from '../analysis/SkillsBreakdown'
import TailoringCard from '../analysis/TailoringCard'
import PhraseImprovements from '../analysis/PhraseImprovements'

const JobAnalysis = ({ result, onBack }) => {
  const { analysis, score } = result

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Details
        </button>
        <h2 className="text-base font-semibold text-gray-900">Fit Analysis</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {/* SECTION 1: HEADER */}
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <ScoreRing score={score.overall} size={80} />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{score.interpretation?.level} Match</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{analysis.shortSummary}</p>
              
              {analysis.targetRole && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Target Role:</span>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold">
                    {analysis.targetRole}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: EXPERIENCE COMPARISON */}
          {(analysis.requiredExperience || analysis.currentExperience) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">REQUIRED EXPERIENCE</p>
                <p className="text-lg font-semibold text-gray-900">{analysis.requiredExperience?.years || 0} years</p>
                {analysis.requiredExperience?.details && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{analysis.requiredExperience.details}</p>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">YOUR EXPERIENCE</p>
                <p className={`text-lg font-semibold ${(analysis.currentExperience?.years || 0) < (analysis.requiredExperience?.years || 0) ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.currentExperience?.years || 0} years
                </p>
                {analysis.currentExperience?.details && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{analysis.currentExperience.details}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* SECTION 3: SKILLS BREAKDOWN */}
        <SkillsBreakdown
          matchingSkills={analysis.matchingSkills}
          missingSkills={analysis.missingSkills}
          prioritySkills={analysis.importantMissingSkillsToLearn}
        />

        <hr className="border-gray-200" />

        {/* SECTION 4: PHRASE IMPROVEMENTS */}
        {analysis.phraseImprovementSuggestions?.length > 0 && (
          <>
            <PhraseImprovements suggestions={analysis.phraseImprovementSuggestions} />
            <hr className="border-gray-200" />
          </>
        )}

        {/* SECTION 5: TAILORING SUGGESTIONS */}
        {analysis.resumeTailoringsuggestions?.length > 0 && (
          <TailoringCard suggestions={analysis.resumeTailoringsuggestions} />
        )}

        <p className="text-[10px] text-gray-400 text-center pb-2 uppercase tracking-tight">
          This analysis was not saved to your history.
        </p>
      </div>
    </div>
  )
}

export default JobAnalysis
