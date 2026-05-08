import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, Building2, Briefcase, BarChart3, Activity, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  let navItems = [];
  const hasWriteAccess = ['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role);
  
  if (hasWriteAccess) {
    navItems = [
      { name: 'Companies', path: '/dashboard/companies', icon: Building2 },
      { name: 'Employees', path: '/dashboard/employees', icon: Users },
      { name: 'Workforces', path: '/dashboard/workforces', icon: Briefcase },
      { name: 'NPORS', path: '/dashboard/npors', icon: Activity },
      { name: 'NRSWA', path: '/dashboard/nrswa', icon: Activity },
      { name: 'EUSR', path: '/dashboard/eusr', icon: Activity },
      { name: 'In-House', path: '/dashboard/inhouse', icon: Activity },
      { name: 'NVQ', path: '/dashboard/nvq', icon: Activity },
    ];
  } else {
    navItems = [
      { name: 'Training Matrix', path: '/dashboard/matrix', icon: BarChart3 },
      { name: 'Workforces', path: '/dashboard/workforces', icon: Briefcase },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-500">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pave Training</h1>
        </div>
        
        <div className="p-4 flex-1">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
            <p className="font-medium text-slate-900 truncate">{user.name}</p>
            <p className="text-sm text-blue-400">{user.role}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-500' 
                      : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto bg-slate-50 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
