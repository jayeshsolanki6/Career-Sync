import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Clock, Monitor, Loader2, BookOpen, GraduationCap, Zap, AlertCircle } from 'lucide-react'
import { learningAPI } from '../../services/api'

const levelConfig = {
  beginner: {
    label: 'Beginner',
    icon: BookOpen,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-200',
  },
  intermediate: {
    label: 'Intermediate',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    ring: 'ring-blue-200',
  },
  advanced: {
    label: 'Advanced',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    ring: 'ring-purple-200',
  },
}

const platformColors = {
  'freeCodeCamp (YouTube)': 'bg-gray-900 text-white',
  'freeCodeCamp': 'bg-gray-900 text-white',
  'Harvard OpenCourseWare': 'bg-red-700 text-white',
  'Coursera (Audit)': 'bg-blue-600 text-white',
  'edX (Audit)': 'bg-red-600 text-white',
  'MIT OpenCourseWare': 'bg-red-800 text-white',
  'Khan Academy': 'bg-green-600 text-white',
  'Google Digital Garage': 'bg-blue-500 text-white',
  'Microsoft Learn': 'bg-blue-700 text-white',
  'AWS Training': 'bg-orange-500 text-white',
  'Scrimba': 'bg-purple-600 text-white',
  'Hugging Face': 'bg-yellow-500 text-gray-900',
  'DeepLearning.AI': 'bg-indigo-600 text-white',
  'Stanford Online': 'bg-red-700 text-white',
  'DataCamp (Free)': 'bg-green-700 text-white',
  'Kaggle Learn (Free)': 'bg-cyan-600 text-white',
}

const getPlatformColor = (platform) => {
  for (const [key, value] of Object.entries(platformColors)) {
    if (platform.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  return 'bg-gray-100 text-gray-700'
}

const CourseModal = ({ skill, onClose }) => {
  const [courses, setCourses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeLevel, setActiveLevel] = useState('beginner')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveToQueue = async () => {
    setSaving(true)
    try {
      await learningAPI.addSkill({ skillName: skill })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save to queue', err)
      alert(err.response?.data?.message || 'Failed to save to learning queue')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await learningAPI.getCoursesForSkill(skill)
        setCourses(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || `No courses found for "${skill}".`)
      } finally {
        setLoading(false)
      }
    }

    if (skill) fetchCourses()
  }, [skill])

  if (!skill) return null

  const activeCourses = courses?.levels?.[activeLevel] || []

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent)]" />
            <div className="relative px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {courses?.skill_name || skill}
                  </h2>
                  <p className="text-xs text-white/70">Free course recommendations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-primary-500 mb-3" />
                <p className="text-sm text-text-muted">Finding courses for <span className="font-medium text-text-secondary">{skill}</span>...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                  <AlertCircle size={24} className="text-amber-500" />
                </div>
                <p className="text-sm text-text-secondary text-center max-w-sm">{error}</p>
                <p className="text-xs text-text-muted mt-2">Try searching with a different variation of the skill name.</p>
              </div>
            ) : (
              <>
                {/* Level tabs */}
                <div className="px-6 pt-5 pb-2">
                  <div className="flex gap-2 p-1 bg-surface-alt rounded-xl">
                    {Object.entries(levelConfig).map(([key, config]) => {
                      const Icon = config.icon
                      const isActive = activeLevel === key
                      const count = courses?.levels?.[key]?.length || 0
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveLevel(key)}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isActive
                              ? `bg-white shadow-sm ${config.text} ring-1 ${config.ring}`
                              : 'text-text-muted hover:text-text-secondary hover:bg-white/50'
                          }`}
                        >
                          <Icon size={14} />
                          {config.label}
                          <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? config.badge : 'bg-gray-100 text-gray-500'
                          }`}>
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Course cards */}
                <div className="px-6 pb-6 pt-2 space-y-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeLevel}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {activeCourses.length > 0 ? (
                        activeCourses.map((course, idx) => (
                          <CourseCard key={idx} course={course} level={activeLevel} />
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-sm text-text-muted">No {levelConfig[activeLevel].label.toLowerCase()} courses available.</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 border-t border-border bg-surface-alt flex justify-end">
                  <button
                    onClick={handleSaveToQueue}
                    disabled={saving || saveSuccess}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      saveSuccess 
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md active:scale-95'
                    } disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer`}
                  >
                    {saving ? (
                      <><Loader2 size={16} className="animate-spin" /> Saving...</>
                    ) : saveSuccess ? (
                      <>Saved to Queue!</>
                    ) : (
                      <><BookOpen size={16} /> Save to Learning Queue</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const CourseCard = ({ course, level }) => {
  const config = levelConfig[level]

  return (
    <motion.a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={`relative rounded-2xl border ${config.border} bg-white overflow-hidden hover:shadow-md transition-all duration-300`}>
        {/* Accent stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.gradient}`} />

        <div className="pl-5 pr-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors leading-snug">
                {course.title}
              </h4>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center flex-wrap gap-2 mt-3">
                {/* Platform badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${getPlatformColor(course.platform)}`}>
                  <Monitor size={10} />
                  {course.platform}
                </span>
                {/* Duration */}
                {course.duration && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600">
                    <Clock size={10} />
                    {course.duration}
                  </span>
                )}
              </div>
            </div>

            {/* External link icon */}
            <div className="flex-shrink-0 p-2 rounded-xl bg-surface-alt group-hover:bg-primary-50 text-text-muted group-hover:text-primary-600 transition-all">
              <ExternalLink size={16} />
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

export default CourseModal
