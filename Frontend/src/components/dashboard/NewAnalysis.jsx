import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, User as UserIcon, Sparkles, FileText, CheckCircle2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProfileStore } from '../../stores/useProfileStore'
import { useAnalysisStore } from '../../stores/useAnalysisStore'
import FileDropZone from '../common/FileDropZone'

/**
 * NewAnalysis workspace component for setting up precision resume diagnostics using useAnalysisStore.
 */
const NewAnalysis = () => {
  const profile = useProfileStore((state) => state.profile)
  const navigate = useNavigate()

  const resumeMode = useAnalysisStore((state) => state.resumeMode)
  const setResumeMode = useAnalysisStore((state) => state.setResumeMode)
  const resumeFile = useAnalysisStore((state) => state.resumeFile)
  const setResumeFile = useAnalysisStore((state) => state.setResumeFile)
  const isReplacingMaster = useAnalysisStore((state) => state.isReplacingMaster)
  const setIsReplacingMaster = useAnalysisStore((state) => state.setIsReplacingMaster)
  const updatingMaster = useAnalysisStore((state) => state.updatingMaster)
  const masterUpdateSuccess = useAnalysisStore((state) => state.masterUpdateSuccess)
  const jdFile = useAnalysisStore((state) => state.jdFile)
  const setJdFile = useAnalysisStore((state) => state.setJdFile)
  const jdText = useAnalysisStore((state) => state.jdText)
  const setJdText = useAnalysisStore((state) => state.setJdText)
  const jdMode = useAnalysisStore((state) => state.jdMode)
  const setJdMode = useAnalysisStore((state) => state.setJdMode)
  const loading = useAnalysisStore((state) => state.loadingAnalysis)
  const error = useAnalysisStore((state) => state.analysisError)
  const handleFileDrop = useAnalysisStore((state) => state.handleFileDrop)
  const handleUpdateMasterResume = useAnalysisStore((state) => state.handleUpdateMasterResume)
  const handleSubmitAnalysis = useAnalysisStore((state) => state.handleSubmitAnalysis)
  const resetForm = useAnalysisStore((state) => state.resetForm)

  const resumeRef = useRef(null)
  const jdRef = useRef(null)

  useEffect(() => {
    resetForm()
  }, [resetForm])

  const onSubmit = (e) => handleSubmitAnalysis(e, navigate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0f172a] font-display flex items-center gap-2">
          <Sparkles size={22} className="text-[#0f172a]" />
          New Analysis
        </h1>
        <p className="text-xs sm:text-sm text-[#64748b] mt-0.5 font-normal">
          Upload a target job description and evaluate it against your master resume or an updated profile for instant skill gap detection.
        </p>
      </div>

      {/* Main Workspace Form */}
      <form onSubmit={onSubmit} className="bg-white rounded-xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}
        {masterUpdateSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            {masterUpdateSuccess}
          </div>
        )}

        {/* Step 1: Resume Source */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f172a] font-display flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#f1f5f9] text-[#0f172a] border border-[#e2e8f0] text-[10px] flex items-center justify-center font-mono">1</span>
              Select Resume Source
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Choice 1: Master Resume */}
            <div
              onClick={() => {
                setResumeMode('master')
                setResumeFile(null)
                setIsReplacingMaster(false)
              }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                resumeMode === 'master'
                  ? 'border-[#0f172a] bg-[#f8fafc] shadow-xs'
                  : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <UserIcon size={16} />
                  </div>
                  {resumeMode === 'master' && (
                    <CheckCircle2 size={18} className="text-[#0f172a]" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#0f172a]">Master Resume</h3>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  {profile
                    ? `Use your saved master profile (${profile.resumeFileName || 'Master Resume'}).`
                    : 'Upload your permanent master resume to save to your profile.'}
                </p>
              </div>
            </div>

            {/* Choice 2: One-Time Upload */}
            <div
              onClick={() => {
                setResumeMode('one-time')
                setResumeFile(null)
                setIsReplacingMaster(false)
              }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                resumeMode === 'one-time'
                  ? 'border-[#0f172a] bg-[#f8fafc] shadow-xs'
                  : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  {resumeMode === 'one-time' && (
                    <CheckCircle2 size={18} className="text-[#0f172a]" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#0f172a]">One-Time Upload</h3>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  Upload an alternative resume for this single scan only without altering your master profile.
                </p>
              </div>
            </div>
          </div>

          {/* Master Resume Panel */}
          {resumeMode === 'master' && (
            <div className="space-y-3">
              {profile && !isReplacingMaster ? (
                <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#0f172a]">Saved Master Profile Active</p>
                      <p className="text-[11px] text-[#64748b]">
                        Using <strong className="font-semibold text-[#0f172a]">{profile.resumeFileName || 'Master Resume'}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReplacingMaster(true)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw size={12} /> Replace / Update File
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0f172a]">Upload New Master Resume (Will permanently update profile)</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsReplacingMaster(false)
                          setResumeFile(null)
                        }}
                        className="text-xs text-[#64748b] hover:text-[#0f172a] hover:underline cursor-pointer"
                      >
                        ← Cancel & keep current master
                      </button>
                    </div>
                  )}
                  <FileDropZone
                    file={resumeFile}
                    onFileChange={(e) => handleFileDrop(e, setResumeFile)}
                    onClear={() => setResumeFile(null)}
                    inputRef={resumeRef}
                    label="Upload master resume file (PDF, DOC, DOCX)"
                    disabled={loading || updatingMaster}
                  />
                  {resumeFile && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleUpdateMasterResume}
                        disabled={updatingMaster}
                        className="px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {updatingMaster ? <Loader2 size={12} className="animate-spin" /> : null}
                        {updatingMaster ? 'Updating Profile...' : 'Save as Master Profile'}
                      </button>
                      <span className="text-[11px] text-[#64748b]">Or click "Run Precision Analysis" below to save & analyze together.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* One-Time Panel */}
          {resumeMode === 'one-time' && (
            <div className="space-y-3">
              <FileDropZone
                file={resumeFile}
                onFileChange={(e) => handleFileDrop(e, setResumeFile)}
                onClear={() => setResumeFile(null)}
                inputRef={resumeRef}
                label="Upload alternative resume for this single scan (PDF, DOC, DOCX)"
                disabled={loading}
              />
            </div>
          )}
        </div>

        <hr className="border-[#e2e8f0]" />

        {/* Step 2: Job Description */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0f172a] font-display flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#f1f5f9] text-[#0f172a] border border-[#e2e8f0] text-[10px] flex items-center justify-center font-mono">2</span>
              Provide Job Description
            </h2>
            <div className="flex bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setJdMode('text')}
                disabled={loading}
                className={`px-2.5 py-0.5 text-xs font-medium rounded-md transition-all cursor-pointer disabled:opacity-50 ${jdMode === 'text' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'}`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setJdMode('file')}
                disabled={loading}
                className={`px-2.5 py-0.5 text-xs font-medium rounded-md transition-all cursor-pointer disabled:opacity-50 ${jdMode === 'file' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'}`}
              >
                Upload File
              </button>
            </div>
          </div>

          {jdMode === 'text' ? (
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={loading}
              placeholder="Paste the full job description here (responsibilities, required skills, tools, experience)..."
              rows={5}
              className="w-full rounded-lg border border-[#e2e8f0] p-3 text-xs sm:text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] resize-none transition-all disabled:opacity-60 bg-white"
            />
          ) : (
            <FileDropZone
              file={jdFile}
              onFileChange={(e) => handleFileDrop(e, setJdFile)}
              onClear={() => setJdFile(null)}
              inputRef={jdRef}
              label="Upload job description document (PDF, DOC, DOCX)"
              disabled={loading}
            />
          )}
        </div>

        {/* Step 3: Run Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg text-sm font-semibold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {loading ? 'Running AI Diagnostics…' : 'Run Precision Analysis'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default NewAnalysis
