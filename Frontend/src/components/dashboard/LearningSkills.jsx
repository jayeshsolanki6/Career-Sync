import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, Search, Sparkles, Loader2, Bot, RefreshCw, Trash2, TrendingUp, Award, Target, Circle, CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '../common/Button'
import { learningAPI, analysisAPI } from '../../services/api'
import { levelConfig, CourseCard } from './CourseModal'

const ProgressRing = ({ progress, size = 44, stroke = 3.5, trackClass = 'text-gray-100', fillClass = 'text-primary-500' }) => {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className={trackClass} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className={`${fillClass} transition-all duration-700`}
        transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  )
}

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

  const fetchList = async () => {
    try { const r = await learningAPI.getLearningList(); setLearningList(r.data.data) }
    catch (e) { console.error(e) }
    finally { setLoadingList(false) }
  }

  useEffect(() => { fetchList() }, [])

  useEffect(() => {
    analysisAPI.getHistory().then(r => {
      const h = r.data.data
      if (h?.length) setPrioritySkills(h[0].importantMissingSkillsToLearn || [])
    }).catch(() => {})
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

  const getPriority = (name) => prioritySkills.some(s => s.toLowerCase() === name.toLowerCase()) ? 'HIGH' : null

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

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setAddingSkill(true)
    try { await learningAPI.addSkill({ skillName: searchQuery.trim() }); setSearchQuery(''); await fetchList() }
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
    await learningAPI.removeSkill(id).catch(() => {})
    if (selectedItem?._id === id) setSelectedItem(null)
    fetchList()
  }

  const selRoadmap = selectedItem ? getRoadmapData(selectedItem) : null
  const selProgress = selRoadmap?.progress || 0

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Learning Hub</h1>
        <p className="text-text-secondary text-sm mt-1">Track your skill development with personalized courses and AI study plans.</p>
      </div>

      {loadingList ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary-400 mb-4" />
          <p className="text-text-muted text-sm">Loading your learning list...</p>
        </div>
      ) : (
        <div className="flex gap-6 items-start">
          {/* Left Column */}
          <div className="w-[340px] shrink-0 space-y-3">
            <form onSubmit={handleAdd} className="flex gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Add a skill..." className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
              </div>
              <Button type="submit" size="sm" icon={addingSkill ? Loader2 : Plus} loading={addingSkill} disabled={!searchQuery.trim()}>Add</Button>
            </form>

            {learningList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
                <Sparkles size={36} className="mx-auto mb-3 text-text-muted opacity-40" />
                <h3 className="text-base font-bold text-text-primary mb-1">No skills yet</h3>
                <p className="text-xs text-text-secondary max-w-[200px] mx-auto">Add skills to start building your learning path.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {learningList.map(item => {
                    const rm = getRoadmapData(item)
                    const prog = rm?.progress || 0
                    const isSel = selectedItem?._id === item._id
                    const pri = getPriority(item.skillName)

                    return (
                      <motion.div key={item._id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        onClick={() => { setSelectedItem(item); setActiveTab('courses') }}
                        className={`relative bg-white rounded-xl border p-3.5 cursor-pointer transition-all group hover:shadow-md ${isSel ? 'border-primary-400 shadow-md ring-1 ring-primary-100' : 'border-border hover:border-primary-200'}`}>
                        {isSel && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-primary-500" />}
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <ProgressRing progress={prog} />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text-secondary">{prog}%</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold text-text-primary truncate">{item.skillName}</h3>
                              {pri === 'HIGH' && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-red-100 text-red-600 shrink-0">High Priority</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              {rm ? <span className="text-[10px] text-text-muted">{rm.done}/{rm.total} tasks</span> : <span className="text-[10px] text-text-muted">Not started</span>}
                            </div>
                          </div>
                          <button onClick={e => { e.stopPropagation(); handleDelete(item._id) }}
                            className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 transition-all p-1 cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex-1 min-w-0">
            {!selectedItem ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-border">
                <BookOpen size={40} className="text-text-muted opacity-30 mb-4" />
                <h3 className="text-base font-bold text-text-primary mb-1">Select a skill</h3>
                <p className="text-sm text-text-secondary">Choose a skill from the left to view courses and study plans.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                {/* Header */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                  <div className="relative px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ProgressRing progress={selProgress} size={48} stroke={3.5} trackClass="text-white/20" fillClass="text-white" />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{selProgress}%</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{selectedItem.skillName}</h2>
                        <p className="text-xs text-white/70 mt-0.5">{selRoadmap ? `${selRoadmap.done} of ${selRoadmap.total} tasks completed` : 'No study plan yet'}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-3 border-b border-border">
                  <div className="flex gap-1">
                    {[{ key: 'courses', label: 'Courses', icon: BookOpen }, { key: 'plan', label: 'Study Plan', icon: Bot }].map(t => (
                      <button key={t.key} onClick={() => setActiveTab(t.key)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer border-b-2 ${activeTab === t.key ? 'text-primary-600 border-primary-500' : 'text-text-muted border-transparent hover:text-text-secondary'}`}>
                        <t.icon size={15} />{t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === 'courses' ? (
                      <motion.div key="courses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        {loadingCourses ? (
                          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary-400" /></div>
                        ) : courses ? (
                          <>
                            <div className="flex gap-2 p-1 bg-surface-alt rounded-xl mb-5">
                              {Object.entries(levelConfig).map(([key, cfg]) => {
                                const I = cfg.icon; const a = activeLevel === key
                                return (
                                  <button key={key} onClick={() => setActiveLevel(key)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${a ? `bg-white shadow-sm ${cfg.text} ring-1 ${cfg.ring}` : 'text-text-muted hover:text-text-secondary'}`}>
                                    <I size={13} />{cfg.label}
                                  </button>
                                )
                              })}
                            </div>
                            <div className="space-y-3">
                              {(courses.levels?.[activeLevel] || []).length > 0
                                ? courses.levels[activeLevel].map((c, i) => <CourseCard key={i} course={c} level={activeLevel} />)
                                : <p className="text-center py-8 text-sm text-text-muted">No {activeLevel} courses available.</p>
                              }
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-12">
                            <AlertCircle size={24} className="mx-auto mb-2 text-amber-400" />
                            <p className="text-sm text-text-muted">No courses found for this skill in our dataset.</p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div key="plan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        {selectedItem.roadmap && selRoadmap ? (
                          <div>
                            {/* Progress bar */}
                            <div className="mb-6 p-4 bg-surface-alt rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-text-secondary">Overall Progress</span>
                                <span className="text-xs font-bold text-primary-600">{selRoadmap.done}/{selRoadmap.total} tasks</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${selProgress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                              </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative">
                              {selRoadmap.plan.map((day, di) => {
                                const dayTasks = day.tasks || []
                                const dayDone = dayTasks.filter((_, ti) => taskCompletion[`${di}-${ti}`]).length
                                const allDone = dayTasks.length > 0 && dayDone === dayTasks.length
                                const isLast = di === selRoadmap.plan.length - 1
                                return (
                                  <div key={di} className="flex gap-4 relative">
                                    {/* Timeline line + dot */}
                                    <div className="flex flex-col items-center shrink-0 w-8">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 z-10 ${allDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-primary-300 text-primary-600'}`}>
                                        {allDone ? '✓' : di + 1}
                                      </div>
                                      {!isLast && <div className={`w-0.5 flex-1 ${allDone ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
                                    </div>

                                    {/* Day content */}
                                    <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
                                      <div className={`p-4 rounded-xl border transition-all ${allDone ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-border hover:border-primary-200'}`}>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{day.day}</span>
                                          <span className="text-[10px] font-semibold text-text-muted">{dayDone}/{dayTasks.length} done</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-text-primary mb-0.5">{day.title}</h4>
                                        <p className="text-xs text-text-secondary mb-3">{day.focus}</p>
                                        <div className="space-y-2">
                                          {dayTasks.map((task, ti) => {
                                            const checked = !!taskCompletion[`${di}-${ti}`]
                                            return (
                                              <label key={ti} className="flex items-start gap-2.5 cursor-pointer group">
                                                <input type="checkbox" checked={checked} onChange={() => handleTaskToggle(di, ti)}
                                                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 cursor-pointer" />
                                                <span className={`text-xs leading-relaxed transition-all ${checked ? 'line-through text-text-muted' : 'text-text-secondary group-hover:text-text-primary'}`}>{task}</span>
                                              </label>
                                            )
                                          })}
                                        </div>
                                        {day.resource && (
                                          <div className="mt-3 pt-3 border-t border-dashed border-border">
                                            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">📚 Recommended</p>
                                            <p className="text-xs text-primary-600 font-medium">{day.resource}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Project Idea */}
                            {selRoadmap.projectIdea && (
                              <div className="mt-2 p-5 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100">
                                <h4 className="text-sm font-bold text-primary-700 flex items-center gap-2 mb-2"><Sparkles size={16} /> Portfolio Project Idea</h4>
                                <p className="text-sm text-primary-900 leading-relaxed">{selRoadmap.projectIdea}</p>
                              </div>
                            )}

                            {/* Regenerate */}
                            <div className="mt-6 pt-4 border-t border-border flex justify-end">
                              <Button variant="secondary" onClick={handleGenerate} loading={generatingRoadmap} size="sm" icon={RefreshCw}>Regenerate Plan</Button>
                            </div>
                          </div>
                        ) : generatingRoadmap ? (
                          <div className="py-16 text-center">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                              <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
                              <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin" />
                              <Bot size={24} className="absolute inset-0 m-auto text-primary-500" />
                            </div>
                            <h4 className="text-base font-bold text-text-primary mb-1">Crafting your roadmap...</h4>
                            <p className="text-sm text-text-secondary">Analyzing your skills and building a personalized 7-day plan.</p>
                          </div>
                        ) : (
                          <div className="py-16 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                              <Bot size={28} className="text-primary-400" />
                            </div>
                            <h4 className="text-base font-bold text-text-primary mb-1">No Study Plan Yet</h4>
                            <p className="text-sm text-text-muted mt-1 max-w-sm mb-6">Generate a personalized 7-day learning plan based on your resume analysis and available courses.</p>
                            <Button onClick={handleGenerate} loading={generatingRoadmap} size="md" icon={Sparkles}>Generate Study Plan</Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default LearningSkills
