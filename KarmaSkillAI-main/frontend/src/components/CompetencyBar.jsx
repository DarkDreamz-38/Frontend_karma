export default function CompetencyBar({ label, value, color = "bg-blue-500" }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-44 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-10 text-right">{Math.round(value)}%</span>
    </div>
  )
}
