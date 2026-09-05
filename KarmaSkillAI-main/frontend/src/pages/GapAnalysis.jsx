import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import GapTable from "../components/GapTable"
import CompetencyBar from "../components/CompetencyBar"
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600"/> Gap Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">Compare your current competencies against what your role requires.</p>
      </div>

      {/* Employee snapshot */}
      {employee && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {employee.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {[["Name", employee.name],["Role", employee.role],["Department", employee.department],["Experience", `${employee.experience} yrs`]].map(([k,v]) => (
              <div key={k}>
                <p className="text-xs text-gray-400">{k}</p>
                <p className="text-sm font-semibold text-gray-800">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="text-gray-400 text-sm py-10 text-center">Loading gap data…</div>}
      {error && <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">{error}</div>}

      {gap && (
        <>
          {/* Gap table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Competency Analysis</h2>
            </div>
            <GapTable competencies={gap.competencies} />
          </div>

          {/* Visual bars */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Current vs Required (Visual)</h2>
            <div className="space-y-5">
              {gap.competencies.map((c, i) => (
                <div key={c.competency}>
                  <p className="text-xs text-gray-500 mb-1">{c.competency}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-16">Current</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                          style={{ width: `${Math.min((c.current_level / 10) * 100, 100)}%` }} />
                      </div>
                      <span className="w-8 text-right">{(c.current_level * 10).toFixed(0)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="w-16">Required</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gray-400"
                          style={{ width: `${Math.min((c.required_level / 10) * 100, 100)}%` }} />
                      </div>
                      <span className="w-8 text-right">{(c.required_level * 10).toFixed(0)}</span>
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
