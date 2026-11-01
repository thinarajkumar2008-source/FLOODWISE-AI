import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Waves, 
  Layers, 
  Bell, 
  HelpCircle, 
  ExternalLink, 
  Database,
  ShieldAlert,
  Search
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <header className="bg-[#0D192B] border-b border-slate-800 text-slate-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-lg">FLOODWISE <span className="text-cyan-400">AI</span></span>
                <span className="text-[10px] uppercase font-semibold bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/80">
                  SIH26161
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight leading-none">Hydrodynamic Dam-Break Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-3">
          {/* Active study chip */}
          <div className="hidden md:flex items-center gap-2 bg-[#122238] border border-slate-700/60 rounded-full px-3 py-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Active Basin:</span>
            <span className="text-cyan-300 font-medium">Tawa River Basin (Hoshangabad)</span>
          </div>

          {/* Quick links */}
          <Link
            to="/map"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 transition"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map Viewer</span>
          </Link>

          <Link
            to="/alerts"
            className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 transition relative"
            title="Alerts Center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-[#0D192B]"></span>
          </Link>

          <Link
            to="/settings"
            className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition"
            title="Documentation & Settings"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          {isLanding ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-semibold text-xs px-3.5 py-1.5 rounded-md transition shadow-md shadow-cyan-500/20"
            >
              Open Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded transition flex items-center gap-1"
            >
              <span>Landing</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
