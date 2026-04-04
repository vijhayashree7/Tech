import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'All' || b.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'Searching': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#242b26] tracking-tight mb-2">Booking Logs</h1>
          <p className="text-[#5d6d5a] font-medium">Monitor and manage all service requests across the platform.</p>
        </div>
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-sm">
          {['All', 'Searching', 'Completed', 'Cancelled'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-[#4a6350] text-white shadow-lg' 
                  : 'text-[#5d6d5a] hover:bg-[#4a6350]/10 hover:text-[#4a6350]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 bg-white/40 animate-pulse rounded-[2rem]"></div>)
        ) : filteredBookings.map((booking) => (
          <div key={booking._id} className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/80 p-8 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute left-0 top-0 w-2 h-full bg-[#4a6350]/20 group-hover:bg-[#4a6350] transition-colors"></div>
            
            <div className="flex flex-col xl:flex-row xl:items-center gap-8">
              {/* Service Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusColor(booking.status)} shadow-sm`}>
                    {booking.status}
                  </span>
                  <p className="text-xs font-bold text-[#5d6d5a] flex items-center gap-2">
                    <Clock size={14} className="text-[#4a6350]" />
                    {new Date(booking.createdAt).toLocaleDateString()} at {booking.timeSlot}
                  </p>
                </div>
                <h3 className="text-2xl font-black text-[#242b26] tracking-tight">{booking.serviceType}</h3>
                <p className="text-sm font-semibold text-[#5d6d5a] mt-2 line-clamp-1 max-w-2xl">{booking.problem}</p>
              </div>

              {/* User and Worker Flow */}
              <div className="flex items-center gap-6 xl:border-x px-8 border-[#4a6350]/10">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#f4f6f0] mx-auto flex items-center justify-center text-[#4a6350] border border-white/80 shadow-inner mb-2">
                    <User size={20} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#4a6350] opacity-70 mb-0.5">Customer</p>
                  <p className="text-xs font-bold text-[#242b26] truncate max-w-[120px]">{booking.userId?.email?.split('@')[0] || 'Unknown'}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#4a6350]/20 to-transparent mb-1"></div>
                  <ArrowRight size={16} className="text-[#4a6350]/30" />
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#4a6350]/20 to-transparent mt-1"></div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#4a6350]/10 mx-auto flex items-center justify-center text-[#4a6350] border border-white/80 shadow-inner mb-2">
                    <Briefcase size={20} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#4a6350] opacity-70 mb-0.5">Provider</p>
                  <p className="text-xs font-bold text-[#242b26]">Verified Expert</p>
                </div>
              </div>

              {/* Location and Actions */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-start gap-2 text-sm font-bold text-[#242b26]">
                    <MapPin size={18} className="text-[#4a6350]/60 shrink-0 mt-0.5" />
                    <span>{booking.address || 'N/A'}</span>
                  </div>
                  <p className="text-[10px] font-black text-[#5d6d5a] uppercase tracking-widest mt-1 ml-6">{booking.phoneNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-12 w-12 bg-white/80 border border-white/80 rounded-2xl flex items-center justify-center text-[#5d6d5a] hover:bg-white hover:text-[#4a6350] transition-all shadow-md">
                    <MoreHorizontal size={20} />
                  </button>
                  <button className="h-12 bg-[#242b26] text-white px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-[#242b26]/30 transition-all flex items-center gap-2">
                    Visual Logs
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && !loading && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-[#f4f6f0] rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarCheck size={32} className="text-[#4a6350] opacity-40" />
          </div>
          <p className="text-xl font-bold text-[#242b26] tracking-tight">No bookings match this filter</p>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
