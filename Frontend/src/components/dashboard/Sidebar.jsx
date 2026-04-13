import { FilePlus2, History, BookOpen, LogOut, ChevronLeft, ChevronRight, BarChart3, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import Logo from '../common/Logo'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'new-analysis', label: 'New Analysis', icon: FilePlus2 },
  { id: 'history', label: 'History', icon: History },
  { id: 'learning', label: 'Learning Skills', icon: BookOpen },
]

const Sidebar = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`flex flex-col h-screen bg-white border-r border-border transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-5 border-b border-border ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <Logo size="sm" linkTo="/dashboard" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary transition-all cursor-pointer"
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-primary-600' : ''} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User section */}
      <div className={`border-t border-border px-3 py-4 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user?.fullName}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-danger transition-all duration-200 cursor-pointer ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
