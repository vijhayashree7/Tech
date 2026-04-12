import React, { useState, useEffect } from 'react';
import { 
  Bell as BellIcon, 
  History as HistoryIcon, 
  User as UserIcon, 
  TrendingUp,
  Star,
  Clock as ClockIcon,
  ShieldAlert,
  ChevronRight,
  Zap,
  MapPin,
  CheckCircle,
  MoreVertical,
  Activity,
  LogOut,
  Sparkles,
  Phone as PhoneIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [jobFeed, setJobFeed] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [declinedJobs, setDeclinedJobs] = useState([]); // Track declined jobs locally
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== 'ServiceProvider') {
      navigate('/login');
    } else {
      setUser(storedUser);
      fetchJobs();
      
      // Real-time polling every 5 seconds
      const poll = setInterval(fetchJobs, 5000);
      return () => clearInterval(poll);
    }
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const resp = await axios.get('http://localhost:5005/api/requests');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      // Filter to show only active searching requests
      // AND not declined by this user session
      // AND matching the provider's expertise (case-insensitive)
      const filtered = resp.data.filter(j => {
        const isSearching = j.status === 'Searching';
        const notDeclined = !declinedJobs.includes(j._id || j.id);
        const expertiseMatch = !storedUser.expertise || 
          j.serviceType?.toLowerCase().includes(storedUser.expertise.toLowerCase()) ||
          j.type?.toLowerCase().includes(storedUser.expertise.toLowerCase());
        
        return isSearching && notDeclined && expertiseMatch;
      });
      
      setJobFeed(filtered);
    } catch (err) {
      console.error('--- Dashboard Fetch Error: ---', err);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      await axios.put(`http://localhost:5005/api/requests/${jobId}/status`, { 
        status: 'Accepted' 
      });
      setExpandedJobId(null);
      fetchJobs();
    } catch (err) {
      alert('Acceptance failed. Try again.');
    }
  };

  const handleDeclineJob = (jobId) => {
    setDeclinedJobs(prev => [...prev, jobId]);
    setExpandedJobId(null);
    setJobFeed(prev => prev.filter(j => (j._id || j.id) !== jobId));
  };

  if (!user) return null;

  return (
    <div className="provider-dashboard-container pb-20">
      {/* Floating Glass Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="provider-dashboard-nav"
      >
        <div className="provider-nav-actions">
          <div className="provider-status-badge">
            <div className={`status-dot ${isOnline ? 'status-online' : 'status-offline'}`}></div>
            {isOnline ? 'SYSTEMS ACTIVE' : 'OFFLINE'}
          </div>
          <button className="nav-icon-btn"><BellIcon size={20} /></button>
          <div 
            onClick={() => navigate('/profile')}
            className="provider-avatar-btn shadow-sm"
          >
            <UserIcon size={20} />
          </div>
        </div>
      </motion.nav>

      <main className="dashboard-main-content pt-32 px-8 max-w-[1400px] mx-auto">
        {/* Cinematic Partner Header */}
        <header className="dashboard-header-flex mb-16">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="dashboard-hero-title font-playfair"
            >
              Partner <span className="text-sage-dark">Hub.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.3 }}
              className="dashboard-subheadline mt-4"
            >
              Excellence in Service — {user.name || user.email.split('@')[0]}
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6"
          >
             <div className="text-right hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-tighter opacity-30">Current Availability</p>
                <p className="text-sm font-bold">{isOnline ? 'Active & Receiving' : 'Incognito Mode'}</p>
             </div>
             <button 
               onClick={() => setIsOnline(!isOnline)}
               className={`btn-online-toggle ${isOnline ? 'active' : 'inactive'}`}
             >
               {isOnline ? 'Go Offline' : 'Go Online'}
             </button>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Dashboard - Left Columns */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Realtime Job Feed */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold font-playfair">Incoming Requests</h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-sage-light rounded-full border border-sage-border">
                   <div className="pulse-active"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-sage-dark">Live Feed</span>
                </div>
              </div>
              
              <div className="space-y-6">
                 <AnimatePresence mode="popLayout">
                  {jobFeed.map((job, i) => {
                    const isUrgent = job.urgent || job.serviceType === 'Plumbing' || job.timeSlot === 'Urgent';
                    return (
                      <motion.div 
                        key={job._id || job.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="premium-job-card"
                      >
                        <div className="p-8">
                          {/* Card Header: Type & Status */}
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isUrgent ? 'bg-red-50 text-red-500 shadow-sm border border-red-100' : 'bg-sage-light text-sage-dark'}`}>
                                  <Zap size={28} fill={isUrgent ? 'currentColor' : 'none'} />
                               </div>
                               <div>
                                  <h4 className="text-2xl font-bold font-playfair">{job.serviceType || job.type} Service</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Incoming Request</span>
                                     {isUrgent && <span className="badge-urgent-premium">URGENT</span>}
                                  </div>
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <button 
                                 onClick={() => handleAcceptJob(job._id || job.id)}
                                 className="px-6 py-3 bg-sage-dark text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition shadow-lg shadow-sage-dark/10"
                               >
                                 Accept Job
                               </button>
                               <button 
                                 onClick={() => handleDeclineJob(job._id || job.id)}
                                 className="px-6 py-3 bg-white border border-red-100 text-red-400 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-50 transition"
                               >
                                 Decline
                               </button>
                            </div>
                          </div>

                          {/* Problem Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                             <div className="space-y-4">
                                <div>
                                   <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">Problem Description</label>
                                   <p className="text-lg italic font-medium leading-relaxed font-times text-sage-dark bg-white/40 p-5 rounded-2xl border border-white/50 shadow-inner">
                                     "{job.problem}"
                                   </p>
                                </div>
                                <div className="flex gap-6 mt-4">
                                   <div>
                                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-1">Time to Finish</label>
                                      <p className="text-sm font-bold flex items-center gap-2"><ClockIcon size={14}/> {job.timeSlot || 'Standard'}</p>
                                   </div>
                                   <div>
                                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-1">Customer Address</label>
                                      <p className="text-sm font-bold flex items-center gap-2"><MapPin size={14}/> {job.address || 'GPS Location'}</p>
                                   </div>
                                </div>
                             </div>
                             
                             {job.problemImage && (
                               <div>
                                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">Photo Proof</label>
                                  <img src={job.problemImage} className="w-full h-40 object-cover rounded-2xl shadow-md border border-white/60" alt="Proof" />
                               </div>
                             )}
                          </div>

                          {/* Live Location Section - Per Request */}
                          <div>
                             <div className="flex items-center justify-between mb-3">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block">Customer Live Location</label>
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                                   <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Live Position</span>
                                </div>
                             </div>
                             <div className="w-full h-[220px] bg-[#f0f4f1] rounded-3xl overflow-hidden border border-white shadow-xl">
                                {job.customerLocation ? (
                                  <iframe width="100%" height="100%" frameBorder="0" style={{border:0}} src={`https://maps.google.com/maps?q=${job.customerLocation.lat},${job.customerLocation.lng}&z=15&output=embed`} allowFullScreen></iframe>
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                                     <MapPin size={32} className="mb-2" />
                                     <p className="text-[10px] font-black uppercase tracking-widest">Co-ordinates not provided</p>
                                  </div>
                                )}
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>

            {/* Performance Snapshot Marina */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="stats-marina"
            >
               <div className="stats-grid">
                  {[
                    { label: 'Weekly Revenue', val: '₹4,821', icon: <TrendingUp size={24} className="text-emerald-400" /> },
                    { label: 'Avg Feedback', val: '4.85', icon: <Star size={24} className="text-amber-400" fill="currentColor" /> },
                    { label: 'Completed Jobs', val: '142', icon: <CheckCircle size={24} className="text-sky-400" /> }
                  ].map((stat, i) => (
                    <div key={i} className="stat-unit">
                       <div className="mb-4">{stat.icon}</div>
                       <h5 className="stat-value leading-none">{stat.val}</h5>
                       <p className="stat-label uppercase">{stat.label}</p>
                    </div>
                  ))}
               </div>
               <div className="abstract-glow"></div>
            </motion.section>
          </div>

          {/* Sidebar - Right Columns */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.4 }}
               className="sidebar-card"
            >
               <h4 className="sidebar-title">Security & Operations</h4>
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                     <span className="text-sm font-bold">Cloud Infrastructure Live</span>
                  </div>
                  <div className="p-6 bg-sage-light rounded-[1.5rem] border border-sage-border">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Payouts Schedule</span>
                        <ShieldAlert size={14} className="text-sage-primary" />
                     </div>
                     <p className="text-sm font-bold">Automated transfers active for Friday billing cycles.</p>
                  </div>
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.6 }}
               className="sidebar-focus-card"
            >
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Primary Domain</h4>
                  <MoreVertical size={16} className="opacity-40" />
               </div>
               <h5 className="text-3xl font-bold font-playfair mb-4">{user.expertise || 'Generalist'}</h5>
               <p className="text-sm opacity-60 leading-relaxed mb-10">
                  You are highlighted as a primary lead for premium {user.expertise || 'service'} requests in the current district.
               </p>
               <div className="pt-8 border-t border-white/10 flex items-center justify-between font-bold text-[10px] uppercase tracking-widest opacity-80">
                  <span>Coverage Area</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} /> Live Tracking</span>
               </div>
            </motion.div>

            <button 
              onClick={() => navigate('/profile')}
              className="w-full py-5 rounded-[1.5rem] border-2 border-sage-border font-black uppercase tracking-widest text-[10px] hover:bg-sage-dark hover:text-white hover:border-sage-dark transition-all duration-500"
            >
              Access Profile Management
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
