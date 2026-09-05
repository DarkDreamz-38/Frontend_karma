import { useEffect, useState } from "react"
import { User, PlusCircle, CheckCircle, AlertCircle, Building2, Briefcase, Mail, Award, Clock } from "lucide-react"
import { createEmployee } from "../api/employees"
import { getRoles } from "../api/materials"
import { getEmployeeCompetencies } from "../api/competencies"

export default function Profile({ employee, employees = [], onSelectEmployee, onEmployeeCreated }) {
  const [roles, setRoles] = useState([])
  const [competencies, setCompetencies] = useState([])
  const [loadingCompetencies, setLoadingCompetencies] = useState(false)

  // New employee registration state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "MoSPI",
    role: "Statistical Officer",
    experience: 2.0
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState(null)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    getRoles().then(setRoles).catch(() => {})
  }, [])

  useEffect(() => {
    if (!employee) return
    setLoadingCompetencies(true)
    getEmployeeCompetencies(employee.id)
      .then(setCompetencies)
      .catch(() => setCompetencies([]))
      .finally(() => setLoadingCompetencies(false))
  }, [employee?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)
    setFormError(null)
    setFormMessage(null)

    try {
      const created = await createEmployee({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        role: formData.role,
        experience: parseFloat(formData.experience) || 0
      })
      setFormMessage(`Employee ${created.name} registered successfully!`)
      setFormData({
        name: "",
        email: "",
        department: "MoSPI",
        role: roles[0]?.name || "Statistical Officer",
        experience: 2.0
      })
      if (onEmployeeCreated) {
        onEmployeeCreated(created)
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || "Failed to create employee"
      setFormError(detail)
    } finally {
      setFormSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User size={20} className="text-blue-600 sm:w-6 sm:h-6" />
          Employee Profile & Directory
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Manage your personal details, government credentials, and register new personnel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Active Profile Card & Switcher */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {employee && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-sm">
                {employee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">{employee.name}</h2>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{employee.role}</p>
              <p className="text-xs text-gray-400 mt-0.5">{employee.department}</p>

              <div className="mt-5 pt-5 border-t border-gray-100 text-left space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                  <Mail size={15} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                  <Briefcase size={15} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{employee.role}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                  <Building2 size={15} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{employee.department}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                  <Clock size={15} className="text-gray-400 flex-shrink-0" />
                  <span>{employee.experience} Years Experience</span>
                </div>
              </div>
            </div>
          )}

          {/* Switch Employee Box */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2.5">Switch Active Profile</h3>
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {employees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                    emp.id === employee?.id
                      ? "bg-blue-50 text-blue-800 font-semibold border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-medium truncate">{emp.name}</p>
                    <p className="text-gray-400 text-[10px] truncate">{emp.role}</p>
                  </div>
                  {emp.id === employee?.id && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Competencies and New Registration Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Active Competencies */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
              <Award size={18} className="text-blue-600" />
              Role Assigned Competencies
            </h3>
            {loadingCompetencies ? (
              <p className="text-xs text-gray-400 py-4">Loading competencies...</p>
            ) : competencies.length === 0 ? (
              <p className="text-xs text-gray-400 py-4">No competency records found for this role.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {competencies.map((c, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{c.competency.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{c.competency.description || "Core domain competency"}</p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-600">
                      <span>Current: <strong>{(c.current_level * 10).toFixed(0)}</strong></span>
                      <span>Target: <strong>{(c.required_level * 10).toFixed(0)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Register New Employee Form */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
              <PlusCircle size={18} className="text-green-600" />
              Register New Government Employee
            </h3>

            {formMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle size={16} className="flex-shrink-0" />
                <span>{formMessage}</span>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">Govt Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya.sharma@gov.in"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MoSPI, NITI Aayog"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">Role / Designation</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  >
                    {roles.length > 0 ? (
                      roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="Statistical Officer">Statistical Officer</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Policy Consultant">Policy Consultant</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="45"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm"
              >
                {formSubmitting ? "Registering..." : "Register Employee"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
