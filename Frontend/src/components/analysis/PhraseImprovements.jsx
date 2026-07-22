import { Pencil } from 'lucide-react'

const PhraseImprovements = ({ suggestions = [] }) => {
  if (!suggestions || suggestions.length === 0) return null

  // Max 5 cards
  const displayedSuggestions = suggestions.slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
        <Pencil size={13} />
        PHRASE IMPROVEMENTS
      </div>

      <div className="space-y-3">
        {displayedSuggestions.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            {/* Row 1: Weak phrase */}
            <div className="mb-3">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight block mb-1">CURRENT</span>
              <p className="text-sm text-gray-700 italic bg-red-50 rounded px-2 py-1.5 border border-red-100">
                {item.weakPhrase}
              </p>
            </div>

            {/* Row 2: Better alternatives */}
            <div className="mb-3">
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight block mb-1">STRONGER ALTERNATIVES</span>
              <div className="space-y-2">
                {item.betterAlternatives.map((alt, aIdx) => (
                  <div key={aIdx} className="flex gap-2">
                    <span className="text-xs font-medium text-gray-400 mt-0.5">{aIdx + 1}.</span>
                    <p className="text-sm text-gray-800 pl-2 border-l-2 border-green-500">
                      {alt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Rationale */}
            {item.rationale && (
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight block mb-1">WHY</span>
                <p className="text-xs text-gray-500 italic">
                  {item.rationale}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PhraseImprovements
