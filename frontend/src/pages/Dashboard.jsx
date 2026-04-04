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
  const categoriesRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full relative" style={{ background: 'var(--stripe-1)', paddingBottom: '6rem' }}>
      
      {/* Commercial Minimalist Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-actions">
          <button className="nav-icon-btn"><BellIcon size={20} /></button>
          <button className="nav-icon-btn"><HistoryIcon size={20} /></button>
          <div 
            onClick={() => navigate('/profile')}
            className="profile-avatar shadow-sm cursor-pointer hover:scale-105 transition-transform"
          >
            <UserIcon size={18} />
          </div>
        </div>
      </nav>

      {/* Main Luxury Hero Area */}
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
        {/* Compact Narrative Banner */}
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
            onClick={scrollToCategories}
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
