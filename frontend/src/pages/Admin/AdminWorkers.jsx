import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  ShieldCheck,
  Star,
  ExternalLink
} from 'lucide-react';

const AdminWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/workers');
      setWorkers(res.data);
    } catch (err) {
      console.error('Error fetching workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (email, approved) => {
    const action = approved ? 'approve' : 'reject';
    if (window.confirm(`Are you sure you want to ${action} this service provider?`)) {
      try {
        await axios.post('http://localhost:5000/api/admin/workers/approve', { email, approved });
        fetchWorkers();
      } catch (err) {
        alert('Status update failed');
      }
    }
  };

  const filteredWorkers = workers.filter(w => 
    w.email.toLowerCase().includes(search.toLowerCase()) || 
    w.expertise?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#242b26] tracking-tight mb-2">Service Partner Registry</h1>
          <p className="text-[#5d6d5a] font-medium">Verify credentials and manage approvals for service providers.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-white/80 shadow-sm">
          <div className="px-4 py-2 text-center border-r border-[#4a6350]/10">
            <p className="text-[10px] font-black text-[#4a6350] uppercase tracking-wider">Pending</p>
            <p className="text-xl font-black text-[#242b26]">{workers.filter(w => !w.isApproved).length}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-wider">Active</p>
            <p className="text-xl font-black text-[#242b26]">{workers.filter(w => w.isApproved).length}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6d5a] group-focus-within:text-[#4a6350] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, expertise, or email..." 
            className="w-full bg-[#f4f6f0]/60 border border-white/40 rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:bg-white focus:border-[#4a6350] focus:ring-4 focus:ring-[#4a6350]/5 transition-all text-sm font-semibold shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 bg-white px-6 py-3.5 rounded-2xl border border-white/80 text-sm font-extrabold text-[#4a6350] hover:bg-[#f4f6f0] transition-all shadow-sm">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-64 bg-white/40 animate-pulse rounded-3xl"></div>)
        ) : filteredWorkers.map((worker) => (
          <div key={worker._id} className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/80 p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#4a6350]/5 rounded-full blur-3xl group-hover:bg-[#4a6350]/10 transition-colors"></div>
            
            <div className="flex flex-col sm:flex-row gap-8 relative z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#4a6350] to-[#242b26] flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-2xl">
                  {worker.email[0].toUpperCase()}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                  worker.isApproved 
                    ? 'bg-green-50 text-green-700 border-green-100' 
                    : 'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                  {worker.isApproved ? 'Approved' : 'Pending Verification'}
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-[#242b26] tracking-tight">{worker.expertise || 'General Specialist'}</h3>
                    <div className="flex items-center gap-1 bg-[#4a6350]/10 px-3 py-1 rounded-lg">
                      <Star size={14} className="text-yellow-600 fill-yellow-600" />
                      <span className="text-xs font-black text-[#4a6350]">4.8</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#5d6d5a]">
                      <Mail size={16} className="text-[#4a6350]" />
                      {worker.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#5d6d5a]">
                      <Phone size={16} className="text-[#4a6350]" />
                      {worker.phone}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f4f6f0]/50 p-4 rounded-2xl border border-white/40">
                    <p className="text-[10px] font-black text-[#4a6350] uppercase tracking-wider mb-1">Aadhaar Verification</p>
                    <div className="flex items-center gap-2 text-sm font-black text-[#242b26]">
                      <ShieldCheck size={16} className="text-green-600" />
                      {worker.aadhaar || 'Linked'}
                    </div>
                  </div>
                  <div className="bg-[#f4f6f0]/50 p-4 rounded-2xl border border-white/40">
                    <p className="text-[10px] font-black text-[#4a6350] uppercase tracking-wider mb-1">Member Since</p>
                    <div className="flex items-center gap-2 text-sm font-black text-[#242b26]">
                      <Clock size={16} className="text-[#4a6350]" />
                      Jan 2024
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {!worker.isApproved ? (
                    <button 
                      onClick={() => updateStatus(worker.email, true)}
                      className="flex-1 bg-[#4a6350] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-[#4a6350]/30 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Approve Partner
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatus(worker.email, false)}
                      className="flex-1 bg-white border-2 border-red-100 text-red-600 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Revoke Access
                    </button>
                  )}
                  <button className="w-14 h-14 bg-white/80 border border-white/80 rounded-2xl flex items-center justify-center text-[#5d6d5a] hover:text-[#4a6350] hover:bg-white transition-all shadow-sm">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkers.length === 0 && !loading && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-[#f4f6f0] rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={32} className="text-[#4a6350] opacity-40" />
          </div>
          <p className="text-xl font-bold text-[#242b26] tracking-tight">No service providers found</p>
        </div>
      )}
    </div>
  );
};

export default AdminWorkers;
