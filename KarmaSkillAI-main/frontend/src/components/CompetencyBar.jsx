export default function CompetencyBar({ label, value, color = "bg-blue-500" }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="text-xs sm:text-sm text-gray-700 w-28 sm:w-36 md:w-44 flex-shrink-0 truncate" title={label}>{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-2.5">
        <div
          className={`h-2 sm:h-2.5 rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-gray-700 w-9 text-right flex-shrink-0">{Math.round(value)}%</span>
    </div>
  )
}
