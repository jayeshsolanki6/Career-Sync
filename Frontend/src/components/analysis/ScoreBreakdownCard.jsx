import { Award, Briefcase } from 'lucide-react'

/**
 * ScoreBreakdownCard renders the detailed breakdown of the score:
 * - Skill Match vs Experience Alignment bars & descriptions
 */
const ScoreBreakdownCard = ({ breakdown }) => {
  const skillMatch = breakdown?.skillMatch || { score: 100, description: 'Skill coverage match' }
  const experienceAlignment = breakdown?.experienceAlignment || { score: 100, description: 'Experience requirement alignment' }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Skill Match Meter */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5 font-display">
              <Award size={14} className="text-[#0f172a]" /> Skill Match
            </span>
            <span className="text-sm font-extrabold text-[#0f172a] font-display">
              {skillMatch.score}%
            </span>
          </div>

          <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(Math.max(skillMatch.score, 0), 100)}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed mt-1">
          {skillMatch.description}
        </p>
      </div>

      {/* Experience Alignment Meter */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5 font-display">
              <Briefcase size={14} className="text-[#0f172a]" /> Experience Alignment
            </span>
            <span className="text-sm font-extrabold text-[#0f172a] font-display">
              {experienceAlignment.score}%
            </span>
          </div>

          <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(Math.max(experienceAlignment.score, 0), 100)}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed mt-1">
          {experienceAlignment.description}
        </p>
      </div>
    </div>
  )
}

export default ScoreBreakdownCard
