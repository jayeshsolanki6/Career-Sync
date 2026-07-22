import { Lightbulb } from 'lucide-react'

const TailoringCard = ({ suggestions = [] }) => {
  if (!suggestions.length) return null

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-1.5">
        <Lightbulb size={13} className="text-amber-500" />
        TAILORING SUGGESTIONS
      </p>
      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700">
            <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium mt-0.5">
              {i + 1}
            </span>
            <span className="leading-relaxed">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TailoringCard
