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
        const response = await axios.get(`http://localhost:5005/api/requests/${id}`);
        setRequest(response.data);
      } catch (err) {
        if (id.startsWith('mock-') || id === 'mock-id') {
          setRequest({
            problem: 'Request details are currently being processed. Please wait...',
            timeSlot: 'Standard',
            deadline: new Date().toISOString(),
            status: 'Searching',
            serviceType: 'Maintenance'
          });
        } else {
          setError('Request not found or system offline.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="frosted-glass-wrap"><Activity className="animate-spin text-white" size={48} /></div>;

  return (
    <div className="frosted-glass-wrap">
      <div className="request-status-card">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white/40 backdrop-blur-md rounded-full shadow-sm hover:bg-white/80 transition">
            <ArrowLeft size={20} className="text-[#4a6350]" />
          </button>
          <div className="text-right">
            <span className="font-times text-[10px] font-black text-[#4a6350] uppercase tracking-[0.2em] opacity-40">Service ID</span>
            <p className="font-times text-xs font-black text-[#242b26]">#{id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center mb-10">
          <div className={`px-8 py-4 rounded-3xl flex items-center space-x-3 shadow-xl border-2 ${
            request?.status === 'Completed' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-blue-50 border-blue-400 text-blue-700 animate-pulse'
          }`}>
            {request?.status === 'Completed' ? <CheckCircle2 size={24} /> : <Activity size={24} />}
            <span className="text-xl font-bold uppercase tracking-widest">
              {request?.status === 'Searching' ? 'Request Pending' : request?.status}
            </span>
          </div>
        </div>

        <div className="space-y-10 mt-4 h-full">
          <div className="status-info-box shadow-inner">
             <div className="flex items-center gap-3 mb-4">
               <MessageSquare size={16} className="text-[#4a6350]" />
               <h3 className="font-times text-[10px] font-black uppercase tracking-widest opacity-60">Problem Description</h3>
             </div>
             <p className="font-times text-xl italic font-medium leading-relaxed">"{request?.problem}"</p>
          </div>

          <div className="status-info-box">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={16} className="text-[#4a6350]" />
              <h3 className="font-times text-[10px] font-black uppercase tracking-widest opacity-60">Scheduled Date</h3>
            </div>
            <p className="font-times text-sm font-black">{new Date(request?.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>

          <div className="status-info-box">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={16} className="text-[#4a6350]" />
              <h3 className="font-times text-[10px] font-black uppercase tracking-widest opacity-60">Arrival Window</h3>
            </div>
            <p className="font-times text-sm font-black">{request?.timeSlot}</p>
          </div>

          <div className="status-info-box">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#4a6350]" />
                  <h3 className="font-times text-[10px] font-black uppercase tracking-widest opacity-60">Live Agent Tracking</h3>
                </div>
                <span className="live-badge-premium">LIVE</span>
             </div>
             <div className="map-container-premium h-[180px]">
                {request?.customerLocation ? (
                  <iframe width="100%" height="100%" frameBorder="0" style={{border:0}} src={`https://maps.google.com/maps?q=${request.customerLocation.lat},${request.customerLocation.lng}&z=15&output=embed`} allowFullScreen></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#f0f4f1]">
                     <Activity size={32} className="animate-pulse text-[#4a6350] opacity-30" />
                     <p className="font-times text-[10px] font-black uppercase tracking-[0.3em] mt-4 opacity-40">Acquiring GPS Signal...</p>
                  </div>
                )}
             </div>
             <p className="text-center text-[10px] font-times font-black uppercase opacity-40 mt-4 tracking-widest italic">Connecting to nearest available expert...</p>
          </div>
        </div>

        <button onClick={() => navigate('/dashboard')} className="premium-return-btn">
          <ArrowLeft size={16} /> Return to Dashboard
        </button>

      </div>
    </div>
  );
};

export default RequestStatus;
