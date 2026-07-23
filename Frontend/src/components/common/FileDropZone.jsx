import { Upload, FileText, X } from 'lucide-react'

/**
 * Reusable File Drop Zone component for drag-and-drop file inputs.
 * @param {Object} props
 * @param {File|null} props.file - Currently selected file
 * @param {Function} props.onFileChange - Handler for file selection/drop
 * @param {Function} props.onClear - Handler to clear the selected file
 * @param {React.RefObject} props.inputRef - Ref attached to the hidden file input
 * @param {string} props.label - Dropzone title text
 * @param {boolean} [props.disabled=false] - Whether the dropzone is disabled
 * @param {string} [props.accept=".pdf,.doc,.docx"] - Allowed file extensions
 */
const FileDropZone = ({
  file,
  onFileChange,
  onClear,
  inputRef,
  label,
  disabled = false,
  accept = '.pdf,.doc,.docx',
}) => {
  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } ${
        file ? 'border-[#0f172a] bg-[#f8fafc]' : 'border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
      }`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => !disabled && onFileChange(e)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onFileChange}
        className="hidden"
        disabled={disabled}
      />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText size={18} className="text-[#0f172a]" />
          <span className="text-xs font-semibold text-[#0f172a]">{file.name}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            disabled={disabled}
            className="p-1 rounded-full hover:bg-red-50 text-[#64748b] hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <Upload size={22} className="mx-auto text-[#94a3b8] mb-1.5" />
          <p className="text-xs font-semibold text-[#0f172a]">{label}</p>
          <p className="text-[11px] text-[#64748b] mt-0.5">PDF, DOC, or DOCX — Drag & drop or click to browse</p>
        </>
      )}
    </div>
  )
}

export default FileDropZone
