import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  MapPin, 
  LogOut, 
  ChevronLeft,
  Camera,
  Calendar,
  BadgeCheck,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isUpdatingColor, setIsUpdatingColor] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, profilePic: reader.result };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // In a real app, you'd also send this to the backend
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="profile-content-wrap"
      >
        {/* Transparent Glass Header */}
        <header className="profile-header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn back">
            <ChevronLeft size={18} />
            Back to Dashboard
          </button>
          <button onClick={handleLogout} className="nav-btn logout">
            <LogOut size={18} />
            Sign Out
          </button>
        </header>

        <div className="profile-main-grid">
          {/* Column 1: Identity Card */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="profile-sidebar-card"
          >
            <div className="avatar-container">
              <div className="avatar-image-wrap">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" />
                ) : (
                  <UserIcon size={70} className="text-[#4a6350] opacity-40" />
                )}
              </div>
              <button onClick={handleCameraClick} className="camera-trigger">
                <Camera size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
            </div>

            <h2 className="user-name-title">{user.name || user.email.split('@')[0]}</h2>
            <div className="user-badge">
              <BadgeCheck size={14} className="text-sage-primary" />
              Verified {user.role === 'ServiceProvider' ? 'Partner Agent' : 'Standard Member'}
            </div>

            <div className="user-id-box">
               <p className="id-label">Membership Identifier</p>
               <p className="id-value">#{user._id || 'MOCK-X92-001'}</p>
            </div>
          </motion.aside>

          {/* Column 2: Information Area */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="profile-content-area"
          >
            {/* Account & Security */}
            <section className="info-section-card">
              <h3 className="section-title">
                <Shield size={24} />
                Global Security & Info
              </h3>

              <div className="info-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Main Communication</span>
                  <div className="detail-content">
                    <Mail size={18} className="detail-icon" />
                    {user.email}
                  </div>
                </div>

                <div className="detail-item">
                   <span className="detail-label">Contact Reference</span>
                   <div className="detail-content">
                      <Phone size={18} className="detail-icon" />
                      {user.phone || '+91 9XXXX XXXX8'}
                   </div>
                </div>

                <div className="detail-item">
                   <span className="detail-label">Service Domain</span>
                   <div className="detail-content">
                      <ShieldAlert size={18} className="detail-icon" />
                      {user.role} Authorization
                   </div>
                </div>

                <div className="detail-item">
                   <span className="detail-label">Archive Access</span>
                   <div className="detail-content">
                      <Calendar size={18} className="detail-icon" />
                      April 2026
                   </div>
                </div>
              </div>
            </section>

            {/* Geographic Context */}
            <section className="info-section-card">
               <h3 className="section-title">
                  <MapPin size={24} />
                  Operational Location
               </h3>
               <div className="location-display">
                  <div className="location-icon bg-sage-light p-4 rounded-xl">
                     <MapPin size={24} className="text-sage-primary" />
                  </div>
                  <div className="location-text">
                     <h5>Stored Primary Address</h5>
                     <p>{user.address || 'Your geographic coordinates are currently set to default. Add an address to unlock localized service options.'}</p>
                  </div>
               </div>
            </section>

            {/* Credentials / Performance Box */}
            {user.role === 'ServiceProvider' && (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="credential-ribbon"
              >
                <div className="credential-header">
                  <h3 className="credential-title">Partner Credentials</h3>
                  <BadgeCheck size={32} className="opacity-40" />
                </div>
                <div className="credential-grid">
                   <div className="credential-item">
                      <p>Verification Method</p>
                      <p>Government ID (XXXX)</p>
                   </div>
                   <div className="credential-item">
                      <p>Expertise Domain</p>
                      <p>{user.expertise || 'General Specialist'}</p>
                   </div>
                   <div className="credential-item">
                      <p>Success Metric</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-400" />
                        <span className="font-bold">TOP RATED</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
