import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { analysisAPI, learningAPI } from '../services/api'
import Sidebar from '../components/dashboard/Sidebar'
import ScoreRing from '../components/analysis/ScoreRing'
import SkillsBreakdown from '../components/analysis/SkillsBreakdown'
import PhraseImprovements from '../components/analysis/PhraseImprovements'
import TailoringCard from '../components/analysis/TailoringCard'
import ActionVerbCard from '../components/analysis/ActionVerbCard'

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Fair Match'
  return 'Needs Work'
}

const AnalysisResultPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true)
      try {
        const res = await analysisAPI.getHistory()
        const history = res.data.data
        const item = history.find(item => item._id === id)
        if (item) {
          setAnalysis(item)
        } else {
          setError('Analysis not found')
        }
      } catch (err) {
        setError('Failed to fetch analysis')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalysis()
  }, [id])

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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeSection={null} onSectionChange={() => navigate('/dashboard')} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Analysis Results</h1>
            </div>
            <div className="text-sm text-gray-400">
              {analysis && new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {loading ? (
             <div className="space-y-6">
               <div className="h-48 bg-gray-200 animate-pulse rounded-2xl" />
               <div className="h-64 bg-gray-200 animate-pulse rounded-xl" />
               <div className="h-64 bg-gray-200 animate-pulse rounded-xl" />
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{error}</h2>
              <button
                onClick={() => navigate(-1)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer"
              >
                Go back to History
              </button>
            </div>
          ) : analysis ? (
            <div className="space-y-8">
               {/* Hero Section */}
               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-[40%] flex flex-col items-center md:items-start text-center md:text-left">
                    <ScoreRing score={analysis.score} size={120} strokeWidth={8} />
                    <h2 className="text-2xl font-semibold text-gray-900 mt-4">{getScoreLabel(analysis.score)}</h2>
                    <p className="text-sm text-gray-500 mt-1">{analysis.shortSummary}</p>
                    {analysis.targetRole && (
                      <div className="mt-4 flex flex-col items-center md:items-start gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TARGET ROLE</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                          {analysis.targetRole}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-[60%] flex flex-col justify-center">
                    <p className="text-base text-gray-700 leading-relaxed mb-6">{analysis.shortSummary}</p>
                    
                    {(analysis.requiredExperience || analysis.currentExperience) && (
                      <div className="flex gap-4">
                        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">REQUIRED</p>
                          <p className="text-lg font-bold text-gray-900">{analysis.requiredExperience?.years || 0} years</p>
                          {analysis.requiredExperience?.details && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{analysis.requiredExperience.details}</p>
                          )}
                        </div>
                        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">YOUR EXPERIENCE</p>
                          <p className={`text-lg font-bold ${(analysis.currentExperience?.years || 0) < (analysis.requiredExperience?.years || 0) ? 'text-red-600' : 'text-green-600'}`}>
                            {analysis.currentExperience?.years || 0} years
                          </p>
                          {analysis.currentExperience?.details && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{analysis.currentExperience.details}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
               </div>

               {/* Skills Breakdown */}
               <div className="bg-white rounded-xl border border-gray-200 p-6">
                 <SkillsBreakdown
                    matchingSkills={analysis.matchingSkills}
                    missingSkills={analysis.missingSkills}
                    prioritySkills={analysis.importantMissingSkillsToLearn}
                    onLearnAllMissing={handleLearnAll}
                    onLearnAllPriority={handleLearnAll}
                  />
                  {message && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <CheckCircle size={14} /> {message}
                    </div>
                  )}
               </div>

               {/* Phrase Improvements */}
               {analysis.phraseImprovementSuggestions?.length > 0 && (
                 <div className="bg-white rounded-xl border border-gray-200 p-6">
                   <div className="mb-4">
                     <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                       <span className="text-gray-900">✏️</span> Phrase Improvements
                     </h3>
                     <p className="text-sm text-gray-500">Stronger rewrites for weak resume bullets</p>
                   </div>
                   <PhraseImprovements suggestions={analysis.phraseImprovementSuggestions.slice(0, 5)} />
                 </div>
               )}

               {/* Tailoring Suggestions */}
               {analysis.resumeTailoringsuggestions?.length > 0 && (
                 <div className="bg-white rounded-xl border border-gray-200 p-6">
                   <div className="mb-4">
                     <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                       <span className="text-gray-900">💡</span> Tailoring Suggestions
                     </h3>
                     <p className="text-sm text-gray-500">Specific changes to improve your match score</p>
                   </div>
                   <div className="space-y-4">
                     {analysis.resumeTailoringsuggestions.map((suggestion, index) => (
                       <div key={index} className="flex items-start gap-3">
                         <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center shrink-0">
                           {index + 1}
                         </div>
                         <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{suggestion}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Action Verb Feedback */}
               {(analysis.actionVerbScore !== undefined || analysis.actionVerbFeedback || analysis.atsReadabilityScore !== undefined) && (
                 <div className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Action Verb Score</p>
                      <p className="text-3xl font-bold text-indigo-600 mb-2">{analysis.actionVerbScore ?? 0}%</p>
                      <p className="text-sm text-gray-600">{analysis.actionVerbFeedback}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">ATS Readability</p>
                      <p className={`text-3xl font-bold mb-2 ${
                        (analysis.atsReadabilityScore ?? 85) >= 70 ? 'text-green-600' :
                        (analysis.atsReadabilityScore ?? 85) >= 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {analysis.atsReadabilityScore ?? 85}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {analysis.atsReadabilityFeedback ?? 'Your resume format is readable by ATS.'}
                      </p>
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
