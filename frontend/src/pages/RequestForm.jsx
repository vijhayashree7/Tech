import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mic as MicIcon, 
  Phone as PhoneIcon,
  Calendar as CalendarIcon,
  Upload as UploadIcon,
  Send as SendIcon,
  X as CloseIcon,
  Globe as GlobeIcon,
  Navigation as NavIcon,
  RefreshCw as RefreshIcon,
  CheckCircle as SuccessIcon
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const RequestForm = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  
  const languages = [
    { name: 'English', code: 'en-US' },
    { name: 'தமிழ் (Tamil)', code: 'ta-IN' },
    { name: 'हिन्दी (Hindi)', code: 'hi-IN' },
    { name: 'తెలుగు (Telugu)', code: 'te-IN' },
    { name: 'ಕನ್ನಡ (Kannada)', code: 'kn-IN' },
    { name: 'മലയാളം (Malayalam)', code: 'ml-IN' },
    { name: 'বাংলা (Bengali)', code: 'bn-IN' },
    { name: 'ಮರಾಠಿ (Marathi)', code: 'mr-IN' }
  ];

  const timeSlots = [
    { label: 'Urgent / Emergency', value: 'Urgent' },
    { label: 'Morning (6 AM - 12 PM)', value: 'Morning' },
    { label: 'Afternoon (12 PM - 6 PM)', value: 'Afternoon' },
    { label: 'Evening (6 PM - 12 AM)', value: 'Evening' },
    { label: 'Not Urgent', value: 'Standard' }
  ];

  const today = new Date().toISOString().split('T')[0];

  // Forms
  const [problem, setProblem] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]); 
  const [timeSlot, setTimeSlot] = useState('');
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');
  
  // Image Upload
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Real Location
  const [location, setLocation] = useState(null); 
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState('');
  
  // Success State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState(null);

  const fetchLiveLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      setLocError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsLocating(false);
        },
        (error) => {
          setLocError('Location access denied or failed.');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocError('GPS not supported by browser.');
    }
  };

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang.code;
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setProblem(prev => prev + (prev ? ' ' : '') + text);
      };
      recognition.start();
    }
  };

  const isFormValid = problem.trim().length > 5 && date && timeSlot && phone.length >= 10 && location;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const payload = {
        userId: user?._id || user?.email || 'guest',
        serviceType: type,
        problem,
        problemImage: imagePreview,
        deadline: date,
        timeSlot,
        phoneNumber: phone,
        address: 'Current Location (GPS)'
      };

      const response = await axios.post('http://localhost:5000/api/requests/create', payload);
      
      setRequestId(response.data.request?._id || 'mock-id');
      setIsSubmitted(true);
      
      // Auto-navigate after 2 seconds
      setTimeout(() => {
        navigate(`/request-status/${response.data.request?._id || 'mock-id'}`);
      }, 2000);

    } catch (err) {
      console.error('--- Submit Error: ---', err);
      alert('Submission failed. Check backend connection.');
    }
  };

  return (
    <div className="frosted-glass-wrap">
      
      <div className="frosted-card">
        <div className="flex items-center justify-center relative mb-8">
           <button onClick={() => navigate('/dashboard')} className="absolute left-0 p-3 bg-white/40 backdrop-blur-md border border-white/60 rounded-full hover:bg-white/80 transition shadow-sm">
             <ArrowLeft size={18} className="text-[#4a6350]" />
           </button>
           <h1 className="frosted-title m-0 text-2xl">{type?.replace('-', ' ')} Service</h1>
        </div>
        
        {/* Single Column Compact Flow */}
        <div className="frosted-input-group relative">
          <label className="frosted-label font-bold">Language</label>
          <div className="relative">
            <GlobeIcon size={18} className="frosted-icon" />
            <select className="frosted-select" value={selectedLang.code} onChange={(e) => setSelectedLang(languages.find(l => l.code === e.target.value))}>
              {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>
        </div>

        <div className="frosted-input-group relative">
          <label className="frosted-label font-bold">Problem Details</label>
          <div className="relative mb-3">
            <textarea 
              className="frosted-textarea pb-12" 
              placeholder={`Type details...`}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
            <button onClick={handleVoice} className={`absolute bottom-3 right-3 p-3 rounded-xl backdrop-blur-md shadow-sm transition ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/60 text-[#4a6350]'}`}>
              <MicIcon size={20} />
            </button>
          </div>
          
          <div className="flex justify-between items-center mb-2">
             <label className="frosted-label m-0 font-bold">Photo Proof (Optional)</label>
             {imagePreview && (
               <button onClick={() => setImagePreview(null)} className="text-[10px] text-red-600 font-bold uppercase flex items-center hover:underline cursor-pointer bg-white/40 px-2 py-1 rounded-md border border-white/50">
                 <CloseIcon size={12}/> Remove
               </button>
             )}
          </div>
          {!imagePreview ? (
            <div onClick={() => fileInputRef.current.click()} className="frosted-input text-center cursor-pointer border-dashed border-2 opacity-80 hover:opacity-100 flex flex-col items-center justify-center p-4 bg-white/30" style={{paddingLeft: '1.25rem'}}>
              <UploadIcon size={20} className="mb-1 text-[#4a6350]" />
              <span className="text-xs font-bold text-[#242b26]">Attach Image</span>
              <input type="file" ref={fileInputRef} onChange={(e) => {
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result);
                reader.readAsDataURL(e.target.files[0]);
              }} hidden accept="image/*" />
            </div>
          ) : (
            <img src={imagePreview} className="frosted-thumbnail" alt="Preview Proof" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <label className="frosted-label font-bold">Date</label>
            <div className="relative">
              <CalendarIcon size={18} className="frosted-icon" style={{top: '50%'}} />
              <input type="date" min={today} className="frosted-input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="relative">
            <label className="frosted-label font-bold">Contact</label>
            <div className="relative">
              <PhoneIcon size={18} className="frosted-icon" style={{top: '50%'}} />
              <input type="tel" placeholder="Phone Number" className="frosted-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="frosted-input-group">
          <label className="frosted-label">Service Priority</label>
          <select className="frosted-select" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
             <option value="" disabled>Select Arrival Window</option>
             {timeSlots.map(slot => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
          </select>
        </div>

        {/* Live Interactive Map Fix */}
        <div className="frosted-input-group mt-2">
          <div className="flex justify-between items-center mb-2">
            <label className="frosted-label m-0">Location Sharing</label>
            {location && (
              <button onClick={fetchLiveLocation} className="text-[10px] text-[#242b26] font-bold uppercase hover:underline cursor-pointer bg-white/40 px-2 py-1 rounded-md border border-white/50">
                {isLocating ? 'Refreshing...' : 'Refresh GPS'}
              </button>
            )}
          </div>
          {!location ? (
            <button onClick={fetchLiveLocation} className="frosted-locate-btn">
              {isLocating ? <RefreshIcon className="animate-spin" size={20}/> : <NavIcon size={20}/>}
              {isLocating ? 'Acquiring GPS...' : 'Locate Me (Share Location)'}
            </button>
          ) : (
            <div className="live-map-frame">
              {/* Google Maps Embed Iframe based on GPS co-ordinates */}
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{border:0}} 
                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`} 
                allowFullScreen
              ></iframe>
            </div>
          )}
          {locError && <p className="text-red-500 text-xs font-bold mt-2 text-center uppercase">{locError}</p>}
        </div>

        <button 
          className="frosted-submit-btn" 
          disabled={!isFormValid || isSubmitted}
          onClick={handleSubmit}
        >
          {isSubmitted ? 'Submitted!' : 'Request Service'} <SendIcon size={20} />
        </button>

      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 p-12 rounded-[2rem] shadow-2xl flex flex-col items-center text-center border border-white/50"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-inner">
                <SuccessIcon size={48} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-bold text-[#242b26] mb-2 font-['Times_New_Roman']">Request Submitted</h2>
              <p className="text-sm font-bold text-[#4a6350] uppercase tracking-widest">Bridging you to the expert...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestForm;
