import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import RequestForm from './pages/RequestForm';
import LocationPage from './pages/LocationPage';
import RequestStatus from './pages/RequestStatus';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth initialLogin={false} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/service/:type" element={<RequestForm />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/request-status/:id" element={<RequestStatus />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
