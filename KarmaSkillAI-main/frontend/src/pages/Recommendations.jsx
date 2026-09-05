import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lightbulb, BookOpen, PlayCircle, Award, Target } from "lucide-react"
import { getRecommendations } from "../api/recommendations"

export default function Recommendations({ employee }) {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!employee) return
    setLoading(true)
    setError(null)
    getRecommendations(employee.id)
      .then(setData)
      .catch(() => setError("Failed to load recommendations."))
      .finally(() => setLoading(false))
  }, [employee?.id])

  const recList = data?.recommendations || []

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb size={20} className="text-amber-500 sm:w-6 sm:h-6" />
          Personalized Learning Pathways
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          AI-curated learning pathways and modules designed to bridge detected competency deficits.
        </p>
      </div>

      {employee && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full font-medium">
              Employee Target Profile
            </span>
            <h2 className="text-lg sm:text-xl font-bold mt-1.5 sm:mt-2">{employee.name}</h2>
            <p className="text-xs sm:text-sm text-blue-100">{employee.role} &bull; {employee.department}</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-white/10 w-fit">
            <div>
              <p className="text-[10px] sm:text-xs text-blue-200">Recommended Courses</p>
              <p className="text-xl sm:text-2xl font-bold">{recList.length}</p>
            </div>
            <Award size={28} className="text-amber-300 sm:w-8 sm:h-8" />
          </div>
        </div>
      )}

      {loading && <div className="text-center py-12 text-gray-400 text-xs sm:text-sm">Finding recommended courses...</div>}
      {error && <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs sm:text-sm">{error}</div>}

      {!loading && recList.length === 0 && (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm border border-gray-100">
          <Target size={36} className="mx-auto text-green-500 mb-2.5 sm:mb-3 sm:w-10 sm:h-10" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Great work! No significant gaps found.</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            You meet all required competencies for your current role. Check back after your next evaluation.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {recList.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {item.competency || "Core Competency"}
                </span>
                {item.gap != null && (
                  <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.gap > 20 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    Deficit: {typeof item.gap === "number" ? item.gap.toFixed(1) : item.gap}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                {item.material_title || item.course_title || `Course for ${item.competency}`}
              </h3>

              <p className="text-xs text-gray-500 line-clamp-3 mb-4">
                {item.reason || item.course_description || "Targeted module to elevate proficiency in public service delivery."}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs text-gray-400 truncate">
                iGOT Karmayogi &bull; {item.difficulty || "All Levels"}
              </span>

              <div className="flex items-center gap-2 flex-shrink-0">
                {item.quiz_id ? (
                  <button
                    onClick={() => navigate(`/quizzes/${item.quiz_id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                  >
                    <PlayCircle size={14} />
                    Take Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/learning")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <BookOpen size={14} />
                    Learn
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
