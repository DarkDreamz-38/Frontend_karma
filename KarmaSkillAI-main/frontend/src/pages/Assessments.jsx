import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClipboardList, PlayCircle } from "lucide-react"
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ClipboardList size={20} className="text-blue-600"/>Assessments</h1>
        <p className="text-sm text-gray-500 mt-1">View your assessment history and take new quizzes.</p>
      </div>

      {/* Available quizzes */}
      {quizzes.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Available Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {quizzes.map((q, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all">
                <div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{q.material_title || q.competency || `Quiz #${q.quiz_id}`}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{q.competency} · {q.difficulty || "Mixed"}</p>
                </div>
                <button
                  onClick={() => navigate(`/quizzes/${q.quiz_id}`)}
                  className="ml-3 flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                >
                  <PlayCircle size={14} /> Attempt
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Assessment History</h2>
        </div>
        {loading ? (
          <div className="py-10 text-center text-gray-400 text-sm">Loading…</div>
        ) : assessments.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">No assessments yet. Attempt a quiz to get started!</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left font-medium">ID</th>
                <th className="px-5 py-3 text-left font-medium">Competency ID</th>
                <th className="px-5 py-3 text-center font-medium">Score</th>
                <th className="px-5 py-3 text-center font-medium">Total Q</th>
                <th className="px-5 py-3 text-center font-medium">Percentage</th>
                <th className="px-5 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assessments.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-600">#{a.id}</td>
                  <td className="px-5 py-3 text-gray-600">#{a.competency_id}</td>
                  <td className="px-5 py-3 text-center font-medium">{a.score}</td>
                  <td className="px-5 py-3 text-center text-gray-500">{a.total_questions}</td>
                  <td className="px-5 py-3 text-center font-semibold">{Math.round(a.percentage)}%</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      a.percentage >= 80 ? "bg-green-100 text-green-700" :
                      a.percentage >= 60 ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>{a.percentage >= 80 ? "Passed" : a.percentage >= 60 ? "Average" : "Needs Work"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
