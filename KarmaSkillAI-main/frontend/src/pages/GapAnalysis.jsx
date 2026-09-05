import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import GapTable from "../components/GapTable"
import { getGapAnalysis } from "../api/employees"

const BAR_COLORS = ["bg-red-500","bg-orange-400","bg-yellow-400","bg-blue-500","bg-green-500","bg-purple-500"]

export default function GapAnalysis({ employee }) {
  const [gap, setGap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!employee) return
    setLoading(true)
    setError(null)
    getGapAnalysis(employee.id)
      .then(setGap)
      .catch(() => setError("Could not load gap analysis."))
      .finally(() => setLoading(false))
  }, [employee?.id])

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600 sm:w-6 sm:h-6"/> Competency Gap Analysis
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Benchmark your demonstrated skills against official role requirements.
        </p>
      </div>

      {/* Employee Snapshot */}
      {employee && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-xl flex-shrink-0 shadow-sm">
            {employee.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full text-center sm:text-left">
            {[
              ["Name", employee.name],
              ["Role", employee.role],
              ["Department", employee.department],
              ["Experience", `${employee.experience} Years`]
            ].map(([k,v]) => (
              <div key={k} className="p-2 sm:p-0 bg-gray-50/70 sm:bg-transparent rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{k}</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="text-gray-400 text-xs sm:text-sm py-10 text-center">Loading gap matrix...</div>}
      {error && <div className="bg-red-50 text-red-600 rounded-xl p-3.5 text-xs sm:text-sm">{error}</div>}

      {gap && (
        <>
          {/* Gap Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Role Competency Matrix</h2>
              <span className="text-[10px] sm:text-xs text-gray-400 font-normal">Swipe horizontally on mobile &rarr;</span>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[480px]">
                <GapTable competencies={gap.competencies} />
              </div>
            </div>
          </div>

          {/* Visual Progress Comparisons */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Current vs. Target Proficiency</h2>
            <div className="space-y-4">
              {gap.competencies.map((c, i) => (
                <div key={c.competency} className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">{c.competency}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-600">
                      <span className="w-14 sm:w-16 flex-shrink-0 font-medium">Current</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                          style={{ width: `${Math.min((c.current_level / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="w-9 text-right font-bold">{(c.current_level * 10).toFixed(0)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-400">
                      <span className="w-14 sm:w-16 flex-shrink-0">Target</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gray-400"
                          style={{ width: `${Math.min((c.required_level / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="w-9 text-right font-medium">{(c.required_level * 10).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
