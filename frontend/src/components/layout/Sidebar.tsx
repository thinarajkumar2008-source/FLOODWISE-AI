import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Sliders,
  GitCompare,
  ShieldAlert,
  Building2,
  Compass,
  BellRing,
  FileText,
  Database,
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigation: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Flood Map 2D', path: '/map', icon: MapPin, badge: 'Live GIS' },
    { name: 'Dam-Break Workspace', path: '/simulation', icon: Sliders },
    { name: 'Scenario Comparison', path: '/scenarios', icon: GitCompare },
    { name: 'Risk Assessment', path: '/risk', icon: ShieldAlert },
    { name: 'Infrastructure Exposure', path: '/infrastructure', icon: Building2 },
    { name: 'Evacuation Planning', path: '/evacuation', icon: Compass },
    { name: 'Alerts & Warnings', path: '/alerts', icon: BellRing, badge: '2 Active' },
    { name: 'Reports & Exports', path: '/reports', icon: FileText },
    { name: 'Data Management', path: '/data-sources', icon: Database },
    { name: 'Settings & Reference', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#08111F] border-r border-slate-800/80 flex flex-col shrink-0 select-none">
      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Disaster Decision Platform
        </div>
        
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-cyan-400" />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Hydrodynamic Engine Status Widget */}
      <div className="p-3 m-3 rounded-lg bg-[#0D192B] border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400">Hydro Engine</span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Ready
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-medium">HEC-RAS 2D Adapter</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Benchmarked on 2D Shallow Water Equations</p>
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>SIH 2024 / SIH26161</span>
        <span className="font-mono text-[10px] text-slate-600">v1.0-DEMO</span>
      </div>
    </aside>
  );
};
