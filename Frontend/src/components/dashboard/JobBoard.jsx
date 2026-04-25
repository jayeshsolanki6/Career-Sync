import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search, MapPin, Briefcase, Clock, ExternalLink, Loader2,
  Wifi, Filter, ChevronDown, Building2, DollarSign, Star,
  RefreshCw, X, CheckCircle2, Calendar
} from 'lucide-react'
import { jobsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const DATE_FILTERS = [
  { value: 'all', label: 'Any Time' },
  { value: 'today', label: 'Today' },
  { value: '3days', label: 'Last 3 Days' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
]

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'fulltime', label: 'Full-time' },
  { value: 'parttime', label: 'Part-time' },
  { value: 'contractor', label: 'Contract' },
  { value: 'intern', label: 'Internship' },
]

const TYPE_COLORS = {
  FULLTIME: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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

// ─── Job Card ───────────────────────────────────────────────────────────────
const JobCard = ({ job, isSelected, onClick }) => {
  const salary = formatSalary(job.salary)
  const typeColor = TYPE_COLORS[job.employmentType] || 'bg-gray-50 text-gray-600 border-gray-200'

  return (
    <button
      onClick={() => onClick(job)}
      className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 group cursor-pointer ${
        isSelected
          ? 'border-primary-400 bg-primary-50 shadow-md shadow-primary-100'
          : 'border-border bg-white hover:border-primary-300 hover:shadow-md hover:shadow-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl border border-border bg-surface-alt flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.company} className="w-9 h-9 object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
          ) : null}
          <Building2 size={18} className="text-text-muted" style={{ display: job.companyLogo ? 'none' : 'block' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm leading-tight truncate group-hover:text-primary-700 transition-colors">
            {job.title}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5 truncate">{job.company}</p>
        </div>
        {job.isRemote && (
          <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
            Remote
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <MapPin size={11} /> {job.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Clock size={11} /> {timeAgo(job.postedAt)}
        </span>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${typeColor}`}>
          {job.employmentType?.replace('_', '-') || 'N/A'}
        </span>
        {salary && (
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
            <DollarSign size={10} /> {salary}
          </span>
        )}
      </div>
    </button>
  )
}

// ─── Detail Panel ────────────────────────────────────────────────────────────
const JobDetail = ({ job, onClose }) => {
  if (!job) return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-text-muted bg-surface-alt rounded-2xl border border-border">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
        <Briefcase size={28} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-1">No Job Selected</h3>
      <p className="text-sm text-text-secondary max-w-[250px]">Click on any job card from the list to view its full details and apply.</p>
    </div>
  )

  const salary = formatSalary(job.salary)
  const typeColor = TYPE_COLORS[job.employmentType] || 'bg-gray-50 text-gray-600 border-gray-200'

  return (
    <div className="flex-1 bg-white rounded-2xl border border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl border border-border bg-surface-alt flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.companyLogo
              ? <img src={job.companyLogo} alt={job.company} className="w-12 h-12 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
              : <Building2 size={22} className="text-text-muted" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-text-primary leading-tight">{job.title}</h2>
            <p className="text-text-secondary font-medium mt-0.5">{job.company}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-text-muted"><MapPin size={13} />{job.location}</span>
              <span className="flex items-center gap-1.5 text-sm text-text-muted"><Calendar size={13} />{timeAgo(job.postedAt)}</span>
              {job.publisher && <span className="flex items-center gap-1.5 text-sm text-text-muted"><Star size={13} />{job.publisher}</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor}`}>
            {job.employmentType?.replace('_', '-') || 'N/A'}
          </span>
          {job.isRemote && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">Remote</span>
          )}
          {salary && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200 flex items-center gap-1">
              <DollarSign size={11} />{salary}
            </span>
          )}
        </div>

        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Apply Now <ExternalLink size={14} />
        </a>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Highlights */}
        {job.highlights?.qualifications?.length > 0 && (
          <Section title="Qualifications">
            <ul className="space-y-1.5">
              {job.highlights.qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 size={14} className="text-primary-500 mt-0.5 flex-shrink-0" /> {q}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.highlights?.responsibilities?.length > 0 && (
          <Section title="Responsibilities">
            <ul className="space-y-1.5">
              {job.highlights.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 size={14} className="text-accent-500 mt-0.5 flex-shrink-0" /> {r}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.highlights?.benefits?.length > 0 && (
          <Section title="Benefits">
            <ul className="space-y-1.5">
              {job.highlights.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Required Skills */}
        {job.requiredSkills?.length > 0 && (
          <Section title="Required Skills">
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Description */}
        {job.description && (
          <Section title="Job Description">
            <div className="text-sm text-text-secondary whitespace-pre-line leading-relaxed pb-8">
              {job.description}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

const Section = ({ title, children }) => (
  <div>
    <h4 className="text-sm font-semibold text-text-primary mb-2">{title}</h4>
    {children}
  </div>
)

// ─── Main Component ──────────────────────────────────────────────────────────
const JobBoard = () => {
  const { user } = useAuth()
  const defaultQuery = user?.targetRoles?.[0] || 'Software Developer'

  const [query, setQuery] = useState(defaultQuery)
  const [location, setLocation] = useState('')
  const [datePosted, setDatePosted] = useState('all')
  const [jobType, setJobType] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [page, setPage] = useState(1)

  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const inputRef = useRef(null)

  const fetchJobs = useCallback(async (overridePage = page) => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await jobsAPI.search({
        query: query.trim(),
        location: location.trim(),
        datePosted,
        jobType,
        remoteOnly: remoteOnly ? 'true' : 'false',
        page: overridePage,
      })
      setJobs(data.data?.jobs || [])
      setSelectedJob(null)
      setHasSearched(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs. Check your API key.')
    } finally {
      setLoading(false)
    }
  }, [query, location, datePosted, jobType, remoteOnly, page])

  // Removed auto-search on mount

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchJobs(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchJobs(newPage)
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Wifi size={22} className="text-primary-600" />
            Live Job Board
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Real-time jobs powered by JSearch</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. React Developer, Data Scientist..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (optional)"
              className="pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all w-48"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border rounded-xl transition-all cursor-pointer ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
          >
            <Filter size={14} /> Filters <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
        </div>

        {/* Filters Row */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-white border border-border rounded-xl">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">Date Posted</label>
              <select
                value={datePosted}
                onChange={(e) => setDatePosted(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
              >
                {DATE_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
              >
                {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary-600 cursor-pointer"
                />
                Remote Only
              </label>
            </div>
            {/* Quick role chips based on user's target roles */}
            {user?.targetRoles?.length > 0 && (
              <div className="flex flex-col gap-1 ml-auto">
                <label className="text-xs font-medium text-text-muted">Your Target Roles</label>
                <div className="flex gap-2 flex-wrap">
                  {user.targetRoles.map((role, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setQuery(role); setTimeout(() => handleSearch({ preventDefault: () => {} }), 0) }}
                      className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 transition-colors cursor-pointer"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Content Area */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <X size={14} className="flex-shrink-0" /> {error}
        </div>
      )}

      {loading && !hasSearched && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-text-muted">
            <Loader2 size={32} className="animate-spin text-primary-500" />
            <p className="text-sm font-medium">Fetching live jobs…</p>
          </div>
        </div>
      )}

      {hasSearched && (
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Left — Job List */}
          <div className="w-96 flex-shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-primary-500" />
              </div>
            )}
            {!loading && jobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center text-text-muted">
                <Briefcase size={36} className="mb-3 opacity-30" />
                <p className="font-medium text-text-secondary">No jobs found</p>
                <p className="text-sm mt-1">Try a different query or filters</p>
              </div>
            )}
            {!loading && jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onClick={setSelectedJob}
              />
            ))}

            {/* Pagination */}
            {!loading && jobs.length > 0 && (
              <div className="flex items-center justify-center gap-3 pt-2 pb-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>
                <span className="text-sm text-text-muted font-medium">Page {page}</span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={jobs.length < 10}
                  className="px-4 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right — Detail Panel */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default JobBoard
