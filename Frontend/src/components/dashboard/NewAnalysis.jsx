import { useState, useRef } from 'react'
import { Upload, FileText, X, ArrowRight, Loader2, RotateCcw, CheckCircle2, XCircle, Lightbulb, TrendingUp, AlertTriangle, GraduationCap, Briefcase, FileSearch } from 'lucide-react'
import Button from '../common/Button'
import { uploadAPI } from '../../services/api'
import CourseModal from './CourseModal'
import { motion } from 'framer-motion'

// Using shadcn/ui components (assumes they are manually aliased correctly or accessible)
// If we run into import alias issues we can inline the core tailwind styles or use generic HTML, 
// but we'll try to stick to standard Tailwind classes for maximum compatibility if components aren't perfectly aligned
const NewAnalysis = () => {
  const [resumeFile, setResumeFile] = useState(null)
  const [jdFile, setJdFile] = useState(null)
  const [jdText, setJdText] = useState('')
  const [jdMode, setJdMode] = useState('file') // 'text' or 'file'
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const resumeRef = useRef(null)
  const jdRef = useRef(null)

  const handleFileDrop = (e, setter) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (file) setter(file)
  }

  const handleSubmit = async () => {
    setError('')
    if (!resumeFile) {
      setError('Please upload your resume.')
      return
    }
    if (jdMode === 'text' && !jdText.trim()) {
      setError('Please enter the job description.')
      return
    }
    if (jdMode === 'file' && !jdFile) {
      setError('Please upload the job description file.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      if (jdMode === 'file' && jdFile) {
        formData.append('jd', jdFile)
      } else {
        formData.append('jdText', jdText)
      }

      const res = await uploadAPI.analyzeResume(formData)
      setResult(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const FileDropZone = ({ file, onFileChange, onClear, inputRef, label }) => (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${file ? 'border-primary-300 bg-primary-50/50' : 'border-border hover:border-primary-300 hover:bg-primary-50/30'
        }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onFileChange(e)}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => onFileChange(e)}
        className="hidden"
      />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText size={20} className="text-primary-600" />
          <span className="text-sm font-medium text-text-primary">{file.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="p-1 rounded-full hover:bg-red-50 text-text-muted hover:text-danger transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <Upload size={28} className="mx-auto text-text-muted mb-3" />
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-muted mt-1">PDF, DOC, or DOCX — Drag & drop or click</p>
        </>
      )}
    </div>
  )

  if (result) {
    return <AnalysisResult result={result} onReset={() => { setResult(null); setResumeFile(null); setJdFile(null); setJdText('') }} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">New Analysis</h1>
        <p className="text-text-secondary text-sm mt-1">Upload your resume and job description to get started.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="space-y-6">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">Resume</label>
          <FileDropZone
            file={resumeFile}
            onFileChange={(e) => handleFileDrop(e, setResumeFile)}
            onClear={() => setResumeFile(null)}
            inputRef={resumeRef}
            label="Upload your resume"
          />
        </div>

        {/* JD Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-text-primary">Job Description</label>
            <div className="flex bg-surface-alt rounded-lg p-0.5 border border-border">
              <button
                onClick={() => setJdMode('file')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${jdMode === 'file' ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
                  }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setJdMode('text')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${jdMode === 'text' ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
                  }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {jdMode === 'text' ? (
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="w-full rounded-2xl border border-border p-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none hover:border-primary-300"
            />
          ) : (
            <FileDropZone
              file={jdFile}
              onFileChange={(e) => handleFileDrop(e, setJdFile)}
              onClear={() => setJdFile(null)}
              inputRef={jdRef}
              label="Upload job description"
            />
          )}
        </div>

        <Button
          size="lg"
          fullWidth
          icon={loading ? Loader2 : ArrowRight}
          loading={loading}
          onClick={handleSubmit}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </div>
    </motion.div>
  )
}

/* ─── Analysis Result Display ─── */
const AnalysisResult = ({ result, onReset }) => {
  const { analysis, score } = result
  const [selectedSkill, setSelectedSkill] = useState(null)

  const phraseSuggestions = analysis.phraseImprovementSuggestions ||
    analysis.actionVerbSuggestions?.map((item) => ({
      weakPhrase: item.oldVerb,
      betterAlternatives: [item.suggestedVerb].filter(Boolean),
      rationale: 'Uses stronger and more impactful wording.',
    })) || []

  // Determine score gradient color
  const getScoreColor = (val) => {
    if (val >= 80) return { from: '#10b981', to: '#059669', text: 'text-emerald-600' }
    if (val >= 60) return { from: '#6366f1', to: '#4f46e5', text: 'text-primary-600' }
    if (val >= 40) return { from: '#f59e0b', to: '#d97706', text: 'text-amber-600' }
    return { from: '#ef4444', to: '#dc2626', text: 'text-red-600' }
  }

  const overallColor = getScoreColor(score.overall)

  // Filter out experience alignment from breakdown
  const filteredBreakdown = Object.entries(score.breakdown).filter(
    ([key]) => key.toLowerCase() !== 'experiencealignment' && key.toLowerCase() !== 'experience alignment'
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analysis Results</h1>
          {analysis.targetRole && (
            <div className="inline-flex mt-2 items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-100">
              <Briefcase size={14} />
              Target Role: {analysis.targetRole}
            </div>
          )}
          <p className="text-text-secondary text-sm mt-2 leading-relaxed max-w-2xl">{analysis.shortSummary}</p>
        </div>
        <Button variant="secondary" onClick={onReset} icon={RotateCcw}>New Analysis</Button>
      </div>

      {/* Overall Score Card — enhanced */}
      <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-sm ring-1 ring-black/5">
        <div className="bg-linear-to-r from-primary-50 via-accent-50 to-primary-50 px-6 py-4 border-b border-border/50">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={14} />
            Overall Match Score
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-8">
            {/* Circular Score */}
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={overallColor.from}
                  strokeWidth="8"
                  strokeDasharray={`${(score.overall / 100) * 264} 264`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold" style={{ color: overallColor.from }}>{score.overall}</span>
                <span className="text-[10px] text-text-muted font-medium">/ 100</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold" style={{ color: score.interpretation.color }}>{score.interpretation.level}</h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">{score.interpretation.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown — without experience alignment */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredBreakdown.map(([key, val]) => {
          const itemColor = getScoreColor(val.score)
          return (
            <div key={key} className="bg-white rounded-2xl border border-border/80 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <span className="text-2xl font-bold" style={{ color: itemColor.from }}>{val.score}</span>
              </div>
              <div className="h-2 bg-surface-alt rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${val.score}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(to right, ${itemColor.from}, ${itemColor.to})` }}
                />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{val.description}</p>
            </div>
          )
        })}
      </div>

      {/* Skills Section — clickable for course recommendations */}
      <div className="grid sm:grid-cols-2 gap-4">
        <SkillList
          title="Matching Skills"
          skills={analysis.matchingSkills}
          variant="success"
          icon={<CheckCircle2 size={16} className="text-emerald-500" />}
          onSkillClick={setSelectedSkill}
        />
        <SkillList
          title="Missing Skills"
          skills={analysis.missingSkills}
          variant="danger"
          icon={<XCircle size={16} className="text-red-400" />}
          onSkillClick={setSelectedSkill}
        />
        {analysis.importantMissingSkillsToLearn && analysis.importantMissingSkillsToLearn.length > 0 && (
          <div className="sm:col-span-2">
            <SkillList
              title="Important Missing Skills To Learn"
              skills={analysis.importantMissingSkillsToLearn}
              variant="warning"
              icon={<AlertTriangle size={16} className="text-amber-500" />}
              onSkillClick={setSelectedSkill}
              showCourseHint
            />
          </div>
        )}
      </div>

      {/* Suggestions — enhanced */}
      {analysis.resumeTailoringsuggestions?.length > 0 && (
        <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-sm ring-1 ring-black/5">
          <div className="bg-linear-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-border/50">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
              <Lightbulb size={16} />
              Resume Tailoring Suggestions
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {analysis.resumeTailoringsuggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-secondary">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold mt-0.5 shadow-sm">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Formatting Insights (Weak Phrases) */}
      {phraseSuggestions.length > 0 && (
        <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-sm ring-1 ring-black/5">
          <div className="bg-linear-to-r from-indigo-50 to-sky-50 px-6 py-4 border-b border-border/50">
            <h3 className="text-sm font-bold text-indigo-800 flex items-center gap-2">
              <FileSearch size={16} />
              Formatting Insights
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {phraseSuggestions.map((suggestion, i) => (
              <div key={i} className="rounded-2xl border border-border/80 bg-linear-to-br from-white to-surface-alt/70 p-4 space-y-3 shadow-xs">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">Weak Phrase</p>
                  <p className="text-sm text-text-primary leading-relaxed">"{suggestion.weakPhrase}"</p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">Better Alternatives</p>
                  <ul className="space-y-2">
                    {(suggestion.betterAlternatives || []).map((alternative, altIndex) => (
                      <li key={altIndex} className="flex items-start gap-2 text-sm text-indigo-800 bg-white border border-indigo-200/70 rounded-lg px-3 py-2 shadow-xs">
                        <ArrowRight size={14} className="mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{alternative}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {suggestion.rationale && (
                  <div className="rounded-lg bg-white border border-border px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">Rationale</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{suggestion.rationale}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Modal */}
      {selectedSkill && (
        <CourseModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </motion.div>
  )
}

const SkillList = ({ title, skills, variant, icon, onSkillClick, showCourseHint }) => {
  let colors = ''
  let headerBg = ''
  let hoverColor = ''

  if (variant === 'success') {
    colors = 'bg-emerald-50 text-emerald-700 border-emerald-200'
    headerBg = 'from-emerald-50 to-green-50'
    hoverColor = 'hover:bg-emerald-100 hover:shadow-sm'
  } else if (variant === 'danger') {
    colors = 'bg-red-50 text-red-700 border-red-200'
    headerBg = 'from-red-50 to-rose-50'
    hoverColor = 'hover:bg-red-100 hover:shadow-sm'
  } else if (variant === 'warning') {
    colors = 'bg-amber-50 text-amber-700 border-amber-200'
    headerBg = 'from-amber-50 to-orange-50'
    hoverColor = 'hover:bg-amber-100 hover:shadow-sm'
  }

  return (
    <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-sm ring-1 ring-black/5">
      <div className={`bg-linear-to-r ${headerBg} px-5 py-3 border-b border-border/50 flex items-center gap-2`}>
        {icon}
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">{title}</h3>
        <span className="ml-auto text-xs font-bold text-text-muted bg-white/80 px-2 py-0.5 rounded-full">
          {skills?.length || 0}
        </span>
      </div>
      <div className="p-5">
        {showCourseHint && (
          <div className="flex items-center gap-1.5 mb-3 px-2 py-1.5 rounded-lg bg-primary-50/60 border border-primary-100">
            <GraduationCap size={12} className="text-primary-500" />
            <p className="text-[10px] text-primary-600 font-medium">Click any skill to view free course recommendations</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {skills?.length > 0 ? skills.map((skill) => (
            <button
              key={skill}
              onClick={() => onSkillClick?.(skill)}
              className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${colors} ${hoverColor} hover:-translate-y-0.5 active:scale-95`}
              title={`View courses for ${skill}`}
            >
              {skill}
              <GraduationCap size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )) : (
            <span className="text-xs text-text-muted">None detected</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewAnalysis
