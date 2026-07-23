import { MapPin, Clock, Building2, DollarSign } from 'lucide-react'

const TYPE_COLORS = {
  FULLTIME: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PARTTIME: 'bg-[#f8fafc] text-[#0f172a] border-[#e2e8f0]',
  CONTRACTOR: 'bg-amber-50 text-amber-700 border-amber-200',
  INTERN: 'bg-[#f8fafc] text-[#0f172a] border-[#e2e8f0]',
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Recently'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function formatSalary(salary) {
  if (!salary?.min && !salary?.max) return null
  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n
  const period = salary.period ? `/${salary.period.toLowerCase()}` : ''
  if (salary.min && salary.max) return `$${fmt(salary.min)} – $${fmt(salary.max)}${period}`
  if (salary.min) return `$${fmt(salary.min)}+${period}`
  return `Up to $${fmt(salary.max)}${period}`
}

const JobCard = ({ job, isSelected, onClick, profile }) => {
  const salary = formatSalary(job.salary)
  const typeColor = TYPE_COLORS[job.employmentType] || 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]'

  const matchScore = (() => {
    if (!profile?.skills?.length || !job.requiredSkills?.length) return null
    const profileSkills = profile.skills.map(s => s.toLowerCase())
    const matchCount = job.requiredSkills.filter(s => profileSkills.includes(s.toLowerCase())).length
    return Math.round((matchCount / job.requiredSkills.length) * 100)
  })()

  const matchColor =
    matchScore >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : matchScore >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-red-50 text-red-700 border-red-200'

  return (
    <button
      onClick={() => onClick(job)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'border-[#0f172a] bg-[#f8fafc] shadow-xs'
          : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
      }`}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-8 h-8 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <Building2 size={16} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
            {job.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{job.company}</p>
        </div>
        {job.isRemote && (
          <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
            Remote
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={10} /> {job.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock size={10} /> {timeAgo(job.postedAt)}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${typeColor}`}>
          {job.employmentType?.replace('_', '-') || 'N/A'}
        </span>
        {salary && (
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
            <DollarSign size={10} /> {salary}
          </span>
        )}
        {matchScore !== null && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${matchColor}`}>
            {matchScore}% Match
          </span>
        )}
      </div>
    </button>
  )
}

export default JobCard
