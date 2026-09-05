export default function QuestionNavigator({ total, current, answered, onJump }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">Question Navigator</p>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1
          const isAnswered = answered.has(n)
          const isCurrent = current === n
          return (
            <button
              key={n}
              onClick={() => onJump(n)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                isCurrent
                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                  : isAnswered
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-4 space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full inline-block" /> Answered</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-600 rounded-full inline-block" /> Current</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-200 rounded-full inline-block border border-gray-300" /> Not answered</div>
      </div>
    </div>
  )
}
