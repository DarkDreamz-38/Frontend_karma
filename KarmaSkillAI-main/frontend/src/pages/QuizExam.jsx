import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
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

  if (loading) return <div className="py-20 text-center text-gray-400">Loading quiz…</div>
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>

  const questions = quiz.questions

  // Results screen
  if (submitted && result) {
    const { score, total_questions, percentage } = result.result
    const passed = percentage >= 60
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold ${passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {Math.round(percentage)}%
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{passed ? "Well Done!" : "Keep Practicing!"}</h2>
          <p className="text-gray-500 mt-2">You scored {score} out of {total_questions} questions.</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-gray-900">{score}</p>
              <p className="text-xs text-gray-500 mt-1">Correct</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-gray-900">{total_questions - score}</p>
              <p className="text-xs text-gray-500 mt-1">Incorrect</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className={`text-2xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{Math.round(percentage)}%</p>
              <p className="text-xs text-gray-500 mt-1">Score</p>
            </div>
          </div>
          {/* Per-question results */}
          <div className="mt-6 text-left space-y-2 max-h-72 overflow-y-auto">
            {result.question_results.map((qr, i) => (
              <div key={qr.question_id} className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm ${qr.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                <span>Q{i+1}: Your answer: <strong>{qr.your_answer || "—"}</strong></span>
                <span className="font-semibold">{qr.correct ? "✓ Correct" : "✗ Wrong"}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={() => navigate("/assessments")} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Back to Assessments
            </button>
            <button onClick={() => navigate("/")} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[current - 1]

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Quiz</p>
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">{quiz.title}</p>
            </div>
          </div>
          <div className="space-y-1.5 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Clock size={14}/> {quiz.number_of_questions} Questions</div>
            <div className="flex items-center gap-2"><ClipboardList size={14} className="text-gray-400"/> Multiple Choice</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <QuestionNavigator total={questions.length} current={current} answered={answeredSet} onJump={setCurrent} />
        </div>
      </aside>

      {/* Main quiz area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header bar */}
        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100 flex items-center gap-4">
          <button onClick={() => navigate("/assessments")} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            <ArrowLeft size={14}/> Back
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-800">Question {current} of {questions.length}</span>
              <span className="text-xs text-gray-500">{Math.round((answeredSet.size / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${(answeredSet.size / questions.length) * 100}%` }} />
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono font-bold text-lg ${timeLeft < 60 ? "border-red-300 bg-red-50 text-red-600" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
            <Clock size={18} />
            {mins}:{secs}
          </div>
        </div>

        {/* Question card */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <QuizQuestion
              question={q.question}
              options={q.options}
              selected={answers[q.id]}
              onSelect={ans => setAnswers(prev => ({ ...prev, [q.id]: ans }))}
              index={current}
              total={questions.length}
            />
            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-8">
              <button
                disabled={current === 1}
                onClick={() => setCurrent(c => c - 1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16}/> Previous
              </button>
              {current < questions.length ? (
                <button onClick={() => setCurrent(c => c + 1)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Next Question <ChevronRight size={16}/>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
                >
                  {submitting ? "Submitting…" : "Submit Quiz"}
                </button>
              )}
            </div>
          </div>

          {/* Tip panel */}
          {q.difficulty && (
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 h-fit">
              <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold text-sm">
                <span className="text-lg">💡</span> Tip
              </div>
              <p className="text-sm text-blue-600 leading-relaxed">
                Difficulty: <strong>{q.difficulty}</strong>. Read all options carefully before selecting your answer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
