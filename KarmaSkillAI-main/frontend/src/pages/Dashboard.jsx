import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart2, ClipboardList, BookOpen, Target, ArrowRight, TrendingUp } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import StatCard from "../components/StatCard"
import CompetencyBar from "../components/CompetencyBar"
import { getGapAnalysis } from "../api/employees"
import { getEmployeeAssessments } from "../api/assessments"
import { getRecommendations } from "../api/recommendations"

const BAR_COLORS = ["bg-green-500","bg-yellow-400","bg-blue-500","bg-purple-500","bg-emerald-500"]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good Morning"
  if (h < 17) return "Good Afternoon"
  return "Good Evening"
}

export default function Dashboard({ employee }) {
  const navigate = useNavigate()
  const [gap, setGap] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!employee) return
    setLoading(true)
    Promise.all([
      getGapAnalysis(employee.id).catch(() => null),
      getEmployeeAssessments(employee.id).catch(() => []),
      getRecommendations(employee.id).catch(() => null)
    ]).then(([g, a, r]) => {
      setGap(g)
      setAssessments(a || [])
      setRecommendations(r)
      setLoading(false)
    })
  }, [employee?.id])

  if (!employee) return <div className="text-gray-400 text-center py-20">No employees found. Please seed the database.</div>

  const competencies = gap?.competencies || []
  const avgCompetency = competencies.length
    ? Math.round(competencies.reduce((s, c) => s + (c.current_level / (c.required_level || 1)) * 100, 0) / competencies.length)
    : 0

  const recs = recommendations?.recommendations || []
  const journeyData = assessments.slice(-6).map((a, i) => ({ name: `#${i+1}`, score: Math.round(a.percentage) }))

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Greeting + quote */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {getGreeting()}, {employee.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Keep learning. Keep growing. Build a stronger tomorrow.
          </p>
        </div>
        <blockquote className="text-left sm:text-right text-xs italic text-gray-400 max-w-xs hidden md:block">
          &ldquo;Continuous learning builds a stronger, more capable public service.&rdquo;<br />
          <span className="text-gray-500 not-italic font-medium">— iGOT Karmayogi</span>
        </blockquote>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard icon={BarChart2} iconBg="bg-purple-100 text-purple-600" title="Overall Competency" value={`${avgCompetency}%`} sub="Gap analysis" />
        <StatCard icon={ClipboardList} iconBg="bg-blue-100 text-blue-600" title="Assessments" value={assessments.length} sub={`${assessments.length} completed`} />
        <StatCard icon={BookOpen} iconBg="bg-green-100 text-green-600" title="Recommendations" value={recs.length} sub="Available" />
        <StatCard icon={Target} iconBg="bg-orange-100 text-orange-600" title="Skill Gaps" value={competencies.filter(c => c.gap > 0).length} sub="Role-based" />
      </div>

      {/* Two column section: Skill Proficiency & Assessment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Skill-wise proficiency */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Skill-wise Proficiency</h2>
            <button onClick={() => navigate("/progress")} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
              View Details <ArrowRight size={12} />
            </button>
          </div>
          {loading ? (
            <div className="text-gray-400 text-xs sm:text-sm py-4">Loading competency metrics...</div>
          ) : (
            <div className="space-y-3">
              {competencies.slice(0, 5).map((c, i) => (
                <CompetencyBar
                  key={c.competency}
                  label={c.competency}
                  value={(c.current_level / (c.required_level || 1)) * 100}
                  color={BAR_COLORS[i % BAR_COLORS.length]}
                />
              ))}
              {competencies.length === 0 && (
                <p className="text-xs sm:text-sm text-gray-400">No competency data yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Assessment history */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Assessment History</h2>
            <button onClick={() => navigate("/assessments")} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {assessments.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart2 size={14} className="text-blue-600" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">Competency #{a.competency_id}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">Score: {a.score}/{a.total_questions}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                  a.percentage >= 80 ? "bg-green-100 text-green-700" :
                  a.percentage >= 60 ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {Math.round(a.percentage)}%
                </span>
              </div>
            ))}
            {assessments.length === 0 && (
              <p className="text-xs sm:text-sm text-gray-400 py-4">No assessments yet. Take an interactive quiz!</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom two columns: Recommended learning & Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recommended learning */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Recommended Learning</h2>
            <button onClick={() => navigate("/recommendations")} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {recs.slice(0, 3).map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{r.material_title || r.competency}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">iGOT &bull; {r.difficulty || "Intermediate"}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(r.quiz_id ? `/quizzes/${r.quiz_id}` : `/learning`)}
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                >
                  Start
                </button>
              </div>
            ))}
            {recs.length === 0 && (
              <p className="text-xs sm:text-sm text-gray-400 py-4">No recommendations yet. Complete an assessment!</p>
            )}
          </div>
        </div>

        {/* Learning Journey chart */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Your Learning Journey</h2>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">Progress Trend</span>
            </div>
          </div>
          {journeyData.length >= 2 ? (
            <div className="w-full h-40 sm:h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={journeyData} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: "#3b82f6", r: 3.5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-xs sm:text-sm text-center">
              <TrendingUp size={28} className="mb-2 text-gray-300" />
              Complete assessments to visualize your score progression
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
