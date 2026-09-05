import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Assessments from "./pages/Assessments"
import QuizExam from "./pages/QuizExam"
import Learning from "./pages/Learning"
import GapAnalysis from "./pages/GapAnalysis"
import Recommendations from "./pages/Recommendations"
import Profile from "./pages/Profile"
import { getEmployees } from "./api/employees"

export default function App() {
  const [employees, setEmployees] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees()
      setEmployees(data)
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id)
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const selectedEmployee = employees.find(e => e.id === selectedId) || employees[0]

  const handleEmployeeCreated = (newEmp) => {
    setEmployees(prev => [...prev, newEmp])
    setSelectedId(newEmp.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-gray-600">Loading KarmaSkill AI...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Layout
        employees={employees}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
      >
        <Routes>
          <Route path="/" element={<Dashboard employee={selectedEmployee} />} />
          <Route path="/assessments" element={<Assessments employee={selectedEmployee} />} />
          <Route path="/quizzes/:quizId" element={<QuizExam employee={selectedEmployee} />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/progress" element={<GapAnalysis employee={selectedEmployee} />} />
          <Route path="/recommendations" element={<Recommendations employee={selectedEmployee} />} />
          <Route
            path="/profile"
            element={
              <Profile
                employee={selectedEmployee}
                employees={employees}
                onSelectEmployee={(id) => setSelectedId(id)}
                onEmployeeCreated={handleEmployeeCreated}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
