import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin as MapPinIcon, 
  Navigation as NavigationIcon, 
  CheckCircle2, 
  ShieldCheck,
  Send as SendIcon,
  MessageSquare,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LocationPage = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(true);
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Simulate searching for provider
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ position: 'relative', background: 'var(--stripe-1)' }}>
      {/* Cinematic Sage Background */}
      <div className="moving-bg-container">
        <div className="moving-bg" style={{ opacity: 0.1 }} />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white/95 p-8 z-50 flex items-center justify-between border-b-4 shadow-lg" style={{ backdropFilter: 'blur(16px)', borderColor: 'var(--stripe-2)' }}>
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-full border-2 border-sage-light cursor-pointer">
          <ArrowLeft size={32} style={{ color: 'var(--stripe-4)' }} />
        </motion.button>
        <div className="text-center">
          <h1 className="text-sm font-extrabold uppercase tracking-widest text-[#5d6d5a]">Tracking Center</h1>
          <p className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--stripe-4)' }}>{isSearching ? 'Searching...' : 'Provider Accepted'}</p>
        </div>
        <div style={{ width: '48px' }} />
      </div>

      {/* Map View Placeholder */}
      <div className="w-full relative overflow-hidden flex items-center justify-center p-8" style={{ height: '55vh', marginTop: '110px', borderRadius: '0 0 60px 60px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        {/* Placeholder Map Grid */}
        <div className="absolute inset-0 z-0 opacity-30" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(12, 1fr)' }}>
          {Array.from({length: 144}).map((_, i) => (
            <div key={i} style={{ border: '1.5px solid var(--stripe-3)' }}></div>
          ))}
        </div>

        {/* User Location Marker */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute z-20"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="rounded-full shadow-2xl animate-pulse" style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--accent-blue)', border: '6px solid white' }} />
          <div className="rounded-full absolute flex items-center justify-center" style={{ width: '8rem', height: '8rem', backgroundColor: 'rgba(0, 74, 124, 0.1)', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: -1, animation: 'ping 2.5s infinite' }} />
        </motion.div>

        {!isSearching ? (
          /* Provider Location Marker (Simulated Movement) */
          <motion.div 
            initial={{ left: '25%', top: '30%' }}
            animate={{ left: '46%', top: '46%' }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute z-30"
          >
            <div className="p-5 rounded-full shadow-2xl border-4 border-white" style={{ backgroundColor: 'var(--stripe-4)' }}>
              <NavigationIcon className="text-white fill-current" size={36} strokeWidth={2.5} />
            </div>
          </motion.div>
        ) : (
          <div className="z-10 flex flex-col items-center">
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: 'var(--stripe-4)', marginBottom: '2rem' }}
            >
              <Activity size={72} strokeWidth={2.5} />
            </motion.div>
            <p className="font-extrabold text-2xl tracking-widest uppercase" style={{ color: 'var(--stripe-4)' }}>Connecting to Provider...</p>
          </div>
        )}
      </div>

      {/* Action Sheet */}
      <div className="px-12 py-14 shadow-2xl relative z-40" style={{ marginTop: '-5rem', minHeight: '65vh', borderTopLeftRadius: '80px', borderTopRightRadius: '80px', background: 'white', border: '4px solid var(--stripe-2)', borderBottom: 'none' }}>
        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 max-w-2xl m-auto"
          >
            <div className="flex items-center space-x-10 p-10 rounded-3xl border-2 shadow-xl" style={{ backgroundColor: 'var(--stripe-1)', borderColor: 'var(--stripe-2)' }}>
              <div className="rounded-3xl flex items-center justify-center text-white shadow-2xl" style={{ width: '6rem', height: '6rem', backgroundColor: 'var(--stripe-4)' }}>
                <ShieldCheck size={48} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-extrabold text-primary mb-2">Safety Verified</h3>
                <p className="text-xl text-[#5d6d5a] font-semibold tracking-wide">Professional partner verified by Abirami Labs.</p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="flex items-center space-x-4 text-sm font-black uppercase tracking-widest text-[#5d6d5a]">
                <MessageSquare size={24} />
                <span>Special Instructions</span>
              </label>
              <textarea 
                placeholder="Ex: Please bring the extra ladder..."
                className="glow-input"
                style={{ 
                  minHeight: '180px', 
                  padding: '1.75rem',
                  fontSize: '1.2rem'
                }}
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.03 }}
              onClick={handleSubmit}
              className="glow-btn text-2xl py-7"
            >
              <span>Submit Final Request</span>
              <SendIcon size={32} style={{ marginLeft: '1rem' }} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center space-y-10"
          >
            <div className="rounded-full flex items-center justify-center text-white shadow-2xl" style={{ width: '10rem', height: '10rem', backgroundColor: 'var(--stripe-4)', border: '15px solid var(--stripe-1)' }}>
              <CheckCircle2 size={96} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-5xl font-extrabold text-primary tracking-tight">Request Confirmed!</h2>
              <p className="mt-6 m-auto text-2xl font-bold tracking-widest text-[#5d6d5a]" style={{ maxWidth: '32rem' }}>Stay on this page. Your location data is being securely shared.</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/dashboard')}
              className="px-16 py-6 rounded-3xl font-black text-xl shadow-2xl"
              style={{ backgroundColor: 'var(--stripe-4)', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Back Home
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
