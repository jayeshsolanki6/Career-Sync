import { useRef, useEffect } from 'react'
import { Briefcase, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProfileStore } from '../../stores/useProfileStore'
import { useJobStore } from '../../stores/useJobStore'
import JobSearchFilters from '../jobs/JobSearchFilters'
import JobList from '../jobs/JobList'
import JobDetail from '../jobs/JobDetail'
import JobAnalysis from '../jobs/JobAnalysis'

/**
 * JobBoard Dashboard component orchestrating job search, list, detail, and fit analysis views using useJobStore.
 */
const JobBoard = () => {
  const profile = useProfileStore((state) => state.profile)

  const query = useJobStore((state) => state.query)
  const setQuery = useJobStore((state) => state.setQuery)
  const location = useJobStore((state) => state.location)
  const setLocation = useJobStore((state) => state.setLocation)
  const datePosted = useJobStore((state) => state.datePosted)
  const setDatePosted = useJobStore((state) => state.setDatePosted)
  const jobType = useJobStore((state) => state.jobType)
  const setJobType = useJobStore((state) => state.setJobType)
  const remoteOnly = useJobStore((state) => state.remoteOnly)
  const setRemoteOnly = useJobStore((state) => state.setRemoteOnly)
  const page = useJobStore((state) => state.page)
  const showFilters = useJobStore((state) => state.showFilters)
  const setShowFilters = useJobStore((state) => state.setShowFilters)
  const jobs = useJobStore((state) => state.jobs)
  const selectedJob = useJobStore((state) => state.selectedJob)
  const setSelectedJob = useJobStore((state) => state.setSelectedJob)
  const loading = useJobStore((state) => state.loading)
  const analyzing = useJobStore((state) => state.analyzing)
  const error = useJobStore((state) => state.error)
  const hasSearched = useJobStore((state) => state.hasSearched)
  const analysisResult = useJobStore((state) => state.analysisResult)
  const setAnalysisResult = useJobStore((state) => state.setAnalysisResult)
  const handleSearch = useJobStore((state) => state.handleSearch)
  const handlePageChange = useJobStore((state) => state.handlePageChange)
  const handleAnalyzeFit = useJobStore((state) => state.handleAnalyzeFit)

  const inputRef = useRef(null)

  useEffect(() => {
    if (profile?.targetRoles?.[0] && query === 'Software Developer') {
      setQuery(profile.targetRoles[0])
    }
  }, [profile, query, setQuery])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
      style={{ height: 'calc(100vh - 48px)' }}
    >
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-[#0f172a] font-display flex items-center gap-2">
          <Briefcase size={22} className="text-[#0f172a]" />
          Live Job Board
        </h1>
        <p className="text-sm text-[#64748b] mt-0.5">Real-time jobs powered by JSearch</p>
      </div>

      {/* Search Filters */}
      <div className="shrink-0">
        <JobSearchFilters
          query={query}
          setQuery={setQuery}
          location={location}
          setLocation={setLocation}
          datePosted={datePosted}
          setDatePosted={setDatePosted}
          jobType={jobType}
          setJobType={setJobType}
          remoteOnly={remoteOnly}
          setRemoteOnly={setRemoteOnly}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          loading={loading}
          inputRef={inputRef}
          profile={profile}
          onSearch={handleSearch}
        />
      </div>

      {error && (
        <div className="shrink-0 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <X size={14} className="shrink-0" /> {error}
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Briefcase size={40} className="text-gray-300 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">Search for jobs</h3>
          <p className="text-sm text-gray-400">Enter a job title and hit Search to see live results.</p>
        </div>
      )}

      {hasSearched && (
        <div className="flex gap-5 flex-1 min-h-0 overflow-hidden">
          {/* Left: Job List — fixed 380px, independently scrollable */}
          <div className="w-[380px] shrink-0 flex flex-col overflow-hidden">
            <JobList
              jobs={jobs}
              selectedJob={selectedJob}
              onSelect={(j) => {
                setSelectedJob(j)
                setAnalysisResult(null)
              }}
              profile={profile}
              loading={loading}
              page={page}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Right: Detail or Analysis — independently scrollable */}
          <div className="flex-1 min-w-0 overflow-hidden">
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
