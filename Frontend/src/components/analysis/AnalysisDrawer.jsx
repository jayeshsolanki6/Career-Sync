import { useState, useRef } from 'react'
import { X, ArrowRight, Loader2, AlertTriangle, User as UserIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadAPI, analysisAPI } from '../../services/api'
import { useProfileStore } from '../../stores/useProfileStore'
import { useNavigate } from 'react-router-dom'
import FileDropZone from '../common/FileDropZone'

/**
 * Slide-over drawer component for triggering a new analysis.
 */
const AnalysisDrawer = ({ isOpen, onClose }) => {
  const profile = useProfileStore((state) => state.profile)
  const navigate = useNavigate()
  const [resumeFile, setResumeFile] = useState(null)
  const [useAlternativeResume, setUseAlternativeResume] = useState(false)
  const [jdFile, setJdFile] = useState(null)
  const [jdText, setJdText] = useState('')
  const [jdMode, setJdMode] = useState('text')
  const [loading, setLoading] = useState(false)
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
    const needsResumeUpload = !profile || useAlternativeResume
    if (needsResumeUpload && !resumeFile) {
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
      if (needsResumeUpload && resumeFile) formData.append('resume', resumeFile)
      if (jdMode === 'file' && jdFile) formData.append('jd', jdFile)
      else formData.append('jdText', jdText)

      await uploadAPI.analyzeResume(formData)
      
      const historyRes = await analysisAPI.getHistory()
      const newAnalysisId = historyRes.data.data[0]._id
      
      handleReset()
      onClose()
      navigate(`/analysis/${newAnalysisId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.')
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResumeFile(null)
    setJdFile(null)
    setJdText('')
    setError('')
    setLoading(false)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={!loading ? handleClose : undefined}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[660px] bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">New Analysis</h2>
                <p className="text-xs text-gray-500 mt-0.5">Match your resume against a job description</p>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-bold text-[#0f172a] font-display mb-3">Resume</label>
                  {profile ? (
                    <div className="space-y-3">
                      {!useAlternativeResume ? (
                        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white border border-[#e2e8f0] text-[#0f172a] rounded-lg flex items-center justify-center">
                              <UserIcon size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#0f172a]">Using Master Profile</p>
                              <p className="text-xs text-[#64748b]">Your saved resume will be used.</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setUseAlternativeResume(true)}
                            disabled={loading}
                            className="text-xs font-semibold text-[#0f172a] hover:underline transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Upload Alternative
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-[#64748b]">Uploading an alternative resume for this analysis only.</p>
                            <button
                              onClick={() => { setUseAlternativeResume(false); setResumeFile(null) }}
                              disabled={loading}
                              className="text-xs font-semibold text-[#0f172a] hover:underline cursor-pointer disabled:opacity-50"
                            >
                              Use Master Profile
                            </button>
                          </div>
                          <FileDropZone
                            file={resumeFile}
                            onFileChange={(e) => handleFileDrop(e, setResumeFile)}
                            onClear={() => setResumeFile(null)}
                            inputRef={resumeRef}
                            label="Upload alternative resume"
                            disabled={loading}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                        <AlertTriangle size={15} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800">
                          No master profile yet. Upload a resume below.
                        </p>
                      </div>
                      <FileDropZone
                        file={resumeFile}
                        onFileChange={(e) => handleFileDrop(e, setResumeFile)}
                        onClear={() => setResumeFile(null)}
                        inputRef={resumeRef}
                        label="Upload your resume"
                        disabled={loading}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-[#0f172a] font-display">Job Description</label>
                    <div className="flex bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-0.5">
                      <button
                        onClick={() => setJdMode('text')}
                        disabled={loading}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer disabled:opacity-50 ${jdMode === 'text' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'}`}
                      >
                        Paste Text
                      </button>
                      <button
                        onClick={() => setJdMode('file')}
                        disabled={loading}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer disabled:opacity-50 ${jdMode === 'file' ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'}`}
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
                      placeholder="Paste the job description here..."
                      rows={8}
                      className="w-full rounded-lg border border-[#e2e8f0] p-4 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] resize-none transition-all disabled:opacity-60 bg-white"
                    />
                  ) : (
                    <FileDropZone
                      file={jdFile}
                      onFileChange={(e) => handleFileDrop(e, setJdFile)}
                      onClear={() => setJdFile(null)}
                      inputRef={jdRef}
                      label="Upload job description"
                      disabled={loading}
                    />
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  {loading ? 'Analyzing…' : 'Analyze Resume'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AnalysisDrawer
