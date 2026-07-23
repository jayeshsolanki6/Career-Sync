import { create } from 'zustand'
import { learningAPI, analysisAPI } from '../services/api'

const loadTasks = (id) => {
  try {
    return JSON.parse(localStorage.getItem(`cs_tasks_${id}`) || '{}')
  } catch {
    return {}
  }
}

const saveTasks = (id, tasks) => {
  localStorage.setItem(`cs_tasks_${id}`, JSON.stringify(tasks))
}

/**
 * Zustand store managing Learning Hub state, skills queue, courses, study plans, and task progress.
 */
export const useLearningStore = create((set, get) => ({
  learningList: [],
  loadingList: true,
  selectedItem: null,
  courses: null,
  loadingCourses: false,
  activeTab: 'courses',
  activeLevel: 'beginner',
  searchQuery: '',
  addingSkill: false,
  generatingRoadmap: false,
  taskCompletion: {},
  prioritySkills: [],

  setLearningList: (learningList) => set({ learningList }),
  setSelectedItem: (item) => {
    set({ selectedItem: item, activeTab: 'courses' })
    if (item) {
      get().fetchCoursesForSkill(item.skillName)
      set({ taskCompletion: loadTasks(item._id) })
    } else {
      set({ courses: null })
    }
  },
  setActiveTab: (activeTab) => set({ activeTab }),
  setActiveLevel: (activeLevel) => set({ activeLevel }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  fetchList: async () => {
    try {
      const res = await learningAPI.getLearningList()
      set({ learningList: res.data?.data || [] })
    } catch (e) {
      console.error('Failed to fetch learning list', e)
    } finally {
      set({ loadingList: false })
    }
  },

  fetchPrioritySkills: async () => {
    try {
      const res = await analysisAPI.getHistory()
      const history = res.data?.data
      if (history?.length) {
        set({ prioritySkills: history[0].importantMissingSkillsToLearn || [] })
      }
    } catch {
      // silently catch
    }
  },

  fetchCoursesForSkill: async (skillName) => {
    if (!skillName) return
    set({ loadingCourses: true })
    try {
      const res = await learningAPI.getCoursesForSkill(skillName)
      set({ courses: res.data?.data || null })
    } catch {
      set({ courses: null })
    } finally {
      set({ loadingCourses: false })
    }
  },

  handleAddSkill: async (skillName) => {
    if (!skillName) return
    set({ addingSkill: true })
    try {
      await learningAPI.addSkill({ skillName })
      set({ searchQuery: '' })
      await get().fetchList()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to add skill.')
    } finally {
      set({ addingSkill: false })
    }
  },

  handleGenerateRoadmap: async () => {
    const { selectedItem } = get()
    if (!selectedItem) return

    set({ generatingRoadmap: true })
    try {
      const res = await learningAPI.generateRoadmap({ skillName: selectedItem.skillName })
      const updatedItem = res.data.data
      set((state) => ({
        learningList: state.learningList.map((i) => (i._id === selectedItem._id ? updatedItem : i)),
        selectedItem: updatedItem,
      }))
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to generate roadmap.')
    } finally {
      set({ generatingRoadmap: false })
    }
  },

  handleTaskToggle: (di, ti) => {
    const { selectedItem, taskCompletion } = get()
    if (!selectedItem) return
    const key = `${di}-${ti}`
    const updatedTasks = { ...taskCompletion, [key]: !taskCompletion[key] }
    set({ taskCompletion: updatedTasks })
    saveTasks(selectedItem._id, updatedTasks)
  },

  handleDeleteSkill: async (id) => {
    try {
      await learningAPI.removeSkill(id)
      if (get().selectedItem?._id === id) {
        set({ selectedItem: null, courses: null })
      }
      get().fetchList()
    } catch {
      // catch
    }
  },
}))
