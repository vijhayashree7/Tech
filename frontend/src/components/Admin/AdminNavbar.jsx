import React from 'react';
import { Bell, Search, User, Mail, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'Overview Dashboard';
    if (path.includes('customers')) return 'Customer Directory';
    if (path.includes('workers')) return 'Partner Management';
    if (path.includes('bookings')) return 'Live Service Logs';
    if (path.includes('feedback')) return 'Market Feedback';
    if (path.includes('analytics')) return 'Performance Insights';
    return 'Admin Console';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/40 h-24 px-10 flex items-center justify-between shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-[#242b26] tracking-tight">{getPageTitle()}</h2>
        <div className="flex items-center gap-2 text-[10px] font-black text-[#4a6350] uppercase tracking-widest opacity-60">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          System Live
        </div>
      </div>

      <div className="flex-1 max-w-md mx-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6d5a] group-focus-within:text-[#4a6350] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Quick search records..." 
            className="w-full bg-[#f4f6f0]/60 border border-white/80 rounded-2xl py-3 pl-12 pr-6 outline-none focus:bg-white focus:border-[#4a6350] focus:ring-4 focus:ring-[#4a6350]/5 transition-all text-sm font-bold tracking-wide placeholder:text-[#5d6d5a]/40 shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <div className="flex items-center gap-1.5 mr-4 p-1 bg-[#f4f6f0]/80 rounded-xl border border-white/80">
          <button className="p-2.5 text-[#5d6d5a] hover:bg-white hover:text-[#4a6350] rounded-lg transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20"></span>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-white/40 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-3 text-xs font-semibold text-[#242b26]">
              3 new workers pending approval
            </div>
          </button>
          <button className="p-2.5 text-[#5d6d5a] hover:bg-white hover:text-[#4a6350] rounded-lg transition-all">
            <Mail size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 p-2 pl-4 bg-white/80 rounded-2xl border border-white/80 shadow-md">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#242b26] tracking-tight">System Admin</p>
            <p className="text-[10px] font-extrabold text-[#4a6350] uppercase tracking-[2px] opacity-70">Privileged Account</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a6350] to-[#242b26] flex items-center justify-center text-white border-2 border-white shadow-lg overflow-hidden">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
