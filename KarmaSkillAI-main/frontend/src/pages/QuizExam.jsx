import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, XCircle, LayoutGrid } from "lucide-react"
import QuizQuestion from "../components/QuizQuestion"
import QuestionNavigator from "../components/QuestionNavigator"
import { getQuiz, submitQuiz } from "../api/quizzes"

export default function QuizExam({ employee }) {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [current, setCurrent] = useState(1)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showNavMobile, setShowNavMobile] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    getQuiz(quizId)
      .then(q => {
        setQuiz(q)
        setTimeLeft((q.number_of_questions * 90))
        setLoading(false)
      })
      .catch(() => { setError("Quiz not found."); setLoading(false) })
  }, [quizId])

  useEffect(() => {
    if (!quiz || submitted) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [quiz, submitted])

  const handleSubmit = async () => {
    if (submitting || submitted) return
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const payload = {
        employee_id: employee.id,
        answers: Object.entries(answers).map(([question_id, answer]) => ({
          question_id: parseInt(question_id), answer
        }))
      }
      const res = await submitQuiz(quizId, payload)
      setResult(res)
      setSubmitted(true)
    } catch(e) {
      setError("Failed to submit quiz. Please try again.")
    }
    setSubmitting(false)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const secs = String(timeLeft % 60).padStart(2, "0")
  const answeredSet = new Set(Object.keys(answers).map(Number))

  if (loading) return <div className="py-20 text-center text-gray-400 text-sm">Loading assessment...</div>
  if (error) return <div className="py-20 text-center text-red-500 text-sm">{error}</div>

  const questions = quiz.questions

  // Results Screen
  if (submitted && result) {
    const { score, total_questions, percentage } = result.result
    const passed = percentage >= 60
    return (
      <div className="max-w-2xl mx-auto px-1 sm:px-4">
        <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 text-center">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold ${passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {Math.round(percentage)}%
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{passed ? "Assessment Passed!" : "Needs Improvement"}</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">You correctly answered {score} of {total_questions} questions.</p>

          <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{score}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Correct</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{total_questions - score}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Incorrect</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
              <p className={`text-lg sm:text-2xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{Math.round(percentage)}%</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Score</p>
            </div>
          </div>

          {/* Per question summary */}
          <div className="mt-6 text-left space-y-2 max-h-60 overflow-y-auto">
            {result.question_results.map((qr, i) => (
              <div key={qr.question_id} className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm ${qr.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                <span className="truncate pr-2">Q{i+1}: Your answer: <strong>{qr.your_answer || "None"}</strong></span>
                <span className="font-semibold flex-shrink-0">{qr.correct ? "✓ Correct" : "✗ Incorrect"}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
            <button onClick={() => navigate("/assessments")} className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors">
              Back to Assessments
            </button>
            <button onClick={() => navigate("/")} className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-colors">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[current - 1]

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-7xl mx-auto">
      {/* Desktop Sidebar Navigator */}
      <aside className="hidden lg:block w-60 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Assessment</p>
              <p className="text-xs font-bold text-gray-800 truncate">{quiz.title}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">{quiz.number_of_questions} Multiple Choice Questions</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <QuestionNavigator total={questions.length} current={current} answered={answeredSet} onJump={setCurrent} />
        </div>
      </aside>

      {/* Main Examination Area */}
      <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
        {/* Responsive Header Bar with Timer */}
        <div className="bg-white rounded-2xl px-3.5 sm:px-5 py-3 shadow-sm border border-gray-100 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate("/assessments")}
            className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:underline flex-shrink-0"
          >
            <ArrowLeft size={14}/> Back
          </button>

          {/* Progress Indicator */}
          <div className="flex-1 px-2 sm:px-4 max-w-md">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 mb-1">
              <span>Q {current} of {questions.length}</span>
              <span>{Math.round((answeredSet.size / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2">
              <div className="h-1.5 sm:h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${(answeredSet.size / questions.length) * 100}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Navigator Toggle Button */}
            <button
              onClick={() => setShowNavMobile(!showNavMobile)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              title="Toggle Question Grid"
            >
              <LayoutGrid size={16} />
            </button>

            {/* Countdown Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-mono font-bold text-xs sm:text-sm flex-shrink-0 ${
              timeLeft < 60 ? "border-red-300 bg-red-50 text-red-600" : "border-blue-200 bg-blue-50 text-blue-700"
            }`}>
              <Clock size={14} className="sm:w-4 sm:h-4" />
              {mins}:{secs}
            </div>
          </div>
        </div>

        {/* Mobile Question Navigator Accordion */}
        {showNavMobile && (
          <div className="lg:hidden bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
            <QuestionNavigator
              total={questions.length}
              current={current}
              answered={answeredSet}
              onJump={(n) => { setCurrent(n); setShowNavMobile(false) }}
            />
          </div>
        )}

        {/* Question & Options Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <QuizQuestion
              question={q.question}
              options={q.options}
              selected={answers[q.id]}
              onSelect={ans => setAnswers(prev => ({ ...prev, [q.id]: ans }))}
              index={current}
              total={questions.length}
            />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 sm:mt-8 gap-3 pt-4 border-t border-gray-50">
              <button
                disabled={current === 1}
                onClick={() => setCurrent(c => c - 1)}
                className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16}/> Previous
              </button>

              {current < questions.length ? (
                <button
                  onClick={() => setCurrent(c => c + 1)}
                  className="flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Next <ChevronRight size={16}/>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 sm:px-7 py-2 sm:py-2.5 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors shadow-sm"
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
              )}
            </div>
          </div>

          {/* Difficulty Tip Card */}
          {q.difficulty && (
            <div className="bg-blue-50 rounded-2xl p-4 sm:p-5 border border-blue-100 h-fit">
              <div className="flex items-center gap-1.5 mb-1.5 text-blue-700 font-semibold text-xs sm:text-sm">
                <span>💡</span> Guidance Tip
              </div>
              <p className="text-xs sm:text-sm text-blue-700/80 leading-relaxed">
                Difficulty Level: <strong>{q.difficulty}</strong>. Review each option thoroughly before committing your final answer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
