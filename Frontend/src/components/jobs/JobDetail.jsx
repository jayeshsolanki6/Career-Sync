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
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-200">
          <Building2 size={28} className="text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No Job Selected</h3>
        <p className="text-sm text-gray-500 max-w-[240px]">
          Click on any job card to view full details and apply.
        </p>
      </div>
    )
  }

  const salary = formatSalary(job.salary)
  const typeColor = TYPE_COLORS[job.employmentType] || 'bg-gray-50 text-gray-600 border-gray-200'

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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
            {job.companyLogo
              ? <img src={job.companyLogo} alt={job.company} className="w-12 h-12 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
              : <Building2 size={22} className="text-gray-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h2>
            <p className="text-gray-500 font-medium mt-0.5">{job.company}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-400"><MapPin size={13} />{job.location}</span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400"><Calendar size={13} />{timeAgo(job.postedAt)}</span>
              {job.publisher && <span className="flex items-center gap-1.5 text-sm text-gray-400"><Star size={13} />{job.publisher}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor}`}>
            {job.employmentType?.replace('_', '-') || 'N/A'}
          </span>
          {job.isRemote && <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">Remote</span>}
          {salary && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-gray-50 text-gray-600 border-gray-200 flex items-center gap-1">
              <DollarSign size={10} />{salary}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Apply Now <ExternalLink size={14} />
          </a>
          {profile && (
            <button
              onClick={onAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
            >
              {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} />}
              {analyzing ? 'Analyzing…' : 'Analyze My Fit'}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {job.highlights?.qualifications?.length > 0 && (
          <Section title="Qualifications">
            <ul className="space-y-1.5">
              {job.highlights.qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={14} className="text-indigo-500 mt-0.5 shrink-0" /> {q}
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
