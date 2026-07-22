import { useState, useCallback, useRef } from 'react'
import { Search, MapPin, Filter, ChevronDown, Loader2, Wifi, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { jobsAPI, uploadAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import JobList from '../jobs/JobList'
import JobDetail from '../jobs/JobDetail'
import JobAnalysis from '../jobs/JobAnalysis'

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

const JobBoard = () => {
  const { user } = useAuth()
  const { profile } = useProfile()
  const defaultQuery = user?.targetRoles?.[0] || 'Software Developer'

  const [query, setQuery] = useState(defaultQuery)
  const [location, setLocation] = useState('')
  const [datePosted, setDatePosted] = useState('all')
  const [jobType, setJobType] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

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
      setAnalysisResult(null)
      setHasSearched(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs.')
    } finally {
      setLoading(false)
    }
  }, [query, location, datePosted, jobType, remoteOnly, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchJobs(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchJobs(newPage)
  }

  const handleAnalyzeFit = async () => {
    if (!selectedJob) return
    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('jdText', selectedJob.description || selectedJob.title)
      const res = await uploadAPI.analyzeResume(formData)
      setAnalysisResult(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze fit.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full gap-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wifi size={22} className="text-indigo-600" />
          Live Job Board
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Real-time jobs powered by JSearch</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. React Developer, Data Scientist…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all w-40"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border rounded-xl transition-all cursor-pointer ${
              showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={14} /> Filters <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Date Posted</label>
              <select
                value={datePosted}
                onChange={(e) => setDatePosted(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                {DATE_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                Remote Only
              </label>
            </div>
            {user?.targetRoles?.length > 0 && (
              <div className="flex flex-col gap-1 ml-auto">
                <label className="text-xs font-medium text-gray-400">Your Target Roles</label>
                <div className="flex gap-2 flex-wrap">
                  {user.targetRoles.map((role, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setQuery(role); setTimeout(() => handleSearch({ preventDefault: () => {} }), 0) }}
                      className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <X size={14} className="shrink-0" /> {error}
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Wifi size={40} className="text-gray-200 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">Search for jobs</h3>
          <p className="text-sm text-gray-400">Enter a job title and hit Search to see live results.</p>
        </div>
      )}

      {hasSearched && (
        <div className="flex gap-5 flex-1 min-h-0">
          {/* Left: Job List — fixed 380px */}
          <div className="w-[380px] shrink-0 flex flex-col overflow-hidden">
            <JobList
              jobs={jobs}
              selectedJob={selectedJob}
              onSelect={(j) => { setSelectedJob(j); setAnalysisResult(null) }}
              profile={profile}
              loading={loading}
              page={page}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Right: Detail or Analysis */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {analysisResult ? (
              <JobAnalysis result={analysisResult} onBack={() => setAnalysisResult(null)} />
            ) : (
              <JobDetail
                job={selectedJob}
                profile={profile}
                analyzing={analyzing}
                onAnalyze={handleAnalyzeFit}
              />
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default JobBoard
