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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [jobFeed, setJobFeed] = useState([
    { id: 1, type: 'Plumbing', problem: 'Burst kitchen pipe', dist: '1.2 km', reward: '₹450', urgent: true },
    { id: 2, type: 'Carpentry', problem: 'Door frame adjustment', dist: '3.5 km', reward: '₹300', urgent: false },
    { id: 3, type: 'Electrical', problem: 'Fuse box replacement', dist: '5.1 km', reward: '₹600', urgent: false },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== 'ServiceProvider') {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

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
                <AnimatePresence>
                  {jobFeed.map((job, i) => (
                    <motion.div 
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="job-card"
                    >
                      <div className="flex items-center gap-6">
                         <div className={`job-icon-box ${job.urgent ? 'bg-red-50 text-red-500' : 'bg-sage-light text-sage-dark'}`}>
                            <Zap size={28} fill={job.urgent ? 'currentColor' : 'none'} />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <h4 className="text-xl font-bold">{job.type} Service</h4>
                               {job.urgent && <span className="badge-urgent">Urgent</span>}
                            </div>
                            <p className="text-sm opacity-60 font-medium mb-3">{job.problem}</p>
                            <div className="flex items-center gap-6 text-[10px] uppercase font-black tracking-widest opacity-30">
                               <span className="flex items-center gap-1.5"><MapPin size={12} /> {job.dist} Local Radius</span>
                               <span className="flex items-center gap-1.5"><Sparkles size={12} /> {job.reward} Projected</span>
                            </div>
                         </div>
                      </div>
                      <button className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center hover:bg-sage-primary hover:text-white transition-all shadow-sm">
                        <ChevronRight size={24} />
                      </button>
                    </motion.div>
                  ))}
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
