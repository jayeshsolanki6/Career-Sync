import { MapPin, Calendar, ExternalLink, Loader2, Star, DollarSign, Building2, CheckCircle2, XCircle } from 'lucide-react'

const TYPE_COLORS = {
  FULLTIME: 'bg-green-50 text-green-700 border-green-200',
  PARTTIME: 'bg-blue-50 text-blue-700 border-blue-200',
  CONTRACTOR: 'bg-amber-50 text-amber-700 border-amber-200',
  INTERN: 'bg-purple-50 text-purple-700 border-purple-200',
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Recently'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return `${Math.floor(days / 7)}w ago`
}

function formatSalary(salary) {
  if (!salary?.min && !salary?.max) return null
  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n
  const period = salary.period ? `/${salary.period.toLowerCase()}` : ''
  if (salary.min && salary.max) return `$${fmt(salary.min)} – $${fmt(salary.max)}${period}`
  if (salary.min) return `$${fmt(salary.min)}+${period}`
  return `Up to $${fmt(salary.max)}${period}`
}

const Section = ({ title, children }) => (
  <div>
    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">{title}</h4>
    {children}
  </div>
)

const JobDetail = ({ job, profile, analyzing, onAnalyze }) => {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-[#f8fafc] rounded-xl border border-dashed border-[#e2e8f0]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-xs border border-[#e2e8f0]">
          <Building2 size={28} className="text-[#0f172a]" />
        </div>
        <h3 className="text-base font-bold text-[#0f172a] font-display mb-1">No Job Selected</h3>
        <p className="text-sm text-[#64748b] max-w-[240px]">
          Click on any job card to view full details and apply.
        </p>
      </div>
    )
  }

  const salary = formatSalary(job.salary)
  const typeColor = TYPE_COLORS[job.employmentType] || 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]'

  const matchingSkills = []
  const missingSkills = []
  if (profile && job.requiredSkills?.length) {
    job.requiredSkills.forEach(skill => {
      if (profile.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        matchingSkills.push(skill)
      } else {
        missingSkills.push(skill)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#e2e8f0] bg-white shrink-0 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
            {job.companyLogo
              ? <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
              : <Building2 size={18} className="text-[#94a3b8]" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[#0f172a] font-display leading-snug">{job.title}</h2>
            <p className="text-xs sm:text-sm text-[#64748b] font-medium">{job.company}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-[#64748b]">
              <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
              <span className="flex items-center gap-1"><Calendar size={12} />{timeAgo(job.postedAt)}</span>
              {job.publisher && <span className="flex items-center gap-1"><Star size={12} />{job.publisher}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f1f5f9]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${typeColor}`}>
              {job.employmentType?.replace('_', '-') || 'N/A'}
            </span>
            {job.isRemote && <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">Remote</span>}
            {salary && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-[#f8fafc] text-[#475569] border-[#e2e8f0] flex items-center gap-1">
                <DollarSign size={10} />{salary}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Apply Now <ExternalLink size={13} />
            </a>
            {profile && (
              <button
                onClick={onAnalyze}
                disabled={analyzing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc] text-xs font-semibold rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
              >
                {analyzing ? <Loader2 size={13} className="animate-spin" /> : <Star size={13} />}
                {analyzing ? 'Analyzing…' : 'Analyze My Fit'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {job.highlights?.qualifications?.length > 0 && (
          <Section title="Qualifications">
            <ul className="space-y-1.5">
              {job.highlights.qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#475569]">
                  <CheckCircle2 size={14} className="text-[#0f172a] mt-0.5 shrink-0" /> {q}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.highlights?.responsibilities?.length > 0 && (
          <Section title="Responsibilities">
            <ul className="space-y-1.5">
              {job.highlights.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /> {r}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {matchingSkills.length > 0 && (
          <Section title="Matching Skills">
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  {skill} <CheckCircle2 size={11} />
                </span>
              ))}
            </div>
          </Section>
        )}

        {missingSkills.length > 0 && (
          <Section title="Missing Skills">
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full border bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                  {skill} <XCircle size={11} />
                </span>
              ))}
            </div>
          </Section>
        )}

        {job.description && (
          <Section title="Job Description">
            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

export default JobDetail
