import { create } from 'zustand'
import { uploadAPI, analysisAPI } from '../services/api'
import { useProfileStore } from './useProfileStore'


const getScoreVal = (h) => (typeof h?.score === 'object' && h?.score !== null ? h.score.overall || 0 : Number(h?.score) || 0)

const computeAnalytics = (history) => {
  if (!history || !history.length) return null
  const sorted = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const scores = sorted.map(getScoreVal)
  const scoreTimeline = sorted.map((item) => ({
    name: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: getScoreVal(item),
  }))
  const recentAnalyses = [...sorted].reverse().slice(0, 3)

  return {
    scoreTimeline,
    totalAnalyses: history.length,
    avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
    latestScore: scores[scores.length - 1],
    recentAnalyses,
  }
}

/**
 * Combined Zustand store for all Analysis domain features:
 * History, Reports, Dashboard Overview Metrics, and New Analysis Workspace execution.
 */
export const useAnalysisStore = create((set, get) => ({
  // --- History & Overview State ---
  history: [],
  loadingHistory: true,
  historyError: '',
  analytics: null,

  // --- New Analysis Workspace Form State ---
  resumeMode: 'master', // 'master' | 'one-time'
  resumeFile: null,
  isReplacingMaster: false,
  updatingMaster: false,
  masterUpdateSuccess: '',
  jdFile: null,
  jdText: '',
  jdMode: 'file',
  loadingAnalysis: false,
  analysisError: '',

  // --- History & Overview Actions ---
  fetchHistory: async () => {
    set({ loadingHistory: true, historyError: '' })
    try {
      const res = await analysisAPI.getHistory()
      const historyData = res.data?.data || []
      set({
        history: historyData,
        analytics: computeAnalytics(historyData),
        loadingHistory: false,
      })
    } catch (err) {
      set({
        historyError: err.response?.data?.message || 'Failed to load analysis history.',
        loadingHistory: false,
      })
    }
  },

  getAnalysisById: (id) => {
    return get().history.find((item) => item._id === id) || null
  },

  // --- New Analysis Workspace Actions ---
  setResumeMode: (resumeMode) => set({ resumeMode }),
  setResumeFile: (resumeFile) => set({ resumeFile }),
  setIsReplacingMaster: (isReplacingMaster) => set({ isReplacingMaster }),
  setUpdatingMaster: (updatingMaster) => set({ updatingMaster }),
  setMasterUpdateSuccess: (masterUpdateSuccess) => set({ masterUpdateSuccess }),
  setJdFile: (jdFile) => set({ jdFile }),
  setJdText: (jdText) => set({ jdText }),
  setJdMode: (jdMode) => set({ jdMode }),
  setAnalysisError: (analysisError) => set({ analysisError }),

  resetForm: () =>
    set({
      resumeFile: null,
      isReplacingMaster: false,
      updatingMaster: false,
      masterUpdateSuccess: '',
      jdFile: null,
      jdText: '',
      loadingAnalysis: false,
      analysisError: '',
    }),

  handleFileDrop: (e, setter) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (file) setter(file)
  },

  handleUpdateMasterResume: async () => {
    const { resumeFile } = get()
    if (!resumeFile) return

    set({ updatingMaster: true, analysisError: '' })
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      await useProfileStore.getState().uploadProfile(formData)

      set({
        masterUpdateSuccess: '✓ Master Resume updated successfully!',
        resumeFile: null,
        isReplacingMaster: false,
        updatingMaster: false,
      })
      setTimeout(() => set({ masterUpdateSuccess: '' }), 4000)
    } catch (err) {
      set({
        analysisError: err.response?.data?.message || 'Failed to update master resume.',
        updatingMaster: false,
      })
    }
  },

  handleSubmitAnalysis: async (e, navigate) => {
    if (e && e.preventDefault) e.preventDefault()
    set({ analysisError: '' })

    const {
      resumeMode,
      resumeFile,
      isReplacingMaster,
      jdMode,
      jdText,
      jdFile,
    } = get()
    const profile = useProfileStore.getState().profile

    if (resumeMode === 'one-time' && !resumeFile) {
      set({ analysisError: 'Please upload your resume for this one-time analysis.' })
      return
    }
    if (resumeMode === 'master' && !profile && !resumeFile) {
      set({ analysisError: 'Please upload your master resume.' })
      return
    }
    if (resumeMode === 'master' && isReplacingMaster && !resumeFile && !profile) {
      set({ analysisError: 'Please upload a new master resume file.' })
      return
    }
    if (jdMode === 'text' && !jdText.trim()) {
      set({ analysisError: 'Please enter the job description.' })
      return
    }
    if (jdMode === 'file' && !jdFile) {
      set({ analysisError: 'Please upload the job description file.' })
      return
    }

    set({ loadingAnalysis: true })
    try {
      if (resumeMode === 'master' && resumeFile) {
        const profileFormData = new FormData()
        profileFormData.append('resume', resumeFile)
        await useProfileStore.getState().uploadProfile(profileFormData)
      }

      const formData = new FormData()
      if (resumeMode === 'one-time' && resumeFile) {
        formData.append('resume', resumeFile)
      }

      if (jdMode === 'file' && jdFile) {
        formData.append('jd', jdFile)
      } else {
        formData.append('jdText', jdText)
      }

      await uploadAPI.analyzeResume(formData)

      // Refresh history in store to include newly created analysis
      await get().fetchHistory()
      const newAnalysisId = get().history[0]?._id

      // Reset form state so old JD text and files do not linger
      get().resetForm()

      if (navigate && newAnalysisId) {
        navigate(`/analysis/${newAnalysisId}`)
      }
    } catch (err) {
      set({
        analysisError: err.response?.data?.message || 'Analysis failed. Please try again.',
        loadingAnalysis: false,
      })
    }
  },
}))
