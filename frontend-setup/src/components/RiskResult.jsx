export default function RiskResult({ result }) {
  if (!result) return null

  const colors = {
    low: 'bg-sage-100 text-sage-700 border-sage-400',
    moderate: 'bg-clay-400/20 text-clay-600 border-clay-400',
    high: 'bg-red-100 text-red-700 border-red-400',
  }
  const colorClass = colors[result.risk_level] || colors.moderate

  return (
    <div className={`rounded-2xl border-2 p-6 mt-6 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-semibold capitalize">{result.risk_level} risk</span>
        <span className="text-2xl font-semibold">{Math.round(result.risk_score * 100)}%</span>
      </div>

      {/* simple horizontal gauge */}
      <div className="w-full h-2 bg-white/60 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-current rounded-full transition-all"
          style={{ width: `${result.risk_score * 100}%` }}
        />
      </div>

      {result.key_factors?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Key factors:</p>
          <ul className="text-sm space-y-0.5">
            {result.key_factors.map((factor, i) => (
              <li key={i}>• {factor}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
