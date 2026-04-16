import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f4f6f0] antialiased">
      {/* Dynamic Background Layer */}
      <div 
        className="fixed inset-0 z-[-1] opacity-20 pointer-events-none grayscale-[0.3]"
        style={{ 
          backgroundImage: "url('/admin_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(20px) saturate(0.8)'
        }}
      ></div>

      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
