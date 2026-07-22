import ScoreRing from './ScoreRing'

const ActionVerbCard = ({ score, feedback }) => {
  if (score === undefined && !feedback) return null

  return (
    <div className="flex items-center gap-4">
      {score !== undefined && (
        <div className="shrink-0">
          <ScoreRing score={score} size={64} strokeWidth={6} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
          Action Verb Score
        </p>
        {feedback && (
          <p className="text-sm text-gray-600 leading-relaxed">{feedback}</p>
        )}
      </div>
    </div>
  )
}

export default ActionVerbCard
