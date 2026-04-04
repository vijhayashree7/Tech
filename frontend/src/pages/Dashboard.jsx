import React, { useRef, useState, useEffect } from 'react'; // Added useRef, useState, useEffect
import { 
  Bell as BellIcon, 
  History as HistoryIcon, 
  User as UserIcon, 
  ChevronRight,
  TrendingUp,
  Star,
  CheckCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const services = [
  { 
    id: 'carpentry', 
    name: 'Carpentry', 
    desc: 'Expert woodwork and custom furniture.', 
    image: '/carpentry.jpg' 
  },
  { 
    id: 'plumbing', 
    name: 'Plumbing', 
    desc: 'Professional leak repair and piping.', 
    image: '/plumbing.jpg' 
  },
  { 
    id: 'electrician', 
    name: 'Electrician', 
    desc: 'Safe wiring and fixture replacement.', 
    image: '/electrician.png' 
  },
  { 
    id: 'gardening', 
    name: 'Gardening', 
    desc: 'Complete premium lawn care and landscaping.', 
    image: '/gardening.png' // ORIGINAL WOMAN IMAGE RESTORED
  },
  { 
    id: 'tank-cleaning', 
    name: 'Tank Cleaning', 
    desc: 'Complete water tank sanitization.', 
    image: '/tank.jpg' 
  },
  { 
    id: 'house-keeping', 
    name: 'House Keeping', 
    desc: 'Premium home cleaning services.', 
    image: '/cleaning_man.png' 
  },
];

const ServiceCard = ({ service, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onClick={() => navigate(`/service/${service.id}`)}
      className="service-card"
    >
      <img src={service.image} alt={service.name} />
      <div className="service-card-content">
        <h4>{service.name}</h4>
        <p>{service.desc}</p>
        <div className="explore-row">
          <span>Book Now</span>
          <ChevronRight size={18} strokeWidth={2.5} />
        </div>
      </div>
    </motion.div>
  );
}

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const categoriesRef = useRef(null); // Reference for scrolling

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isProvider = user?.role === 'ServiceProvider';

  if (isProvider) {
    return (
      <div className="min-h-screen w-full relative bg-[#f8faf9]" style={{ paddingBottom: '6rem' }}>
        <nav className="dashboard-nav bg-white/80 backdrop-blur-md border-b border-[#e2e8e4]">
          <div className="nav-actions">
            <button className="nav-icon-btn"><BellIcon size={20} /></button>
            <div className="profile-avatar shadow-sm bg-[#4a6350] text-white">
              <UserIcon size={18} />
            </div>
          </div>
        </nav>

        <header className="dashboard-hero py-12">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-stylish-title text-4xl"
          >
            Partner <span style={{ color: 'var(--accent)' }}>Workspace.</span>
          </motion.h1>
          <p className="text-center text-[#4a6350] font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            Welcome back, {user.email?.split('@')[0]}
          </p>
        </header>

        <main className="max-w-[1200px] mx-auto px-6">
          {/* Provider Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Active Jobs', val: '04', icon: <ClockIcon />, color: '#3b82f6' },
              { label: 'Avg Rating', val: '4.9', icon: <Star />, color: '#f59e0b' },
              { label: 'Total Earnings', val: '₹12,450', icon: <TrendingUp />, color: '#10b981' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#e2e8e4] flex flex-col items-center text-center group hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-[#242b26] mb-1 font-['Times_New_Roman']">{stat.val}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a6350] opacity-60">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <section className="bg-white/60 backdrop-blur-md rounded-[3rem] p-10 border border-white shadow-inner text-center">
            <div className="flex flex-col items-center py-12">
               <div className="w-20 h-20 bg-[#4a6350]/10 rounded-full flex items-center justify-center text-[#4a6350] mb-6 mb-6">
                  <CheckCircle size={32} />
               </div>
               <h3 className="text-2xl font-bold text-[#242b26] mb-2">You're All Set!</h3>
               <p className="text-[#4a6350] max-w-md mx-auto leading-relaxed">
                 Your profile as a <b>{user.expertise || 'Service Professional'}</b> is active. 
                 New service requests in your area will appear here shortly.
               </p>
               <button className="mt-8 px-10 py-4 bg-[#4a6350] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-transform">
                 Refresh Jobs
               </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative" style={{ background: 'var(--stripe-1)', paddingBottom: '6rem' }}>
      
      {/* Commercial Minimalist Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-actions">
          <button className="nav-icon-btn"><BellIcon size={20} /></button>
          <button className="nav-icon-btn"><HistoryIcon size={20} /></button>
          <div className="profile-avatar shadow-sm">
            <UserIcon size={18} />
          </div>
        </div>
      </nav>

      {/* Main Luxury Hero Area (Ultra Compact) */}
      <header className="dashboard-hero">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-stylish-title"
        >
          Modern Home <span style={{ color: 'var(--accent)' }}>Excellence.</span>
        </motion.h1>
      </header>

      <main>
        {/* Compact Narrative Banner (With Smooth Scroll Action) */}
        <section className="service-mission-banner shadow-sm">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mission-heading"
          >
            Say goodbye to delays and endless searching for help.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mission-text"
          >
            Our smart platform connects you instantly with nearby trusted service professionals 
            for all your home needs — from electrical and plumbing issues to cleaning services. 
            Simply describe your problem in your preferred language and get fast, reliable, 
            and hassle-free solutions in real time, all with just a few taps.
          </motion.p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToCategories} // IMPLEMENTED SCROLL TO BOTTOM
            className="mission-cta shadow-md"
          >
            Get Started Now
          </motion.button>
        </section>

        {/* Categories Grid (Scroll Target) */}
        <section ref={categoriesRef} className="service-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
