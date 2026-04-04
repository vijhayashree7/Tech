import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, Eye, EyeOff, CheckSquare, Square, Briefcase, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Auth = ({ initialLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'User',
    aadhaar: '',
    expertise: '',
    adminKey: ''
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const response = await axios.post(`http://localhost:5005/api/auth/${endpoint}`, formData);
      
      if (isLogin) {
        const user = response.data.user || formData;
        localStorage.setItem('token', response.data.token || 'mock-token');
        localStorage.setItem('user', JSON.stringify(user));
        
        // Specialized Role-Based Redirection
        if (user.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setIsLogin(true);
        setError('Signup successful! Please Sign In now.');
      }
    } catch (err) {
      console.error('--- Critical Auth failure: ---', err);
      if (err.response?.status === 404 && isLogin) {
        setError('Email not registered. Please Sign Up first.');
      } else if (err.response?.status === 401) {
        setError('Invalid credentials. Check email/password.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.msg || 'User already exists.');
      } else {
        setError('Connection failure. Retrying with Mock DB...');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-centering" style={{ minHeight: '100vh', padding: '1.5rem' }}>
      {/* Cinematic Sage Background */}
      <div className="moving-bg-container">
        <div className="moving-bg" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glow-glass-card shadow-2xl"
      >
        <div className="auth-avatar">
          <User size={38} strokeWidth={3} />
        </div>

        <h1 className="auth-title">{isLogin ? 'Sign In' : (formData.role === 'User' ? 'Sign Up' : 'Partner Sign Up')}</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Enter your credentials to enter the agency' : (formData.role === 'User' ? 'Create an account to join Abirami Agency' : 'Join as a Service Partner')}
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8 px-2">
          <button 
            type="button"
            className={`px-4 py-2 rounded-full text-[10px] font-black transition-all border-2 ${formData.role === 'User' ? 'bg-[#4a6350] text-white border-[#4a6350] shadow-lg' : 'bg-white/30 text-[#4a6350] border-transparent'}`}
            onClick={() => setFormData({...formData, role: 'User'})}
          >
            USER
          </button>
          <button 
            type="button"
            className={`px-4 py-2 rounded-full text-[10px] font-black transition-all border-2 ${formData.role === 'ServiceProvider' ? 'bg-[#4a6350] text-white border-[#4a6350] shadow-lg' : 'bg-white/30 text-[#4a6350] border-transparent'}`}
            onClick={() => setFormData({...formData, role: 'ServiceProvider'})}
          >
            SERVICE PROVIDER
          </button>
          <button 
            type="button"
            className={`px-4 py-2 rounded-full text-[10px] font-black transition-all border-2 ${formData.role === 'Admin' ? 'bg-[#242b26] text-white border-[#242b26] shadow-lg' : 'bg-white/30 text-[#242b26] border-transparent'}`}
            onClick={() => setFormData({...formData, role: 'Admin'})}
          >
            ADMIN
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 rounded-xl text-sm font-bold shadow-inner"
            style={{ 
              backgroundColor: '#fee2e2', 
              color: '#d64141', 
              border: '2px solid #f87171' 
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {!isLogin && (
            <div className="glow-input-container">
              <User className="input-icon" size={20} strokeWidth={3} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                className="glow-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="glow-input-container">
            <Mail className="input-icon" size={20} strokeWidth={3} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="glow-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div className="glow-input-container">
              <Phone className="input-icon" size={20} strokeWidth={3} />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                required
                className="glow-input"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          )}

          <div className="glow-input-container">
            <Lock className="input-icon" size={20} strokeWidth={3} />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              required
              className="glow-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button" 
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
            </button>
          </div>

          {!isLogin && formData.role === 'ServiceProvider' && (
            <>
              <div className="glow-input-container">
                <ShieldCheck className="input-icon" size={20} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Aadhaar ID (12 digits)" 
                  required
                  className="glow-input"
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                />
              </div>
              <div className="glow-input-container">
                <Briefcase className="input-icon" size={20} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Field of Expertise" 
                  required
                  className="glow-input"
                  value={formData.expertise}
                  onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                />
              </div>
            </>
          )}

          {!isLogin && formData.role === 'Admin' && (
            <div className="glow-input-container">
              <ShieldCheck className="input-icon" size={20} strokeWidth={3} />
              <input 
                type="password" 
                placeholder="Manager Access Key" 
                required
                className="glow-input bg-yellow-50/10"
                value={formData.adminKey}
                onChange={(e) => setFormData({...formData, adminKey: e.target.value})}
              />
            </div>
          )}

          {isLogin && (
            <div className="checkbox-row">
              <div 
                className="flex items-center space-x-3 cursor-pointer group" 
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe ? <CheckSquare size={20} className="text-[#648067]" strokeWidth={3} /> : <Square size={20} strokeWidth={3} />}
                <span className="group-hover:text-primary transition-colors">Remember me</span>
              </div>
              <a href="#" className="auth-link">Forgot Password?</a>
            </div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="glow-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : (isLogin ? 'Sign In Now' : 'Join Agency')}
          </motion.button>
        </form>

        <div className="mt-10 text-sm font-bold">
          <span style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button 
            onClick={handleToggle}
            className="auth-link"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
