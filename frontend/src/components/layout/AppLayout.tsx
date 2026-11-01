import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { DemoBanner } from '../common/DemoBanner';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) {
    return (
      <div className="min-h-screen bg-[#08111F] text-slate-100 flex flex-col">
        <Navbar />
        <DemoBanner />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#08111F] text-slate-100 flex flex-col">
      <Navbar />
      <DemoBanner />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#08111F] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
