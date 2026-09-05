export default function StatCard({ icon: Icon, iconBg, title, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm border border-gray-100">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm text-gray-500 truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  )
}
