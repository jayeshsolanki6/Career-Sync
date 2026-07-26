import { Plus, Search, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ProgressRing = ({ progress, size = 40, stroke = 3.5 }) => {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0f172a" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#0f172a]">
        {progress}%
      </span>
    </div>
  )
}

const SkillSidebar = ({ skills, selectedItem, onSelect, onDelete, prioritySkills, onAdd, addingSkill, searchQuery, setSearchQuery, inputRef }) => {
  const getPriority = (name) => prioritySkills?.some(s => s?.toLowerCase() === name?.toLowerCase()) || false

  const getProgress = (item) => {
    if (!item?.roadmap) return 0
    try {
      const p = JSON.parse(item.roadmap)
      if (!p.plan) return 0
      const stored = JSON.parse(localStorage.getItem(`cs_tasks_${item._id}`) || '{}')
      let total = 0, done = 0
      p.plan.forEach((d, di) => d.tasks?.forEach((_, ti) => { total++; if (stored[`${di}-${ti}`]) done++ }))
      return total > 0 ? Math.round((done / total) * 100) : 0
    } catch { return 0 }
  }

  const getDoneTotals = (item) => {
    if (!item?.roadmap) return { done: 0, total: 0 }
    try {
      const p = JSON.parse(item.roadmap)
      if (!p.plan) return { done: 0, total: 0 }
      const stored = JSON.parse(localStorage.getItem(`cs_tasks_${item._id}`) || '{}')
      let total = 0, done = 0
      p.plan.forEach((d, di) => d.tasks?.forEach((_, ti) => { total++; if (stored[`${di}-${ti}`]) done++ }))
      return { done, total }
    } catch { return { done: 0, total: 0 } }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    onAdd(searchQuery.trim())
  }

  return (
    <div className="w-full lg:w-80 shrink-0 flex flex-col gap-3 min-h-0">
      <form onSubmit={handleAdd} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Add a skill…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[#e2e8f0] focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] outline-none transition-all text-[#0f172a]"
          />
        </div>
        <button
          type="submit"
          disabled={addingSkill || !searchQuery.trim()}
          className="flex items-center gap-1 px-3.5 py-2.5 bg-[#0f172a] text-white text-sm font-medium rounded-lg hover:bg-[#1e293b] transition-colors disabled:opacity-60 cursor-pointer shrink-0"
        >
          {addingSkill ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Add
        </button>
      </form>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-[#e2e8f0] text-center p-6">
          <Sparkles size={32} className="text-[#94a3b8] mb-3" />
          <h3 className="text-sm font-bold text-[#0f172a] font-display mb-1">No skills yet</h3>
          <p className="text-xs text-[#64748b] max-w-[180px]">Add skills to start building your learning path.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-0.5">
          <AnimatePresence>
            {skills.map(item => {
              const prog = getProgress(item)
              const { done, total } = getDoneTotals(item)
              const isSel = selectedItem?._id === item._id
              const isPriority = getPriority(item.skillName)

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => onSelect(item)}
                  className={`relative bg-white rounded-xl border p-3.5 cursor-pointer transition-all group hover:shadow-xs ${
                    isSel ? 'border-[#0f172a] shadow-xs' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                  }`}
                >
                  {isSel && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-[#0f172a]" />}
                  <div className="flex items-center gap-3">
                    <ProgressRing progress={prog} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{item.skillName}</h3>
                        {isPriority && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-red-100 text-red-600 shrink-0">
                            Priority
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {total > 0 ? `${done}/${total} tasks` : 'No plan yet'}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Delete skill"
                      onClick={e => { e.stopPropagation(); onDelete(item._id) }}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 cursor-pointer rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default SkillSidebar