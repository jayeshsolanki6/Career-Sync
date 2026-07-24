import { Search, MapPin, Filter, ChevronDown, Loader2 } from 'lucide-react'

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

/**
 * Component rendering the job search input form and filter controls.
 */
const JobSearchFilters = ({
  query,
  setQuery,
  location,
  setLocation,
  datePosted,
  setDatePosted,
  jobType,
  setJobType,
  remoteOnly,
  setRemoteOnly,
  showFilters,
  setShowFilters,
  loading,
  inputRef,
  profile,
  onSearch,
}) => {
  const handleSubmit = (e) => {
    setShowFilters(false)
    onSearch(e)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. React Developer, Data Scientist…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#e2e8f0] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0f172a] focus:border-[#0f172a] transition-all text-[#0f172a]"
          />
        </div>
        <div className="relative">
          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="pl-10 pr-4 py-2.5 text-sm border border-[#e2e8f0] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0f172a] focus:border-[#0f172a] transition-all w-40 text-[#0f172a]"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border rounded-lg transition-all cursor-pointer ${
            showFilters ? 'bg-[#f8fafc] border-[#0f172a] text-[#0f172a]' : 'border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]'
          }`}
        >
          <Filter size={14} /> Filters <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Search
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-white border border-[#e2e8f0] rounded-lg">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#64748b]">Date Posted</label>
            <select
              value={datePosted}
              onChange={(e) => setDatePosted(e.target.value)}
              className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f172a] cursor-pointer text-[#0f172a]"
            >
              {DATE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#64748b]">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f172a] cursor-pointer text-[#0f172a]"
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#475569]">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0f172a] cursor-pointer"
              />
              Remote Only
            </label>
          </div>
          {profile?.targetRoles?.length > 0 && (
            <div className="flex flex-col gap-1 ml-auto">
              <label className="text-xs font-medium text-[#64748b]">Your Target Roles</label>
              <div className="flex gap-2 flex-wrap">
                {profile.targetRoles.map((role, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(role)
                      setShowFilters(false)
                      setTimeout(() => onSearch({ preventDefault: () => {} }), 0)
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
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
  )
}

export default JobSearchFilters
