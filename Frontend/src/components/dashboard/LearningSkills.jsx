import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Bot } from 'lucide-react'
import { useLearningStore } from '../../stores/useLearningStore'
import SkillSidebar from '../learning/SkillSidebar'
import CourseList from '../learning/CourseList'
import StudyPlanView from '../learning/StudyPlanView'

/**
 * LearningSkills component connected directly to useLearningStore Zustand store.
 */
const LearningSkills = () => {
  const learningList = useLearningStore((state) => state.learningList)
  const loadingList = useLearningStore((state) => state.loadingList)
  const selectedItem = useLearningStore((state) => state.selectedItem)
  const courses = useLearningStore((state) => state.courses)
  const loadingCourses = useLearningStore((state) => state.loadingCourses)
  const activeTab = useLearningStore((state) => state.activeTab)
  const activeLevel = useLearningStore((state) => state.activeLevel)
  const searchQuery = useLearningStore((state) => state.searchQuery)
  const addingSkill = useLearningStore((state) => state.addingSkill)
  const generatingRoadmap = useLearningStore((state) => state.generatingRoadmap)
  const taskCompletion = useLearningStore((state) => state.taskCompletion)
  const prioritySkills = useLearningStore((state) => state.prioritySkills)

  const setSelectedItem = useLearningStore((state) => state.setSelectedItem)
  const setActiveTab = useLearningStore((state) => state.setActiveTab)
  const setActiveLevel = useLearningStore((state) => state.setActiveLevel)
  const setSearchQuery = useLearningStore((state) => state.setSearchQuery)
  const handleAddSkill = useLearningStore((state) => state.handleAddSkill)
  const handleGenerateRoadmap = useLearningStore((state) => state.handleGenerateRoadmap)
  const handleTaskToggle = useLearningStore((state) => state.handleTaskToggle)
  const handleDeleteSkill = useLearningStore((state) => state.handleDeleteSkill)
  const fetchList = useLearningStore((state) => state.fetchList)
  const fetchPrioritySkills = useLearningStore((state) => state.fetchPrioritySkills)

  const inputRef = useRef(null)

  useEffect(() => {
    fetchList()
    fetchPrioritySkills()
  }, [fetchList, fetchPrioritySkills])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const skillParam = params.get('skill')
    if (skillParam) {
      setSearchQuery(skillParam)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [setSearchQuery])

  const getRoadmapData = useCallback(
    (item) => {
      if (!item?.roadmap) return null
      try {
        const parsed = JSON.parse(item.roadmap)
        if (!parsed.plan) return null
        let total = 0
        let done = 0
        parsed.plan.forEach((d, di) =>
          d.tasks?.forEach((_, ti) => {
            total++
            if (taskCompletion[`${di}-${ti}`]) done++
          })
        )
        return {
          ...parsed,
          total,
          done,
          progress: total > 0 ? Math.round((done / total) * 100) : 0,
        }
      } catch {
        return null
      }
    },
    [taskCompletion]
  )

  const selRoadmap = selectedItem ? getRoadmapData(selectedItem) : null
  const selProgress = selRoadmap?.progress || 0

  if (loadingList) {
    return (
      <div className="flex gap-6">
        <div className="w-80 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="flex-1 h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a] font-display">Learning Hub</h1>
        <p className="text-[#64748b] text-sm mt-1">Track your skill development with personalized courses and AI study plans.</p>
      </div>

      <div className="flex gap-6 items-start">
        <SkillSidebar
          skills={learningList}
          selectedItem={selectedItem}
          onSelect={(item) => setSelectedItem(item)}
          onDelete={handleDeleteSkill}
          prioritySkills={prioritySkills}
          onAdd={handleAddSkill}
          addingSkill={addingSkill}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inputRef={inputRef}
        />

        <div className="flex-1 min-w-0">
          {!selectedItem ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-[#e2e8f0] text-center">
              <BookOpen size={40} className="text-[#94a3b8] mb-4" />
              <h3 className="text-base font-bold text-[#0f172a] font-display mb-1">Select a skill</h3>
              <p className="text-sm text-[#64748b]">Choose a skill from the left to view courses and study plans.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
              {/* Skill header */}
              <div className="px-6 py-5 border-b border-[#e2e8f0] bg-white">
                <h2 className="text-2xl font-bold text-[#0f172a] font-display mb-3">{selectedItem.skillName}</h2>
                <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-[#0f172a] rounded-full transition-all duration-700"
                    style={{ width: `${selProgress}%` }}
                  />
                </div>
                {selRoadmap ? (
                  <p className="text-sm text-[#64748b]">
                    {selRoadmap.done} of {selRoadmap.total} tasks completed
                  </p>
                ) : (
                  <p className="text-sm text-[#64748b]">No tasks planned yet</p>
                )}
              </div>

              {/* Tabs */}
              <div className="px-6 pt-3 border-b border-[#e2e8f0]">
                <div className="flex gap-1">
                  {[
                    { key: 'courses', label: 'Courses', icon: BookOpen },
                    { key: 'plan', label: 'Study Plan', icon: Bot },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer border-b-2 ${
                        activeTab === t.key
                          ? 'text-[#0f172a] border-[#0f172a]'
                          : 'text-[#64748b] border-transparent hover:text-[#0f172a]'
                      }`}
                    >
                      <t.icon size={15} /> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'courses' ? (
                  <CourseList
                    courses={courses}
                    loading={loadingCourses}
                    activeLevel={activeLevel}
                    setActiveLevel={setActiveLevel}
                  />
                ) : (
                  <StudyPlanView
                    roadmapData={selRoadmap}
                    taskCompletion={taskCompletion}
                    progress={selProgress}
                    onTaskToggle={handleTaskToggle}
                    onGenerate={handleGenerateRoadmap}
                    generating={generatingRoadmap}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default LearningSkills
