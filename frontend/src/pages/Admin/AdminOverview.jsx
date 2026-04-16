import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Briefcase, 
  CalendarCheck, 
  MessageSquare, 
  XCircle, 
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalWorkers: 0,
    totalBookings: 0,
    totalFeedbacks: 0,
    cancelledBookings: 0,
    activeBookings: 0
  });

  const chartData = [
    { name: 'Mon', bookings: 12, users: 5 },
    { name: 'Tue', bookings: 19, users: 8 },
    { name: 'Wed', bookings: 15, users: 12 },
    { name: 'Thu', bookings: 22, users: 10 },
    { name: 'Fri', bookings: 30, users: 15 },
    { name: 'Sat', bookings: 28, users: 20 },
    { name: 'Sun', bookings: 18, users: 12 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const cards = [
    { name: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%', isUp: true },
    { name: 'Service Providers', value: stats.totalWorkers, icon: Briefcase, color: 'text-[#4a6350]', bg: 'bg-[#4a6350]/10', trend: '+4.2%', isUp: true },
    { name: 'Active Bookings', value: stats.activeBookings, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+8.1%', isUp: true },
    { name: 'Total Revenue', value: '₹42,850', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', trend: '+15.3%', isUp: true },
    { name: 'Cancelled Bookings', value: stats.cancelledBookings, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', trend: '-2.4%', isUp: false },
    { name: 'Total Feedbacks', value: stats.totalFeedbacks, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+5.0%', isUp: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#242b26] tracking-tight mb-2">Metrics Overview</h1>
          <p className="text-[#5d6d5a] font-medium">Real-time performance analytics for your service ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white/80 border border-white/80 rounded-xl px-4 py-2.5 text-sm font-bold text-[#4a6350] shadow-sm focus:outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>All Time</option>
          </select>
          <button className="bg-[#4a6350] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95">
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#4a6350]/5 rounded-full blur-2xl group-hover:bg-[#4a6350]/10 transition-colors"></div>
              <div className="flex items-start justify-between relative z-10">
                <div className={`p-3.5 rounded-2xl ${card.bg} ${card.color} shadow-inner`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${card.isUp ? 'text-green-600' : 'text-red-500'}`}>
                  {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{card.trend}</span>
                </div>
              </div>
              <div className="mt-6 relative z-10">
                <p className="text-[#5d6d5a] text-sm font-bold tracking-wide uppercase opacity-70 mb-1">{card.name}</p>
                <h3 className="text-4xl font-black text-[#242b26] tracking-tighter">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#242b26]">Booking Growth</h3>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#4a6350]"></span><span className="text-[#5d6d5a]">Requests</span></div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a6350" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4a6350" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4a6350" strokeOpacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5d6d5a', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5d6d5a', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: 'white'}}
                  cursor={{stroke: '#4a6350', strokeWidth: 2, strokeDasharray: '5 5'}}
                />
                <Area type="monotone" dataKey="bookings" stroke="#4a6350" strokeWidth={4} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#242b26]">New Users vs Workers</h3>
            <button className="text-[#4a6350] hover:underline text-xs font-bold uppercase tracking-widest">Details</button>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4a6350" strokeOpacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5d6d5a', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5d6d5a', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#4a6350', fillOpacity: 0.05}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: 'white'}}
                />
                <Bar dataKey="users" fill="#4a6350" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
