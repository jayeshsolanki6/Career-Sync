import { ArrowLeft, Tag, Check, Sparkles } from 'lucide-react'
import ScoreRing from '../analysis/ScoreRing'
import SkillsBreakdown from '../analysis/SkillsBreakdown'
import PhraseImprovements from '../analysis/PhraseImprovements'
import ScoreBreakdownCard from '../analysis/ScoreBreakdownCard'

const getSkillName = (s) => (typeof s === 'object' && s !== null ? s.skill || '' : String(s || ''))

const JobAnalysis = ({ result, onBack }) => {
  const { analysis, score } = result

  // Extract or fallback ATS keywords
  const atsKeywordsList = analysis?.atsKeywords?.length > 0
    ? analysis.atsKeywords
    : Array.from(new Set([...(analysis?.matchingSkills || []), ...(analysis?.missingSkills || [])]))
        .map(s => getSkillName(s))
        .filter(Boolean)
        .slice(0, 10)

  const breakdownData = score?.breakdown || analysis?.score?.breakdown || analysis?.scoreDetails?.breakdown

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a] rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Details
          </button>
          <h2 className="text-base font-bold text-[#0f172a] font-display">Job Match Report</h2>
        </div>
        <span className="text-xs font-semibold text-[#64748b] bg-[#f8fafc] px-3 py-1 rounded-full border border-[#e2e8f0]">
          Quick Analysis
        </span>
      </div>

      {/* Main Body Content (Independently Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* SECTION 1: HEADER & SUMMARY */}
        <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-5 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center text-center shrink-0">
            <ScoreRing score={typeof score === 'object' ? score.overall : score} size={95} strokeWidth={7} />
            <h3 className="text-base font-bold text-[#0f172a] font-display mt-2">{score.interpretation?.level || 'Match Score'}</h3>
            {analysis.targetRole && (
              <span className="mt-1 px-2.5 py-0.5 bg-white text-[#0f172a] border border-[#e2e8f0] rounded-full text-[11px] font-semibold">
                {analysis.targetRole}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] mb-1 flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#0f172a]" /> Executive Summary
              </p>
              <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{analysis.shortSummary}</p>
            </div>

            {(analysis.requiredExperience || analysis.currentExperience) && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white rounded-lg border border-[#e2e8f0] p-2.5">
                  <p className="text-[9px] font-bold text-[#64748b] uppercase">REQUIRED EXP</p>
                  <p className="text-xs font-bold text-[#0f172a]">{analysis.requiredExperience?.years ?? 'N/A'} {analysis.requiredExperience?.years != null ? 'years' : ''}</p>
                </div>
                <div className="bg-white rounded-lg border border-[#e2e8f0] p-2.5">
                  <p className="text-[9px] font-bold text-[#64748b] uppercase">YOUR EXP</p>
                  <p className={`text-xs font-bold ${(analysis.currentExperience?.years || 0) < (analysis.requiredExperience?.years || 0) ? 'text-red-600' : 'text-emerald-600'}`}>
                    {analysis.currentExperience?.years ?? 0} years
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: SCORE BREAKDOWN */}
        <ScoreBreakdownCard breakdown={breakdownData} />

        {/* SECTION 2: ATS KEYWORDS */}
        {atsKeywordsList.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a] font-display flex items-center gap-2">
                  <Tag size={16} className="text-[#0f172a]" /> ATS Keywords to Add
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">High-impact keywords extracted from the job description for ATS optimization.</p>
              </div>
              <span className="px-2.5 py-0.5 bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0] rounded-full text-xs font-semibold">
                {atsKeywordsList.length} keywords
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {atsKeywordsList.map((kwItem, idx) => {
                const kw = getSkillName(kwItem)
                const isMatched = analysis?.matchingSkills?.some(s => getSkillName(s).toLowerCase() === kw.toLowerCase())
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-[#f8fafc] text-[#334155] border-[#e2e8f0]'
                    }`}
                  >
                    {isMatched && <Check size={12} className="text-emerald-600" />}
                    {kw}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: SKILLS BREAKDOWN */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs">
          <SkillsBreakdown
            matchingSkills={analysis.matchingSkills}
            missingSkills={analysis.missingSkills}
            prioritySkills={analysis.importantMissingSkillsToLearn}
          />
        </div>

        {/* SECTION 4: PHRASE IMPROVEMENTS */}
        {analysis.phraseImprovementSuggestions?.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-[#0f172a] font-display flex items-center gap-2">
                <span>✏️</span> Bullet & Phrase Improvements
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">Tailored rewrites to strengthen weak bullet points for this role.</p>
            </div>
            <PhraseImprovements suggestions={analysis.phraseImprovementSuggestions} />
          </div>
        )}

        {/* SECTION 5: TAILORING SUGGESTIONS */}
        {analysis.resumeTailoringsuggestions?.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-[#0f172a] font-display flex items-center gap-2">
                <span>💡</span> Tailoring Recommendations
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">Targeted updates to maximize your ATS ranking.</p>
            </div>
            <div className="space-y-2.5">
              {analysis.resumeTailoringsuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-white text-[#0f172a] border border-[#e2e8f0] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobAnalysis
