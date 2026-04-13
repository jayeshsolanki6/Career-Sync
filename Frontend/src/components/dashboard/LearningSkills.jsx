import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, Search, GraduationCap, Sparkles, Loader2, Bot, ExternalLink, RefreshCw, X, Trash2 } from 'lucide-react'
import Button from '../common/Button'
import { learningAPI } from '../../services/api'
import ReactMarkdown from 'react-markdown'

const LearningSkills = () => {
  const [learningList, setLearningList] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  
  // Selected item opens the modal view
  const [selectedItem, setSelectedItem] = useState(null)
  const [courses, setCourses] = useState(null)
  
  // Roadmap states
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false)
  
  // Search / Add new skill state
  const [searchQuery, setSearchQuery] = useState('')
  const [addingSkill, setAddingSkill] = useState(false)

  const fetchLearningList = async () => {
    try {
      const res = await learningAPI.getLearningList()
      setLearningList(res.data.data)
    } catch (err) {
      console.error('Failed to fetch learning list:', err)
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    fetchLearningList()
  }, [])

  // When an item is selected, fetch its course content
  useEffect(() => {
    if (!selectedItem) {
      setCourses(null)
      return
    }
    
    let isMounted = true
    const fetchContent = async () => {
      try {
        const res = await learningAPI.getCoursesForSkill(selectedItem.skillName)
        if (isMounted) setCourses(res.data.data)
      } catch (err) {
        if (isMounted) setCourses(null)
      }
    }
    fetchContent()
    return () => { isMounted = false }
  }, [selectedItem])

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setAddingSkill(true)
    try {
      await learningAPI.addSkill({ skillName: searchQuery.trim() })
      setSearchQuery('')
      await fetchLearningList()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add skill')
    } finally {
      setAddingSkill(false)
    }
  }

  const handleGenerateRoadmap = async () => {
    if (!selectedItem) return
    setGeneratingRoadmap(true)

    try {
      // Extract course URLs from the current courses state
      const links = []
      if (courses?.levels) {
        Object.values(courses.levels).forEach(level => {
          if (Array.isArray(level)) {
            level.forEach(c => {
              if (c.url) links.push(c.url)
            })
          }
        })
      }

      const res = await learningAPI.generateRoadmap({
        skillName: selectedItem.skillName,
        links: links
      })
      // Update local state learningList
      setLearningList(prev => prev.map(item => item._id === selectedItem._id ? res.data.data : item))
      setSelectedItem(res.data.data)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to generate roadmap')
    } finally {
      setGeneratingRoadmap(false)
    }
  }

  const closeModal = () => setSelectedItem(null)

  // Helper to parse roadmap JSON
  const renderRoadmap = (roadmapStr) => {
    try {
      const parsed = JSON.parse(roadmapStr);
      if (parsed.plan && Array.isArray(parsed.plan)) {
        return (
          <div className="space-y-6">
            {parsed.projectIdea && (
              <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-primary-700 mb-1 flex items-center gap-2"><Sparkles size={16}/> Project Idea</h4>
                <p className="text-sm text-primary-900 leading-relaxed">{parsed.projectIdea}</p>
              </div>
            )}
            <div className="space-y-4">
              {parsed.plan.map((day, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-24 shrink-0">
                    <span className="inline-block bg-surface-alt px-2.5 py-1 rounded-lg text-xs font-bold text-text-secondary uppercase tracking-widest">{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-text-primary mb-1">{day.title}</h4>
                    <p className="text-sm text-text-muted mb-3">{day.focus}</p>
                    <ul className="space-y-1.5 mb-3">
                      {day.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    } catch(e) {
      // Fallback for older non-JSON data
      return (
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-3 text-text-primary" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-5 mb-2 text-text-primary" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-base font-bold mt-4 mb-2 text-text-primary" {...props} />,
            p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-sm" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1 text-sm marker:text-primary-400" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-sm marker:font-medium marker:text-primary-500" {...props} />,
            li: ({node, ...props}) => <li className="pl-1" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-text-primary" {...props} />,
          }}
        >
          {roadmapStr}
        </ReactMarkdown>
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Your Learning List</h1>
          <p className="text-text-secondary text-sm mt-1">Track your skills, access courses, and generate AI-powered study plans.</p>
        </div>
        
        {/* Quick Add Skill */}
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <div className="relative w-64 sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search & add a skill to your list..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all shadow-sm"
            />
          </div>
          <Button type="submit" size="md" icon={addingSkill ? Loader2 : Plus} loading={addingSkill} disabled={!searchQuery.trim()}>
            Add Skill
          </Button>
        </form>
      </div>

      {/* Grid of Added Skills */}
      {loadingList ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary-400 mb-4" />
          <p className="text-text-muted text-sm font-medium">Loading your list...</p>
        </div>
      ) : learningList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-border border-dashed">
          <Sparkles size={40} className="mx-auto mb-4 text-text-muted opacity-40" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No skills added yet</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Use the search bar above to add skills you want to learn, or save them directly from your resume analysis results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {learningList.map(item => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedItem(item)}
                className="bg-white p-5 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-text-primary truncate">{item.skillName}</h3>
                    <p className="text-xs text-text-muted">Added {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-dashed border-border group-hover:border-primary-200">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-surface-alt text-text-secondary rounded-lg">
                    {item.roadmap ? 'Plan Generated' : 'Pending Plan'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); learningAPI.removeSkill(item._id).then(fetchLearningList) }}
                      className="text-text-muted hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="Remove from List"
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className="text-primary-600 text-xs font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Open <ExternalLink size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}


      {/* Modal View for Course Content & Roadmap */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative px-6 py-5 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedItem.skillName} Learning Hub</h2>
                    <p className="text-xs text-white/80 font-medium tracking-wide border border-white/20 px-2 py-0.5 rounded-full inline-block mt-1 bg-black/10">
                      Curated Courses & AI Roadmap
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50/50">
                {/* Courses Lists */}
                {courses ? (
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {/* Beginner Track */}
                    {courses.levels?.beginner?.length > 0 && (
                      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
                          <BookOpen size={16} className="text-emerald-500" /> Beginner Track
                        </h3>
                        <div className="space-y-3">
                          {courses.levels.beginner.slice(0, 6).map((c, i) => (
                            <a key={i} href={c.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-300 transition-all group">
                              <ExternalLink size={14} className="text-emerald-400 mt-0.5 group-hover:text-emerald-600 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-text-primary group-hover:text-emerald-700 leading-tight">{c.title}</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 mt-1.5">{c.platform}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Intermediate Track */}
                    {courses.levels?.intermediate?.length > 0 && (
                      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
                          <GraduationCap size={16} className="text-blue-500" /> Intermediate Track
                        </h3>
                        <div className="space-y-3">
                          {courses.levels.intermediate.slice(0, 6).map((c, i) => (
                            <a key={i} href={c.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                              <ExternalLink size={14} className="text-blue-400 mt-0.5 group-hover:text-blue-600 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-text-primary group-hover:text-blue-700 leading-tight">{c.title}</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mt-1.5">{c.platform}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Advanced Track */}
                    {courses.levels?.advanced?.length > 0 && (
                      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
                          <Bot size={16} className="text-purple-500" /> Advanced Track
                        </h3>
                        <div className="space-y-3">
                          {courses.levels.advanced.slice(0, 6).map((c, i) => (
                            <a key={i} href={c.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50/30 hover:bg-purple-50 hover:border-purple-300 transition-all group">
                              <ExternalLink size={14} className="text-purple-400 mt-0.5 group-hover:text-purple-600 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-text-primary group-hover:text-purple-700 leading-tight">{c.title}</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-purple-600 mt-1.5">{c.platform}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-border mb-8">
                    <Loader2 size={24} className="animate-spin text-primary-400" />
                  </div>
                )}

                {/* AI Roadmap Section */}
                <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-border bg-gradient-to-r from-surface-alt to-white flex sm:items-center flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2 text-text-primary">
                        <Bot size={20} className="text-primary-500" /> 
                        AI Generated Study Plan
                      </h3>
                      <p className="text-xs text-text-secondary mt-1 max-w-sm">A personalized 7-day, day-by-day project-based learning plan utilizing the courses available.</p>
                    </div>
                    {!selectedItem.roadmap && (
                      <Button onClick={handleGenerateRoadmap} loading={generatingRoadmap} size="md" icon={Sparkles}>
                        Generate Plan
                      </Button>
                    )}
                  </div>

                  <div className="p-6">
                    {selectedItem.roadmap ? (
                      <div>
                        <div className="text-text-secondary w-full text-left">
                          {renderRoadmap(selectedItem.roadmap)}
                        </div>
                        <div className="mt-8 pt-4 border-t border-border flex justify-end">
                          <Button variant="secondary" onClick={handleGenerateRoadmap} loading={generatingRoadmap} size="sm" icon={RefreshCw}>
                            Regenerate Output
                          </Button>
                        </div>
                      </div>
                    ) : generatingRoadmap ? (
                      <div className="py-16 text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <div className="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                          <Bot size={24} className="absolute inset-0 m-auto text-primary-500" />
                        </div>
                        <h4 className="text-base font-bold text-text-primary mb-1">Crafting your roadmap...</h4>
                        <p className="text-sm text-text-secondary">Structuring days, assigning projects, and reviewing content.</p>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center text-center">
                        <Sparkles size={32} className="text-primary-200 mb-3" />
                        <h4 className="text-sm font-semibold text-text-primary">No Plan Generated</h4>
                        <p className="text-sm text-text-muted mt-1 max-w-xs">Click the button above to have AI organize your learning path.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default LearningSkills
