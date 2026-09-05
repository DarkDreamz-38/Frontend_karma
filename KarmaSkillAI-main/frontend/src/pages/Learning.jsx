import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, Upload, FileText, CheckCircle, AlertCircle, PlayCircle, Loader2 } from "lucide-react"
import { uploadAndAnalyzeMaterial } from "../api/materials"

export default function Learning() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [numQuestions, setNumQuestions] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && selected.name.toLowerCase().endsWith(".pdf")) {
      setFile(selected)
      setError(null)
    } else {
      setFile(null)
      setError("Please select a valid PDF file.")
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a PDF file first.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await uploadAndAnalyzeMaterial(file, numQuestions)
      setResult(data)
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || "Failed to analyze learning material."
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={20} className="text-blue-600" />
          Learning Materials & AI Analysis
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload PDF course documents or manuals. Our AI analyzes competencies and auto-generates interactive quizzes.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleUpload} className="space-y-5">
          <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-8 text-center transition-colors bg-gray-50/50">
            <input
              type="file"
              accept=".pdf"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {file ? file.name : "Click to select or drag & drop a PDF document"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Supported format: PDF up to 20MB</p>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="num-q" className="text-sm font-medium text-gray-700">
                Questions to Generate:
              </label>
              <select
                id="num-q"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Analyze Material & Create Quiz
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4">
            <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">{result.message}</h3>
              <p className="text-sm text-green-700 mt-0.5">
                Material &quot;{result.material.title}&quot; ({result.material.pages} pages, {result.material.characters} characters) successfully saved.
              </p>
            </div>
            {result.quiz?.id && (
              <button
                onClick={() => navigate(`/quizzes/${result.quiz.id}`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <PlayCircle size={16} />
                Attempt Quiz Now
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detected Competencies */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Detected Competencies</h3>
              {result.competencies?.length > 0 ? (
                <div className="space-y-2.5">
                  {result.competencies.map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-800">{comp.name}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                        Relevance: {Math.round(comp.relevance * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No specific framework competencies matched.</p>
              )}
            </div>

            {/* Generated Quiz Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Generated Quiz Overview</h3>
              <div className="p-4 bg-blue-50 rounded-xl space-y-2">
                <p className="text-sm font-semibold text-blue-900">{result.quiz.title}</p>
                <p className="text-xs text-blue-700">Total Questions: {result.quiz.number_of_questions}</p>
                {result.primary_competency && (
                  <p className="text-xs text-blue-700">
                    Target Competency: <span className="font-bold">{result.primary_competency}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Question Previews */}
          {result.quiz?.questions?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Questions Preview</h3>
              <div className="space-y-4">
                {result.quiz.questions.map((q, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-800 mb-2">
                      Q{idx + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                      <div className={`p-2 rounded ${q.correct_answer === "A" ? "bg-green-100 font-semibold text-green-800" : "bg-white"}`}>
                        A. {q.options.A}
                      </div>
                      <div className={`p-2 rounded ${q.correct_answer === "B" ? "bg-green-100 font-semibold text-green-800" : "bg-white"}`}>
                        B. {q.options.B}
                      </div>
                      <div className={`p-2 rounded ${q.correct_answer === "C" ? "bg-green-100 font-semibold text-green-800" : "bg-white"}`}>
                        C. {q.options.C}
                      </div>
                      <div className={`p-2 rounded ${q.correct_answer === "D" ? "bg-green-100 font-semibold text-green-800" : "bg-white"}`}>
                        D. {q.options.D}
                      </div>
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
