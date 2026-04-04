import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProviderDashboard from './pages/ProviderDashboard'; // Added
import Profile from './pages/Profile'; // Added
import RequestForm from './pages/RequestForm';
import LocationPage from './pages/LocationPage';
import RequestStatus from './pages/RequestStatus';

// Smart Dashboard Router Component
const DashboardRouter = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  return user.role === 'ServiceProvider' ? <ProviderDashboard /> : <Dashboard />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth initialLogin={false} />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/service/:type" element={<RequestForm />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/request-status/:id" element={<RequestStatus />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
