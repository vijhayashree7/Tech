import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Star, 
  User, 
  Activity, 
  Calendar,
  Quote,
  Trash2,
  Flag
} from 'lucide-react';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/feedbacks');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => 
    f.comment?.toLowerCase().includes(search.toLowerCase()) || 
    f.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#242b26] tracking-tight mb-2">Customer Feedback</h1>
          <p className="text-[#5d6d5a] font-medium">Monitor sentiment and analyze customer experience through reviews.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-white/80 shadow-sm">
          <div className="px-5 py-2 text-center border-r border-[#4a6350]/10">
            <p className="text-[10px] font-black text-yellow-600 uppercase tracking-wider">Avg Rating</p>
            <p className="text-xl font-black text-[#242b26]">4.8 <span className="text-sm font-bold text-[#5d6d5a]">/ 5</span></p>
          </div>
          <div className="px-5 py-2 text-center">
            <p className="text-[10px] font-black text-[#4a6350] uppercase tracking-wider">Sentiment</p>
            <p className="text-xl font-black text-green-600">Positive</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d6d5a] group-focus-within:text-[#4a6350] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search reviews by keyword or user..." 
            className="w-full bg-[#f4f6f0]/60 border border-white/40 rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:bg-white focus:border-[#4a6350] focus:ring-4 focus:ring-[#4a6350]/5 transition-all text-sm font-semibold shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 bg-white px-6 py-3.5 rounded-2xl border border-white/80 text-sm font-extrabold text-[#4a6350] hover:bg-[#f4f6f0] transition-all shadow-sm">
          <Filter size={18} />
          Low Ratings First
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-white/40 animate-pulse rounded-3xl"></div>)
        ) : filteredFeedbacks.map((feedback) => (
          <div key={feedback._id} className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/80 p-8 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#4a6350]/5 rounded-full blur-2xl group-hover:bg-[#4a6350]/10 transition-colors"></div>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a6350] to-[#242b26] flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-xl">
                  {feedback.userId?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-black text-[#242b26] tracking-tight">{feedback.userId?.email?.split('@')[0] || 'Member'}</p>
                  <p className="text-[10px] font-black text-[#5d6d5a] uppercase tracking-widest opacity-60">Verified Buyer</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#f4f6f0] p-1.5 rounded-xl border border-white shadow-inner">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={`${i < feedback.rating ? 'text-yellow-600 fill-yellow-600' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <Quote size={32} className="absolute -left-2 -top-2 text-[#4a6350]/10" />
              <p className="text-sm font-semibold text-[#242b26] leading-relaxed relative z-10 pl-6 italic">
                {feedback.comment || "Service was prompt and professional. Highly recommend."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#4a6350]/10 flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4a6350]">
                  <Activity size={12} />
                  {feedback.requestId?.serviceType || 'Maintenance'}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#5d6d5a] opacity-60 mt-1">
                  <Calendar size={12} />
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-xl border-2 border-red-50 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm">
                  <Flag size={18} />
                </button>
                <button className="p-2.5 rounded-xl border-2 border-gray-50 text-gray-400 hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-all shadow-sm">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFeedbacks.length === 0 && !loading && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-[#f4f6f0] rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} className="text-[#4a6350] opacity-40" />
          </div>
          <p className="text-xl font-bold text-[#242b26] tracking-tight">No feedback found</p>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
