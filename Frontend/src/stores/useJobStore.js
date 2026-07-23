import { create } from 'zustand'
import { jobsAPI, uploadAPI } from '../services/api'

/**
 * Zustand store managing Live Job Board search, filters, pagination, and AI fit analysis.
 */
export const useJobStore = create((set, get) => ({
  query: 'Software Developer',
  location: '',
  datePosted: 'all',
  jobType: '',
  remoteOnly: false,
  page: 1,
  showFilters: false,

  jobs: [],
  selectedJob: null,
  loading: false,
  analyzing: false,
  error: null,
  hasSearched: false,
  analysisResult: null,

  setQuery: (query) => set({ query }),
  setLocation: (location) => set({ location }),
  setDatePosted: (datePosted) => set({ datePosted }),
  setJobType: (jobType) => set({ jobType }),
  setRemoteOnly: (remoteOnly) => set({ remoteOnly }),
  setPage: (page) => set({ page }),
  setShowFilters: (showFilters) => set({ showFilters }),
  setSelectedJob: (selectedJob) => set({ selectedJob }),
  setAnalysisResult: (analysisResult) => set({ analysisResult }),

  fetchJobs: async (overridePage) => {
    const { query, location, datePosted, jobType, remoteOnly, page } = get()
    const targetPage = overridePage ?? page

    if (!query.trim()) return

    set({ loading: true, error: null })
    try {
      const { data } = await jobsAPI.search({
        query: query.trim(),
        location: location.trim(),
        datePosted,
        jobType,
        remoteOnly: remoteOnly ? 'true' : 'false',
        page: targetPage,
      })
      set({
        jobs: data.data?.jobs || [],
        selectedJob: null,
        analysisResult: null,
        hasSearched: true,
        loading: false,
      })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch jobs.',
        loading: false,
      })
    }
  },

  handleSearch: (e) => {
    if (e && e.preventDefault) e.preventDefault()
    set({ page: 1 })
    get().fetchJobs(1)
  },

  handlePageChange: (newPage) => {
    set({ page: newPage })
    get().fetchJobs(newPage)
  },

  handleAnalyzeFit: async () => {
    const { selectedJob } = get()
    if (!selectedJob) return

    set({ analyzing: true, error: null })
    try {
      const formData = new FormData()
      formData.append('jdText', selectedJob.description || selectedJob.title)
      const res = await uploadAPI.analyzeResume(formData)
      set({ analysisResult: res.data.data, analyzing: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to analyze fit.',
        analyzing: false,
      })
    }
  },
}))
