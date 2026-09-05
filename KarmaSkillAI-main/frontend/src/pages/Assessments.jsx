import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClipboardList, PlayCircle, CheckCircle2, Clock } from "lucide-react"
import { getEmployeeAssessments } from "../api/assessments"
import { getRecommendations } from "../api/recommendations"

export default function Assessments({ employee }) {
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState([])
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!employee) return
    setLoading(true)
    Promise.all([
      getEmployeeAssessments(employee.id).catch(() => []),
      getRecommendations(employee.id).catch(() => null)
    ]).then(([a, r]) => {
      setAssessments(a || [])
      setRecs(r?.recommendations || [])
      setLoading(false)
    })
  }, [employee?.id])

  const quizzes = recs.filter(r => r.quiz_id)

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList size={20} className="text-blue-600 sm:w-6 sm:h-6" /> Assessments & Evaluations
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Take interactive role evaluations and track your historical performance records.
        </p>
      </div>

      {/* Available Quizzes */}
      {quizzes.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Available Role Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {quizzes.map((q, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-3.5 sm:p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                    {q.material_title || q.competency || `Quiz #${q.quiz_id}`}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">
                    {q.competency} &bull; {q.difficulty || "All Levels"}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/quizzes/${q.quiz_id}`)}
                  className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 shadow-sm"
                >
                  <PlayCircle size={14} /> Attempt
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Evaluation History</h2>
          <span className="text-[10px] sm:text-xs text-gray-400">Total: {assessments.length}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-xs sm:text-sm">Loading records...</div>
        ) : assessments.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs sm:text-sm">
            No assessments completed yet. Select an available quiz to begin!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
              <thead className="bg-gray-50 text-gray-500 text-[11px] sm:text-xs uppercase">
                <tr>
                  <th className="px-4 sm:px-5 py-3 font-medium">Record ID</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Competency</th>
                  <th className="px-4 sm:px-5 py-3 text-center font-medium">Score</th>
                  <th className="px-4 sm:px-5 py-3 text-center font-medium">Questions</th>
                  <th className="px-4 sm:px-5 py-3 text-center font-medium">Percentage</th>
                  <th className="px-4 sm:px-5 py-3 text-center font-medium">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assessments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 sm:px-5 py-3 text-gray-600 font-mono">#{a.id}</td>
                    <td className="px-4 sm:px-5 py-3 text-gray-800 font-medium">Competency #{a.competency_id}</td>
                    <td className="px-4 sm:px-5 py-3 text-center font-bold text-gray-900">{a.score}</td>
                    <td className="px-4 sm:px-5 py-3 text-center text-gray-500">{a.total_questions}</td>
                    <td className="px-4 sm:px-5 py-3 text-center font-bold">{Math.round(a.percentage)}%</td>
                    <td className="px-4 sm:px-5 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                        a.percentage >= 80 ? "bg-green-100 text-green-700" :
                        a.percentage >= 60 ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {a.percentage >= 80 ? "Proficient" : a.percentage >= 60 ? "Satisfactory" : "Development Needed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
