import { History, BookOpen, LogOut, ChevronLeft, ChevronRight, LayoutDashboard, Briefcase, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import Logo from '../common/Logo'
import { useAuthStore } from '../../stores/useAuthStore'

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'new-analysis', label: 'New Analysis', icon: PlusCircle },
  { id: 'history', label: 'History', icon: History },
  { id: 'learning', label: 'Learning Hub', icon: BookOpen },
  { id: 'jobs', label: 'Live Jobs', icon: Briefcase },
]

/**
 * Navigation Sidebar component for dashboard view.
 */
const Sidebar = ({ activeSection, onSectionChange }) => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex flex-col h-screen bg-white border-r border-[#e2e8f0] transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-5 border-b border-[#e2e8f0] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <Logo size="sm" linkTo="/dashboard" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-all cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#f1f5f9] text-[#0f172a] font-semibold'
                  : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[#e2e8f0] px-3 py-4">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#0f172a] truncate">{user?.fullName}</p>
              <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-[#64748b] hover:bg-red-50 hover:text-red-600 transition-all duration-150 cursor-pointer shrink-0"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={logout}
              className="p-2 rounded-lg text-[#64748b] hover:bg-red-50 hover:text-red-600 transition-all duration-150 cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
