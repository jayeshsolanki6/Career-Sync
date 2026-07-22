import { Sparkles, RefreshCw, Bot, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const StudyPlanView = ({ roadmapData, taskCompletion, progress, onTaskToggle, onGenerate, generating }) => {
  if (generating) {
    return (
      <div className="py-16 text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
          <Bot size={22} className="absolute inset-0 m-auto text-indigo-500" />
        </div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Crafting your roadmap…</h4>
        <p className="text-sm text-gray-500">Building a personalized 7-day plan.</p>
      </div>
    )
  }

  if (!roadmapData) {
    return (
      <div className="py-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
          <Bot size={28} className="text-indigo-400" />
        </div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">No Study Plan Yet</h4>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Generate a personalized 7-day learning plan based on your resume analysis and available courses.
        </p>
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Sparkles size={15} /> Generate Study Plan
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">Overall Progress</span>
          <span className="text-xs font-bold text-indigo-600">{roadmapData.done}/{roadmapData.total} tasks</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-indigo-500 rounded-full"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-0">
        {roadmapData.plan.map((day, di) => {
          const dayTasks = day.tasks || []
          const dayDone = dayTasks.filter((_, ti) => taskCompletion[`${di}-${ti}`]).length
          const allDone = dayTasks.length > 0 && dayDone === dayTasks.length
          const isLast = di === roadmapData.plan.length - 1

          return (
            <div key={di} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0 w-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 z-10 ${
                  allDone ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-indigo-300 text-indigo-600'
                }`}>
                  {allDone ? '✓' : di + 1}
                </div>
                {!isLast && <div className={`w-0.5 flex-1 mt-1 mb-1 ${allDone ? 'bg-green-300' : 'bg-gray-200'}`} />}
              </div>

              <div className="flex-1 pb-5">
                <div className={`p-4 rounded-xl border transition-all ${allDone ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{day.day}</span>
                    <span className="text-[10px] font-semibold text-gray-400">{dayDone}/{dayTasks.length} done</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">{day.title}</h4>
                  <p className="text-xs text-gray-500 mb-3">{day.focus}</p>
                  <div className="space-y-2">
                    {dayTasks.map((task, ti) => {
                      const checked = !!taskCompletion[`${di}-${ti}`]
                      return (
                        <label key={ti} className="flex items-start gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onTaskToggle(di, ti)}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-400 cursor-pointer"
                          />
                          <span className={`text-xs leading-relaxed transition-all ${checked ? 'line-through text-gray-400' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {task}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {day.resource && (
                    <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">📚 Recommended</p>
                      <p className="text-xs text-indigo-600 font-medium">{day.resource}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Project idea */}
      {roadmapData.projectIdea && (
        <div className="mt-2 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
          <h4 className="text-sm font-bold text-indigo-700 flex items-center gap-2 mb-2">
            <Sparkles size={15} /> Portfolio Project Idea
          </h4>
          <p className="text-sm text-indigo-900 leading-relaxed">{roadmapData.projectIdea}</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
        >
          {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Regenerate Plan
        </button>
      </div>
    </div>
  )
}

export default StudyPlanView
