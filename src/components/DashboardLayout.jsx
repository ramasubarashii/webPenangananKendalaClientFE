import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  FilePlus,
  UserCheck,
  CheckSquare,
  BarChart3,
  LogOut
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'service_desk': return 'Service Desk';
      case 'project_manager': return 'Project Manager';
      case 'programmer': return 'Programmer';
      case 'owner': return 'Company Owner';
      case 'client': return 'Client / Reporter';
      default: return role;
    }
  };

  const getNavigationMenu = (role) => {
    const defaultMenu = [
      { name: 'Dashboard Overview', path: '/', icon: LayoutDashboard },
      { name: 'All Tickets', path: '/tickets', icon: ClipboardList },
    ];

    switch (role) {
      case 'service_desk':
        return [
          ...defaultMenu,
          { name: 'Create Ticket', path: '/tickets/create', icon: FilePlus },
        ];
      case 'project_manager':
        return [
          ...defaultMenu,
          { name: 'Assign Ticket', path: '/tickets/assign', icon: UserCheck },
        ];
      case 'programmer':
        return [
          ...defaultMenu,
          { name: 'My Tasks', path: '/tickets/tasks', icon: CheckSquare },
        ];
      case 'owner':
        return [
          ...defaultMenu,
          { name: 'System Reports', path: '/reports', icon: BarChart3 },
        ];
      case 'client':
        return [
          { name: 'Dashboard Overview', path: '/', icon: LayoutDashboard },
          { name: 'Buat Tiket', path: '/client/create', icon: FilePlus },
          { name: 'Riwayat Tiket', path: '/tickets', icon: ClipboardList },
        ];
      default:
        return defaultMenu;
    }
  };

  const menuItems = getNavigationMenu(user?.role);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm text-left">
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              <span className="text-primary">Ticketing</span> Flow
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-2.5 rounded-sm font-bold text-[11px] uppercase tracking-wider transition-all duration-150 border-l-4 group ${
                      isActive 
                        ? 'bg-primary/5 text-primary border-primary' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent 
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive 
                            ? 'text-primary' 
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`} 
                      />
                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - User details & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0 text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate leading-tight">{user?.name}</h4>
              <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5">
                {getRoleDisplay(user?.role)}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold text-xs rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-canvas p-8 flex flex-col items-stretch">
        <Outlet />
      </main>
    </div>
  );
};
