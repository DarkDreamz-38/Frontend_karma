export default function QuizQuestion({ question, options, selected, onSelect, index, total }) {
  const letters = ["A", "B", "C", "D"]
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">Multiple Choice</span>
      </div>
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 leading-snug">{question}</h2>
      <div className="space-y-2.5 sm:space-y-3">
        {letters.map(letter => (
          <button
            key={letter}
            onClick={() => onSelect(letter)}
            className={`w-full flex items-start sm:items-center gap-3 sm:gap-4 px-3.5 sm:px-5 py-3 sm:py-4 rounded-xl border-2 text-left transition-all ${
              selected === letter
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 transition-colors ${
              selected === letter ? "border-blue-600 bg-blue-600" : "border-gray-400"
            }`}>
              {selected === letter && <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full" />}
            </span>
            <span className={`text-xs sm:text-sm leading-relaxed ${selected === letter ? "text-blue-900 font-semibold" : "text-gray-700"}`}>
              <strong className="mr-1">{letter}.</strong> {options[letter]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
