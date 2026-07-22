import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2, ShieldCheck } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { motion } from 'framer-motion'

const ResumeUploadZone = () => {
  const { uploadProfile } = useProfile()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const handleFileDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (f) { setFile(f); setSuccess(false); setError('') }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      await uploadProfile(formData)
      setFile(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={16} className="text-indigo-600" />
        <p className="text-sm font-semibold text-gray-900">Update Master Resume</p>
      </div>

      {error && (
        <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-medium"
        >
          ✓ Resume uploaded and profile updated successfully!
        </motion.div>
      )}

      <div
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 cursor-pointer ${
          file ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/20'
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileDrop} className="hidden" />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={18} className="text-indigo-600" />
            <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null) }}
              className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={22} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Click or drag & drop</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — up to 5MB</p>
          </>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : null}
          {uploading ? 'Processing AI…' : 'Parse & Upload Resume'}
        </button>
      )}
    </div>
  )
}

export default ResumeUploadZone
