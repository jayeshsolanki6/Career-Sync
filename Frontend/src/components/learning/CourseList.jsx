import { BookOpen, GraduationCap, Zap, Monitor, Clock, ExternalLink, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const levelConfig = {
  beginner: {
    label: 'Beginner',
    icon: BookOpen,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    ring: 'ring-green-200',
    stripe: 'from-green-500 to-teal-500',
  },
  intermediate: {
    label: 'Intermediate',
    icon: GraduationCap,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    ring: 'ring-blue-200',
    stripe: 'from-blue-500 to-indigo-500',
  },
  advanced: {
    label: 'Advanced',
    icon: Zap,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    ring: 'ring-purple-200',
    stripe: 'from-purple-500 to-pink-500',
  },
}

const platformColors = {
  'freeCodeCamp': 'bg-gray-900 text-white',
  'Harvard': 'bg-red-700 text-white',
  'Coursera': 'bg-blue-600 text-white',
  'edX': 'bg-red-600 text-white',
  'MIT': 'bg-red-800 text-white',
  'Khan Academy': 'bg-green-600 text-white',
  'Google': 'bg-blue-500 text-white',
  'Microsoft': 'bg-blue-700 text-white',
  'AWS': 'bg-orange-500 text-white',
  'Scrimba': 'bg-purple-600 text-white',
  'Hugging Face': 'bg-yellow-500 text-gray-900',
  'DeepLearning': 'bg-indigo-600 text-white',
  'Stanford': 'bg-red-700 text-white',
  'DataCamp': 'bg-green-700 text-white',
  'Kaggle': 'bg-cyan-600 text-white',
}

const getPlatformColor = (platform) => {
  for (const [key, value] of Object.entries(platformColors)) {
    if (platform?.toLowerCase().includes(key.toLowerCase())) return value
  }
  return 'bg-gray-100 text-gray-700'
}

export const CourseCard = ({ course, level }) => {
  const config = levelConfig[level]
  return (
    <motion.a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={`relative rounded-xl border ${config.border} bg-white overflow-hidden hover:shadow-md transition-all duration-200`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.stripe}`} />
        <div className="pl-5 pr-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
                {course.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${getPlatformColor(course.platform)}`}>
                  <Monitor size={10} /> {course.platform}
                </span>
                {course.duration && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600">
                    <Clock size={10} /> {course.duration}
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 p-2 rounded-lg bg-gray-50 group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-600 transition-all">
              <ExternalLink size={15} />
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

const CourseList = ({ courses, loading, activeLevel, setActiveLevel }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-indigo-400" />
      </div>
    )
  }

  if (!courses) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
          <AlertCircle size={22} className="text-amber-500" />
        </div>
        <p className="text-sm text-gray-500">No courses found for this skill in our dataset.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5">
        {Object.entries(levelConfig).map(([key, cfg]) => {
          const Icon = cfg.icon
          const count = courses?.levels?.[key]?.length || 0
          const isActive = activeLevel === key
          return (
            <button
              key={key}
              onClick={() => setActiveLevel(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive ? `bg-white shadow-sm ${cfg.text} ring-1 ${cfg.ring}` : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={13} /> {cfg.label}
              <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? cfg.badge : 'bg-gray-200 text-gray-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          {(courses.levels?.[activeLevel] || []).length > 0
            ? courses.levels[activeLevel].map((c, i) => <CourseCard key={i} course={c} level={activeLevel} />)
            : <p className="text-center py-8 text-sm text-gray-400">No {activeLevel} courses available.</p>
          }
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default CourseList
