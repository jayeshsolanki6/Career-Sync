import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Bot } from 'lucide-react'
import { learningAPI, analysisAPI } from '../../services/api'
import SkillSidebar from '../learning/SkillSidebar'
import CourseList from '../learning/CourseList'
import StudyPlanView from '../learning/StudyPlanView'

const loadTasks = (id) => { try { return JSON.parse(localStorage.getItem(`cs_tasks_${id}`) || '{}') } catch { return {} } }
const saveTasks = (id, t) => localStorage.setItem(`cs_tasks_${id}`, JSON.stringify(t))

const LearningSkills = () => {
  const [learningList, setLearningList] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [courses, setCourses] = useState(null)
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [activeTab, setActiveTab] = useState('courses')
  const [activeLevel, setActiveLevel] = useState('beginner')
  const [searchQuery, setSearchQuery] = useState('')
  const [addingSkill, setAddingSkill] = useState(false)
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false)
  const [taskCompletion, setTaskCompletion] = useState({})
  const [prioritySkills, setPrioritySkills] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const skillParam = params.get('skill')
    if (skillParam) {
      setSearchQuery(skillParam)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [])

  const fetchList = async () => {
    try { const r = await learningAPI.getLearningList(); setLearningList(r.data.data) }
    catch { }
    finally { setLoadingList(false) }
  }

  useEffect(() => { fetchList() }, [])

  useEffect(() => {
    analysisAPI.getHistory().then(r => {
      const h = r.data.data
      if (h?.length) setPrioritySkills(h[0].importantMissingSkillsToLearn || [])
    }).catch(() => { })
  }, [])

  useEffect(() => {
    if (!selectedItem) { setCourses(null); return }
    let m = true
    setLoadingCourses(true)
    learningAPI.getCoursesForSkill(selectedItem.skillName)
      .then(r => m && setCourses(r.data.data))
      .catch(() => m && setCourses(null))
      .finally(() => m && setLoadingCourses(false))
    setTaskCompletion(loadTasks(selectedItem._id))
    return () => { m = false }
  }, [selectedItem])

  const getRoadmapData = useCallback((item) => {
    if (!item?.roadmap) return null
    try {
      const p = JSON.parse(item.roadmap)
      if (!p.plan) return null
      const t = loadTasks(item._id)
      let total = 0, done = 0
      p.plan.forEach((d, di) => d.tasks?.forEach((_, ti) => { total++; if (t[`${di}-${ti}`]) done++ }))
      return { ...p, total, done, progress: total > 0 ? Math.round((done / total) * 100) : 0 }
    } catch { return null }
  }, [])

  const handleAdd = async (skillName) => {
    setAddingSkill(true)
    try { await learningAPI.addSkill({ skillName }); setSearchQuery(''); await fetchList() }
    catch (e) { alert(e.response?.data?.message || 'Failed') }
    finally { setAddingSkill(false) }
  }

  const handleGenerate = async () => {
    if (!selectedItem) return
    setGeneratingRoadmap(true)
    try {
      const r = await learningAPI.generateRoadmap({ skillName: selectedItem.skillName })
      setLearningList(prev => prev.map(i => i._id === selectedItem._id ? r.data.data : i))
      setSelectedItem(r.data.data)
    } catch (e) { alert(e.response?.data?.message || 'Failed') }
    finally { setGeneratingRoadmap(false) }
  }

  const handleTaskToggle = (di, ti) => {
    const k = `${di}-${ti}`
    const u = { ...taskCompletion, [k]: !taskCompletion[k] }
    setTaskCompletion(u)
    saveTasks(selectedItem._id, u)
  }

  const handleDelete = async (id) => {
    await learningAPI.removeSkill(id).catch(() => { })
    if (selectedItem?._id === id) setSelectedItem(null)
    fetchList()
  }

  const selRoadmap = selectedItem ? getRoadmapData(selectedItem) : null
  const selProgress = selRoadmap?.progress || 0

  if (loadingList) {
    return (
      <div className="flex gap-6">
        <div className="w-80 space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="flex-1 h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Hub</h1>
        <p className="text-gray-500 text-sm mt-1">Track your skill development with personalized courses and AI study plans.</p>
      </div>

      <div className="flex gap-6 items-start">
        <SkillSidebar
          skills={learningList}
          selectedItem={selectedItem}
          onSelect={(item) => { setSelectedItem(item); setActiveTab('courses') }}
          onDelete={handleDelete}
          prioritySkills={prioritySkills}
          onAdd={handleAdd}
          addingSkill={addingSkill}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inputRef={inputRef}
        />

        <div className="flex-1 min-w-0">
          {!selectedItem ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-gray-200 text-center">
              <BookOpen size={40} className="text-gray-300 mb-4" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">Select a skill</h3>
              <p className="text-sm text-gray-500">Choose a skill from the left to view courses and study plans.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Skill header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-white">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{selectedItem.skillName}</h2>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${selProgress}%` }}
                  />
                </div>
                {selRoadmap ? (
                  <p className="text-sm text-gray-500">{selRoadmap.done} of {selRoadmap.total} tasks completed</p>
                ) : (
                  <p className="text-sm text-gray-500">No tasks planned yet</p>
                )}
              </div>

              {/* Tabs */}
              <div className="px-6 pt-3 border-b border-gray-200">
                <div className="flex gap-1">
                  {[{ key: 'courses', label: 'Courses', icon: BookOpen }, { key: 'plan', label: 'Study Plan', icon: Bot }].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer border-b-2 ${
                        activeTab === t.key
                          ? 'text-indigo-600 border-indigo-500'
                          : 'text-gray-400 border-transparent hover:text-gray-600'
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
                    onGenerate={handleGenerate}
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
