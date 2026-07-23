import { useState, useRef } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import { useProfileStore } from '../../stores/useProfileStore'
import { motion } from 'framer-motion'
import FileDropZone from '../common/FileDropZone'

/**
 * ResumeUploadZone card component for uploading and updating the user's master profile resume.
 */
const ResumeUploadZone = () => {
  const uploadProfile = useProfileStore((state) => state.uploadProfile)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const handleFileDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (f) {
      setFile(f)
      setSuccess(false)
      setError('')
    }
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
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={16} className="text-[#0f172a]" />
        <p className="text-sm font-bold text-[#0f172a] font-display">Update Master Resume</p>
      </div>

      {error && (
        <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium"
        >
          ✓ Resume uploaded and profile updated successfully!
        </motion.div>
      )}

      <FileDropZone
        file={file}
        onFileChange={handleFileDrop}
        onClear={() => setFile(null)}
        inputRef={fileRef}
        label="Click or drag & drop"
        disabled={uploading}
      />

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : null}
          {uploading ? 'Processing AI…' : 'Parse & Upload Resume'}
        </button>
      )}
    </div>
  )
}

export default ResumeUploadZone
