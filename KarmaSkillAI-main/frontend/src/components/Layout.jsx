import { useState } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard, ClipboardList, BookOpen,
  TrendingUp, Lightbulb, User, Settings, LogOut, Bell,
  Menu, X
} from "lucide-react"

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/assessments", icon: ClipboardList, label: "Assessments" },
  { to: "/learning", icon: BookOpen, label: "Learning" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/recommendations", icon: Lightbulb, label: "Recommendations" },
  { to: "/profile", icon: User, label: "Profile" },
]

export default function Layout({ children, employees = [], selectedId, onSelect }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const selected = employees.find(e => e.id === selectedId)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo & Close Button */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">K</span>
            </div>
            <div>
              <p className="font-bold text-blue-700 leading-none text-sm">KarmaSkill <span className="text-purple-600">AI</span></p>
              <p className="text-gray-400 text-[10px] leading-none mt-0.5">Learn. Grow. Serve Better.</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
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

        {/* Bottom actions */}
        <div className="px-3 py-3 border-t border-gray-100 space-y-1">
          <NavLink
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Settings size={17} /> Settings
          </NavLink>
          <button
            onClick={() => { setMobileOpen(false); navigate("/") }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>

        {/* Branding Footer */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
              alt="India"
              className="w-6 h-4 rounded-sm object-cover"
            />
            <p className="text-[11px] text-gray-400">A Smarter, Skilled India</p>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between flex-shrink-0 gap-2">
          <div className="flex items-center gap-2">
            {/* Hamburger Button for mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 sm:py-2 bg-gray-100 rounded-full text-xs sm:text-sm w-36 sm:w-56 md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              />
              <svg className="absolute left-2.5 top-2 sm:top-2.5 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* User selector & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <Bell size={18} className="sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <select
                value={selectedId || ""}
                onChange={e => onSelect(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 max-w-[110px] sm:max-w-[160px] truncate"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>

              {selected && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                    {selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs sm:text-sm font-semibold leading-none">{selected.name}</p>
                    <p className="text-[10px] text-gray-500 leading-none mt-0.5 truncate max-w-[100px]">{selected.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 flex items-center justify-around z-30">
          {NAV.slice(0, 5).map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon size={18} className={isActive ? "stroke-[2.5]" : "stroke-[1.75]"} />
                <span className="mt-0.5">{label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
