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

import AdminLayout from './components/Admin/AdminLayout';
import AdminOverview from './pages/Admin/AdminOverview';
import AdminCustomers from './pages/Admin/AdminCustomers';
import AdminWorkers from './pages/Admin/AdminWorkers';
import AdminBookings from './pages/Admin/AdminBookings';
import AdminFeedback from './pages/Admin/AdminFeedback';

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
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="analytics" element={<AdminOverview />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
export default App;
