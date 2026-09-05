import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, ClipboardList, BookOpen,
  TrendingUp, Lightbulb, User, Settings, LogOut, Bell
} from "lucide-react"

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/assessments", icon: ClipboardList, label: "Assessments" },
  { to: "/learning", icon: BookOpen, label: "Learning" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/recommendations", icon: Lightbulb, label: "Recommendations" },
  { to: "/profile", icon: User, label: "Profile" },
]

export default function Layout({ children, employees, selectedId, onSelect }) {
  const navigate = useNavigate()
  const selected = employees.find(e => e.id === selectedId)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">K</span>
            </div>
            <div>
              <p className="font-bold text-blue-700 leading-none text-sm">KarmaSkill <span className="text-purple-600">AI</span></p>
              <p className="text-gray-400 text-xs leading-none mt-0.5">Learn. Grow. Serve Better.</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100 space-y-1">
          <NavLink to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            <Settings size={17} /> Settings
          </NavLink>
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            <LogOut size={17} /> Logout
          </button>
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="w-8 h-5 rounded-sm object-cover" />
            <p className="text-xs text-gray-400">A Smarter, Skilled India</p>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for skills, courses, assessments..."
              className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-2">
              <select
                value={selectedId}
                onChange={e => onSelect(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              {selected && (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {selected.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold leading-none">{selected.name}</p>
                    <p className="text-xs text-gray-500 leading-none mt-0.5">{selected.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
