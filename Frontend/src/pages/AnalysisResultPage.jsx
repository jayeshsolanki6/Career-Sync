import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Tag, Sparkles, Check, AlertCircle } from 'lucide-react'
import { analysisAPI, learningAPI } from '../services/api'
import { useAnalysisStore } from '../stores/useAnalysisStore'
import Sidebar from '../components/dashboard/Sidebar'
import ScoreRing from '../components/analysis/ScoreRing'
import SkillsBreakdown from '../components/analysis/SkillsBreakdown'
import PhraseImprovements from '../components/analysis/PhraseImprovements'
import ScoreBreakdownCard from '../components/analysis/ScoreBreakdownCard'

const getScoreLabel = (score) => {
  const val = typeof score === 'object' && score !== null ? score.overall || 0 : score
  if (val >= 80) return 'Excellent Match'
  if (val >= 60) return 'Good Match'
  if (val >= 40) return 'Fair Match'
  return 'Needs Work'
}

const AnalysisResultPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const history = useAnalysisStore((state) => state.history)
  const fetchHistory = useAnalysisStore((state) => state.fetchHistory)

  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true)
      setError('')
      try {
        let items = history
        if (!items || !items.length) {
          await fetchHistory()
          items = useAnalysisStore.getState().history
        }
        const item = items.find((item) => item._id === id)
        if (item) {
          setAnalysis(item)
        } else {
          setError('Analysis not found')
        }
      } catch {
        setError('Failed to fetch analysis')
      } finally {
        setLoading(false)
      }
    }
    loadReport()
  }, [id, history, fetchHistory])

  const handleLearnAll = async (skills) => {
    if (!skills || !skills.length) return
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
    setMessage(`${addedCount} skills added to Learning Hub`)
    setTimeout(() => setMessage(''), 4000)
  }

  // Derive or extract ATS keywords
  const atsKeywordsList = analysis?.atsKeywords?.length > 0
    ? analysis.atsKeywords
    : Array.from(new Set([...(analysis?.matchingSkills || []), ...(analysis?.missingSkills || [])]))
        .map(s => (typeof s === 'object' && s !== null ? s.skill : s))
        .filter(Boolean)
        .slice(0, 10)

  const getSkillName = (s) => (typeof s === 'object' && s !== null ? s.skill || '' : String(s || ''))

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar
        activeSection={null}
        onSectionChange={(sectionId) => {
          if (sectionId === 'overview') {
            navigate('/dashboard')
          } else {
            navigate(`/dashboard?section=${sectionId}`)
          }
        }}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[960px] mx-auto px-5 py-6">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-xs text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a] flex items-center gap-1.5 cursor-pointer font-semibold transition-colors"
              >
                <ArrowLeft size={14} /> Back to History
              </button>
              <h1 className="text-xl font-bold text-[#0f172a] font-display">Analysis Report</h1>
            </div>
            {analysis && (
              <span className="text-xs font-semibold text-[#64748b] bg-white px-3 py-1 rounded-full border border-[#e2e8f0]">
                {new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          {loading ? (
             <div className="space-y-4">
               <div className="h-48 bg-[#e2e8f0] animate-pulse rounded-xl" />
               <div className="h-64 bg-[#e2e8f0] animate-pulse rounded-xl" />
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-[#e2e8f0]">
              <AlertCircle size={36} className="text-red-500 mb-2" />
              <h2 className="text-lg font-bold text-[#0f172a] mb-3 font-display">{error}</h2>
              <button
                onClick={() => navigate(-1)}
                className="bg-[#0f172a] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#1e293b] cursor-pointer"
              >
                Return to History
              </button>
            </div>
           ) : analysis ? (
            <div className="space-y-6">
               {/* Hero Section */}
               <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs p-6 flex flex-col md:flex-row gap-8 items-center">
                  {/* Left Column: Score Ring & Target Role */}
                  <div className="w-full md:w-[35%] flex flex-col items-center text-center">
                    <ScoreRing score={typeof analysis.score === 'object' ? analysis.score.overall : analysis.score} size={130} strokeWidth={9} />
                    <h2 className="text-2xl font-bold text-[#0f172a] font-display mt-4">{getScoreLabel(analysis.score)}</h2>
                    {analysis.targetRole && (
                      <div className="mt-3 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">TARGET ROLE</span>
                        <span className="px-3 py-1 bg-[#f8fafc] text-[#0f172a] rounded-full text-xs font-semibold border border-[#e2e8f0]">
                          {analysis.targetRole}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Executive Summary & Experience Alignment */}
                  <div className="w-full md:w-[65%] space-y-4">
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] mb-1 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-[#0f172a]" /> Executive Summary
                      </p>
                      <p className="text-sm text-[#334155] leading-relaxed font-normal">{analysis.shortSummary}</p>
                    </div>
                    
                    {(analysis.requiredExperience || analysis.currentExperience) && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5">
                          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wide mb-1">REQUIRED EXPERIENCE</p>
                          <p className="text-base font-bold text-[#0f172a] font-display">{analysis.requiredExperience?.years ?? 'N/A'} {analysis.requiredExperience?.years != null ? 'years' : ''}</p>
                          {analysis.requiredExperience?.details && (
                            <p className="text-xs text-[#64748b] mt-1 line-clamp-2">{analysis.requiredExperience.details}</p>
                          )}
                        </div>
                        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5">
                          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wide mb-1">YOUR EXPERIENCE</p>
                          <p className={`text-base font-bold font-display ${(analysis.currentExperience?.years || 0) < (analysis.requiredExperience?.years || 0) ? 'text-red-600' : 'text-emerald-600'}`}>
                            {analysis.currentExperience?.years ?? 0} years
                          </p>
                          {analysis.currentExperience?.details && (
                            <p className="text-xs text-[#64748b] mt-1 line-clamp-2">{analysis.currentExperience.details}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
               </div>

               {/* Score Breakdown */}
               <ScoreBreakdownCard
                 breakdown={analysis.scoreDetails?.breakdown || (typeof analysis.score === 'object' ? analysis.score?.breakdown : null)}
               />

               {/* ATS Keywords Section */}
               <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className="text-base font-bold text-[#0f172a] font-display flex items-center gap-2">
                       <Tag size={18} className="text-[#0f172a]" /> ATS Keywords to Add
                     </h3>
                     <p className="text-xs text-[#64748b] mt-0.5">High-impact keywords extracted from the job description. Adding these to your resume will boost your ATS match score.</p>
                   </div>
                   <span className="px-2.5 py-0.5 bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0] rounded-full text-xs font-semibold">
                     {atsKeywordsList.length} keywords
                   </span>
                 </div>

                 <div className="flex flex-wrap gap-2">
                   {atsKeywordsList.map((kwItem, idx) => {
                     const kw = typeof kwItem === 'object' && kwItem !== null ? kwItem.skill || '' : String(kwItem || '')
                     const isMatched = analysis?.matchingSkills?.some(s => getSkillName(s).toLowerCase() === kw.toLowerCase())
                     return (
                       <span
                         key={idx}
                         className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
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

               {/* Skills Breakdown */}
               <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
                 <SkillsBreakdown
                    matchingSkills={analysis.matchingSkills}
                    missingSkills={analysis.missingSkills}
                    prioritySkills={analysis.importantMissingSkillsToLearn}
                    onLearnAllMissing={handleLearnAll}
                    onLearnAllPriority={handleLearnAll}
                  />
                  {message && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                      <CheckCircle size={14} /> {message}
                    </div>
                  )}
               </div>

               {/* Phrase Improvements */}
               {analysis.phraseImprovementSuggestions?.length > 0 && (
                 <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
                   <div className="mb-4">
                     <h3 className="text-base font-bold text-[#0f172a] font-display flex items-center gap-2">
                       <span>✏️</span> Bullet & Phrase Improvements
                     </h3>
                     <p className="text-xs text-[#64748b] mt-0.5">High-impact rewrites to strengthen weak bullet points detected in your resume.</p>
                   </div>
                   <PhraseImprovements suggestions={analysis.phraseImprovementSuggestions.slice(0, 5)} />
                 </div>
               )}

               {/* Tailoring Suggestions */}
               {analysis.resumeTailoringsuggestions?.length > 0 && (
                 <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
                   <div className="mb-4">
                     <h3 className="text-base font-bold text-[#0f172a] font-display flex items-center gap-2">
                       <span>💡</span> Tailoring Recommendations
                     </h3>
                     <p className="text-xs text-[#64748b] mt-0.5">Targeted updates to maximize your ATS ranking for this role.</p>
                   </div>
                   <div className="space-y-3">
                     {analysis.resumeTailoringsuggestions.map((suggestion, index) => (
                       <div key={index} className="flex items-start gap-3 bg-[#f8fafc] border border-[#e2e8f0] p-3.5 rounded-xl">
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
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default AnalysisResultPage
