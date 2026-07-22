import { useState, useRef } from 'react'
import { X, Upload, FileText, ArrowRight, Loader2, AlertTriangle, User as UserIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadAPI, analysisAPI } from '../../services/api'
import { useProfile } from '../../context/ProfileContext'
import { useNavigate } from 'react-router-dom'

const AnalysisDrawer = ({ isOpen, onClose }) => {
  const { profile } = useProfile()
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
      
      // Fetch history to get the newly created analysis ID
      const historyRes = await analysisAPI.getHistory()
      const newAnalysisId = historyRes.data.data[0]._id
      
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
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Resume</label>
                  {profile ? (
                    <div className="space-y-3">
                      {!useAlternativeResume ? (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                              <UserIcon size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Using Master Profile</p>
                              <p className="text-xs text-gray-500">Your saved resume will be used.</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setUseAlternativeResume(true)}
                            disabled={loading}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Upload Alternative
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">Uploading an alternative resume for this analysis only.</p>
                            <button
                              onClick={() => { setUseAlternativeResume(false); setResumeFile(null) }}
                              disabled={loading}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer disabled:opacity-50"
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
                    <label className="text-sm font-semibold text-gray-900">Job Description</label>
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => setJdMode('text')}
                        disabled={loading}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer disabled:opacity-50 ${jdMode === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Paste Text
                      </button>
                      <button
                        onClick={() => setJdMode('file')}
                        disabled={loading}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer disabled:opacity-50 ${jdMode === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
                      className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition-all disabled:opacity-60"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
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

const FileDropZone = ({ file, onFileChange, onClear, inputRef, label, disabled }) => (
  <div
    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
      disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
    } ${
      file ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
    }`}
    onClick={() => !disabled && inputRef.current?.click()}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => !disabled && onFileChange(e)}
  >
    <input
      ref={inputRef}
      type="file"
      accept=".pdf,.doc,.docx"
      onChange={onFileChange}
      className="hidden"
      disabled={disabled}
    />
    {file ? (
      <div className="flex items-center justify-center gap-3">
        <FileText size={18} className="text-indigo-600" />
        <span className="text-sm font-medium text-gray-900">{file.name}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onClear() }}
          disabled={disabled}
          className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X size={14} />
        </button>
      </div>
    ) : (
      <>
        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOC, or DOCX — Drag & drop or click</p>
      </>
    )}
  </div>
)

export default AnalysisDrawer
