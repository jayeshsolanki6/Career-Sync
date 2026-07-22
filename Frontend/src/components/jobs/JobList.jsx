import { Briefcase } from 'lucide-react'
import JobCard from './JobCard'

const JobList = ({ jobs, selectedJob, onSelect, profile, loading, page, onPageChange }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Briefcase size={36} className="text-gray-300 mb-3" />
        <p className="font-medium text-gray-700">No jobs found</p>
        <p className="text-sm text-gray-400 mt-1">Try a different query or filters</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            profile={profile}
            isSelected={selectedJob?.id === job.id}
            onClick={onSelect}
          />
        ))}
      </div>

      {/* Pagination */}
      {jobs.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-2 pb-1 shrink-0">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500 font-medium">Page {page}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={jobs.length < 10}
            className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default JobList
