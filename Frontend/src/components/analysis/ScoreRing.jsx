const ScoreRing = ({ score, size = 80, strokeWidth = 7 }) => {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const dashArray = `${(score / 100) * circ} ${circ}`

  const getColors = () => {
    if (score >= 80) return { stroke: '#0f172a', text: 'text-[#0f172a]' }
    if (score >= 60) return { stroke: '#10b981', text: 'text-emerald-600' }
    if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-600' }
    return { stroke: '#ef4444', text: 'text-red-600' }
  }

  const { stroke, text } = getColors()

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-extrabold leading-none ${text}`} style={{ fontSize: size * 0.24 }}>
          {score}
        </span>
        <span className="text-gray-400 font-medium" style={{ fontSize: size * 0.12 }}>
          /100
        </span>
      </div>
    </div>
  )
}

export default ScoreRing
