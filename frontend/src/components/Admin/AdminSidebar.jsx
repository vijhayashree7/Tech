import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CalendarCheck, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Workers', path: '/admin/workers', icon: Briefcase },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-white/40 h-screen sticky top-0 flex flex-col p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-[#4a6350] rounded-xl flex items-center justify-center text-white shadow-lg">
          <Settings size={20} />
        </div>
        <span className="font-bold text-xl text-[#242b26] tracking-tight">Admin<span className="text-[#4a6350]">Portal</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/admin' 
            ? location.pathname === '/admin' || location.pathname === '/admin/'
            : location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-[#4a6350] text-[#f4f6f0] shadow-lg shadow-[#4a6350]/20 scale-[1.02]' 
                  : 'text-[#5d6d5a] hover:bg-[#4a6350]/10 hover:text-[#4a6350]'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'group-hover:bg-[#4a6350]/10'}`}>
                <Icon size={18} className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
              </div>
              <span className={`font-bold text-sm tracking-wide ${isActive ? 'text-white' : ''}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 mt-6 border-t border-[#4a6350]/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600/80 font-bold text-sm tracking-wide hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all group">
          <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
            <LogOut size={18} />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
