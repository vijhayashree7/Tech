import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  UserX, 
  CheckCircle, 
  AlertCircle,
  Download,
  Trash2
} from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (email) => {
    if (window.confirm('Are you sure you want to change this customer\'s status?')) {
      try {
        await axios.post('http://localhost:5000/api/admin/users/toggle-block', { email });
        fetchCustomers();
      } catch (err) {
        alert('Action failed');
      }
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#242b26] tracking-tight mb-2">Customer Base</h1>
          <p className="text-[#5d6d5a] font-medium">Manage and monitor customer accounts and access permissions.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/80 border border-white/80 text-[#242b26] px-5 py-3 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all">
          <Download size={18} />
          Export Directory
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6d5a] group-focus-within:text-[#4a6350] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by email or phone..." 
            className="w-full bg-[#f4f6f0]/60 border border-white/40 rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:bg-white focus:border-[#4a6350] focus:ring-4 focus:ring-[#4a6350]/5 transition-all text-sm font-semibold shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white px-6 py-3.5 rounded-2xl border border-white/80 text-sm font-extrabold text-[#4a6350] hover:bg-[#f4f6f0] transition-all shadow-sm">
            <Filter size={18} />
            Filters
          </button>
          <button className="bg-[#242b26] text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
            Bulk Action
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/80 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#4a6350]/5">
              <th className="px-8 py-6 text-xs font-black text-[#4a6350] uppercase tracking-[0.2em] border-b border-[#4a6350]/10">Customer Profile</th>
              <th className="px-8 py-6 text-xs font-black text-[#4a6350] uppercase tracking-[0.2em] border-b border-[#4a6350]/10">Contact Info</th>
              <th className="px-8 py-6 text-xs font-black text-[#4a6350] uppercase tracking-[0.2em] border-b border-[#4a6350]/10">Location</th>
              <th className="px-8 py-6 text-xs font-black text-[#4a6350] uppercase tracking-[0.2em] border-b border-[#4a6350]/10">Status</th>
              <th className="px-8 py-6 text-xs font-black text-[#4a6350] uppercase tracking-[0.2em] border-b border-[#4a6350]/10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4a6350]/5">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="px-8 py-10"><div className="h-4 bg-[#4a6350]/10 rounded-full w-full"></div></td>
                </tr>
              ))
            ) : filteredCustomers.map((customer) => (
              <tr key={customer._id} className="hover:bg-white transition-colors group">
                <td className="px-8 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a6350] to-[#242b26] flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-xl">
                      {customer.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-[#242b26] tracking-tight">{customer.email.split('@')[0]}</p>
                      <p className="text-xs text-[#5d6d5a] font-bold opacity-60">ID: {customer._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#242b26]">
                      <Mail size={14} className="text-[#4a6350]" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#5d6d5a]">
                      <Phone size={14} className="text-[#4a6350] opacity-70" />
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#242b26]">
                    <MapPin size={16} className="text-[#4a6350]" />
                    {customer.address || 'N/A'}
                  </div>
                </td>
                <td className="px-8 py-8">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${
                    customer.isBlocked 
                      ? 'bg-red-50 text-red-600 border-red-100' 
                      : 'bg-green-50 text-green-700 border-green-100'
                  }`}>
                    {customer.isBlocked ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                    {customer.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-8 py-8 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => toggleBlock(customer.email)}
                      className={`p-2.5 rounded-xl border-2 transition-all ${
                        customer.isBlocked 
                          ? 'border-green-100 text-green-600 hover:bg-green-600 hover:text-white' 
                          : 'border-red-100 text-red-600 hover:bg-red-600 hover:text-white'
                      }`}
                      title={customer.isBlocked ? 'Unblock User' : 'Block User'}
                    >
                      <UserX size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl border-2 border-gray-100 text-gray-500 hover:bg-gray-600 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && !loading && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-[#f4f6f0] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-[#4a6350] opacity-40" />
            </div>
            <p className="text-xl font-bold text-[#242b26] tracking-tight">No customers found</p>
            <p className="text-[#5d6d5a] font-medium mt-1">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
