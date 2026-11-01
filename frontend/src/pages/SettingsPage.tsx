import React, { useState } from 'react';
import { 
  Settings, 
  HelpCircle, 
  BookOpen, 
  ShieldAlert, 
  Cpu, 
  User, 
  Bell, 
  Sliders, 
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'help' | 'sih'>('sih');
  
  // Settings form states
  const [userName, setUserName] = useState('Dr. Ananya Sharma');
  const [userRole, setUserRole] = useState('Senior Hydrodynamic Modeller & GIS Lead');
  const [unitSystem, setUnitSystem] = useState('metric');
  const [defaultOpacity, setDefaultOpacity] = useState('65');
  const [mockSmsEnabled, setMockSmsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Configuration & Documentation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform preferences, scientific references, hydrodynamic documentation, and SIH26161 problem statement specifications.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-[#122238] p-1 rounded-lg border border-slate-700/80 text-xs">
          <button
            onClick={() => setActiveTab('sih')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'sih' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            SIH26161 Context
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'help' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Hydraulic Guide
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'settings' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Platform workspace preferences saved successfully.</span>
        </div>
      )}

      {/* Tab 1: SIH26161 Context */}
      {activeTab === 'sih' && (
        <div className="space-y-6">
          <div className="bg-[#122238] border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
              <span>Smart India Hackathon • Problem Statement SIH26161</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Dam Break Inundation Modelling Using Hydrodynamic Modelling of Any River
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              FLOODWISE AI addresses the urgent need for a modular, reproducible dam breach emergency intelligence system. It combines full 2D hydrodynamic simulation algorithms with real-time vector GIS overlay, enabling disaster management officials to plan evacuations hours before water reaches vulnerable downstream populations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-[#08111F] p-4 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block mb-1">Requirement 1</span>
                <h4 className="font-bold text-white mb-1">Hydrodynamic Modeling</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Calculates 2D unsteady flow depth, velocity, and arrival wave hydrographs using Saint-Venant shallow water equations.
                </p>
              </div>

              <div className="bg-[#08111F] p-4 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block mb-1">Requirement 2</span>
                <h4 className="font-bold text-white mb-1">Downstream Risk Assessment</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Intersects inundation zones with population settlements, bridges, medical centers, schools, and energy substations.
                </p>
              </div>

              <div className="bg-[#08111F] p-4 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block mb-1">Requirement 3</span>
                <h4 className="font-bold text-white mb-1">Emergency Action Planning</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Evaluates safe evacuation windows and route hazard crossings before floodwaters isolate communities.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#122238] border border-slate-800 rounded-xl p-6 text-xs text-slate-300 space-y-3">
            <h3 className="text-sm font-bold text-white">Scientific Limitations & Integrity Notice</h3>
            <p className="leading-relaxed">
              This deployment contains internally consistent, synthetically modelled demonstration benchmarks for the Tawa Basin (EPSG:4326). While equations and hydraulic ranges reflect genuine physical phenomena, actual emergency evacuation orders require Central Water Commission (CWC) validation, site bathymetric calibration, and certified terrain rasters.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Hydraulic Guide */}
      {activeTab === 'help' && (
        <div className="space-y-4">
          <div className="bg-[#122238] border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Hydraulic Dam-Break Fundamentals</h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div>
                <strong className="text-cyan-300 block mb-1">1. Overtopping vs. Piping Mechanics</strong>
                <p>
                  Overtopping occurs when inflow exceeds reservoir surcharge capacity, spilling over the crest and initiating progressive headcut erosion. Piping occurs via internal seepage cavities within an earthen embankment. Overtopping typically triggers higher peak discharges (Q_max) with rapid formation times.
                </p>
              </div>

              <div>
                <strong className="text-cyan-300 block mb-1">2. Froehlich (2008) Breach Equations</strong>
                <p>
                  FLOODWISE AI benchmark parameters employ empirical breach formulations for average width B_avg = 0.27 · K_0 · V_w^0.32 · h_b^0.04 and formation time tau_f = 63.2 · sqrt(V_w / (g · h_b^2)).
                </p>
              </div>

              <div>
                <strong className="text-cyan-300 block mb-1">3. Hydrodynamic Wave Propagation</strong>
                <p>
                  The dam-break wave creates a steep-front shockwave followed by a gradual recession limb. Downstream channel resistance (Manning's \(n\)) and valley storage attenuate the peak discharge as the wave progresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Preferences */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSave} className="bg-[#122238] border border-slate-800 rounded-xl p-6 space-y-4 max-w-xl text-xs">
          <h3 className="text-sm font-bold text-white mb-2">User & Workspace Preferences</h3>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Investigator Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Designation / Role</label>
            <input
              type="text"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Measurement Units</label>
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="metric">SI Metric (m, m/s, m³/s, km²)</option>
                <option value="imperial">Imperial (ft, ft/s, cfs, sq mi)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Default Map Opacity</label>
              <input
                type="number"
                min="10"
                max="100"
                value={defaultOpacity}
                onChange={(e) => setDefaultOpacity(e.target.value)}
                className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={mockSmsEnabled}
                onChange={(e) => setMockSmsEnabled(e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Enable Mock In-App SMS Alert Dispatcher</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-cyan-500/20 transition"
            >
              Save Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
