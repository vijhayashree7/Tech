import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Calendar,
  MessageSquare,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const RequestStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
        setRequest(response.data);
      } catch (err) {
        console.error('--- Status Fetch Error: ---', err);
        
        // Handle mock data explicitly even on error
        if (id.startsWith('mock-') || id === 'mock-id') {
          setRequest({
            problem: 'Request details are currently being processed. Please wait...',
            timeSlot: 'Standard',
            deadline: new Date().toISOString(),
            status: 'Searching',
            serviceType: 'Maintenance'
          });
          setError(null);
        } else {
          setError('Request not found or system offline.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="frosted-glass-wrap flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <Activity size={48} className="text-[#4a6350]" />
      </motion.div>
    </div>
  );

  if (error && !request) return (
    <div className="frosted-glass-wrap flex flex-col items-center justify-center">
      <AlertCircle size={64} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-white/70 mb-6">{error}</p>
      <button onClick={() => navigate('/dashboard')} className="frosted-submit-btn max-w-[200px]">
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="frosted-glass-wrap">
      <div className="frosted-card max-w-[600px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white/40 backdrop-blur-md rounded-full hover:bg-white/80 transition">
            <ArrowLeft size={20} className="text-[#4a6350]" />
          </button>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#4a6350] uppercase tracking-[0.2em]">Service ID</span>
            <p className="text-xs font-bold text-[#242b26]">#{id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center mb-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-8 py-4 rounded-3xl flex items-center space-x-3 shadow-xl border-2 ${
              request.status === 'Completed' ? 'bg-green-100 border-green-500 text-green-700' : 
              'bg-blue-50 border-blue-400 text-blue-700 animate-pulse'
            }`}
          >
            {request.status === 'Completed' ? <CheckCircle2 size={24} /> : <Activity size={24} />}
            <span className="text-xl font-bold uppercase tracking-widest">
              {request.status === 'Searching' ? 'Request Pending' : request.status}
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          <div className="bg-white/30 backdrop-blur-sm p-6 rounded-3xl border border-white/40">
             <div className="flex items-center space-x-3 mb-4">
               <MessageSquare size={18} className="text-[#4a6350]" />
               <h3 className="text-sm font-bold uppercase tracking-wider text-[#4a6350]">Problem Description</h3>
             </div>
             <p className="text-[#242b26] font-medium leading-relaxed italic">"{request.problem}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/30 backdrop-blur-sm p-5 rounded-3xl border border-white/40">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar size={18} className="text-[#4a6350]" />
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#4a6350]">Date</h3>
              </div>
              <p className="text-sm font-bold text-[#242b26]">{new Date(request.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            
            <div className="bg-white/30 backdrop-blur-sm p-5 rounded-3xl border border-white/40">
              <div className="flex items-center space-x-3 mb-2">
                <Clock size={18} className="text-[#4a6350]" />
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#4a6350]">Arrival Slot</h3>
              </div>
              <p className="text-sm font-bold text-[#242b26]">{request.timeSlot}</p>
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-sm p-6 rounded-3xl border border-white/40">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin size={18} className="text-[#4a6350]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#4a6350]">Live Agent Tracking</h3>
                </div>
                <span className="text-[10px] bg-yellow-400/80 px-2 py-1 rounded font-bold text-[#242b26] animate-pulse">LIVE</span>
             </div>
             <div className="mt-4 h-[120px] rounded-2xl overflow-hidden grayscale opacity-60">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600" 
                  alt="map" 
                  className="w-full h-full object-cover"
                />
             </div>
             <p className="text-center text-[10px] mt-4 font-bold text-[#4a6350] uppercase opacity-60">Connecting to nearest available expert...</p>
          </div>

        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-10 w-full p-5 bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-3xl text-[#4a6350] font-bold uppercase tracking-[0.2em] shadow-lg transition"
        >
          Return to Dashboard
        </button>

      </div>
    </div>
  );
};

export default RequestStatus;
