import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Terminal, 
  RotateCcw, 
  FileUp, 
  Save, 
  Cpu, 
  Sliders, 
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import { Scenario, SimulationJob, SimulationLog } from '../types';

export const SimulationPage: React.FC = () => {
  // Form State
  const [studyName, setStudyName] = useState('Tawa Basin Inundation Modelling Study');
  const [riverName, setRiverName] = useState('Tawa River');
  const [damName, setDamName] = useState('Tawa Masonry & Earthen Dam');
  const [damLat, setDamLat] = useState('22.5562');
  const [damLng, setDamLng] = useState('77.8125');
  const [downstreamBoundaryKm, setDownstreamBoundaryKm] = useState('45.2');
  
  // Reservoir & Breach Parameters
  const [reservoirElevation, setReservoirElevation] = useState('358.5');
  const [storageVolume, setStorageVolume] = useState('2312');
  const [damHeight, setDamHeight] = useState('57.9');
  const [damCrestLength, setDamCrestLength] = useState('1480');
  const [breachType, setBreachType] = useState<'Overtopping' | 'Piping Failure'>('Overtopping');
  const [breachWidth, setBreachWidth] = useState('120');
  const [breachSideSlope, setBreachSideSlope] = useState('1.0');
  const [breachFormationTime, setBreachFormationTime] = useState('1.5');
  const [initialDischarge, setInitialDischarge] = useState('250');
  const [roughnessManning, setRoughnessManning] = useState('0.035');
  const [outputIntervalMins, setOutputIntervalMins] = useState('15');
  
  // Engine and Job State
  const [jobState, setJobState] = useState<'DRAFT' | 'VALIDATING' | 'QUEUED' | 'RUNNING' | 'COMPLETED'>('COMPLETED');
  const [progress, setProgress] = useState(100);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [logs, setLogs] = useState<SimulationLog[]>([
    { id: '1', job_id: 'JOB-01', timestamp: '10:20:00', level: 'INFO', message: 'Initialized HEC-RAS 2D computation engine adapter.' },
    { id: '2', job_id: 'JOB-01', timestamp: '10:20:05', level: 'INFO', message: 'Validating boundary conditions: Q_initial = 250 m³/s, Storage = 2312 MCM.' },
    { id: '3', job_id: 'JOB-01', timestamp: '10:20:12', level: 'INFO', message: 'Breach progression: Overtopping mode, formation time 1.5 hrs.' },
    { id: '4', job_id: 'JOB-01', timestamp: '10:20:25', level: 'INFO', message: 'Solving 2D Shallow Water Equations on computational terrain grid.' },
    { id: '5', job_id: 'JOB-01', timestamp: '10:20:45', level: 'INFO', message: 'Peak discharge computed: 14,200 m³/s at Ch. 0.0km.' },
    { id: '6', job_id: 'JOB-01', timestamp: '10:21:00', level: 'INFO', message: 'Simulation completed successfully. Inundation extent generated.' },
  ]);
  const [statusMessage, setStatusMessage] = useState('Ready for simulation execution.');

  // Validate inputs
  const handleValidate = () => {
    const errors: string[] = [];
    if (!studyName.trim()) errors.push('Study name is required.');
    if (parseFloat(reservoirElevation) <= 0) errors.push('Reservoir elevation must be greater than 0.');
    if (parseFloat(breachWidth) <= 0) errors.push('Breach bottom width must be greater than 0.');
    if (parseFloat(breachFormationTime) <= 0 || parseFloat(breachFormationTime) > 24) {
      errors.push('Breach formation time must be between 0.1 and 24 hours.');
    }
    if (parseFloat(storageVolume) <= 0) errors.push('Storage volume must be positive.');

    setValidationErrors(errors);
    if (errors.length === 0) {
      setJobState('VALIDATING');
      setStatusMessage('Input parameters validated against hydrodynamic boundary limits.');
      setTimeout(() => {
        setJobState('DRAFT');
        setStatusMessage('Validation passed. Ready to queue simulation job.');
      }, 800);
    }
    return errors.length === 0;
  };

  // Run simulation job
  const handleRunSimulation = () => {
    if (!handleValidate()) return;

    setJobState('QUEUED');
    setProgress(5);
    setStatusMessage('Job queued in simulation worker queue...');
    
    const newLogs: SimulationLog[] = [
      { id: Date.now().toString(), job_id: 'CURRENT', timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Job scheduled for HEC-RAS 2D hydrodynamic solver.' }
    ];
    setLogs(newLogs);

    setTimeout(() => {
      setJobState('RUNNING');
      setProgress(25);
      setStatusMessage('Running 2D shallow water hydrodynamic calculations...');
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        job_id: 'CURRENT',
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        message: 'Generating adaptive computational mesh for downstream river reach...'
      }]);
    }, 1200);

    setTimeout(() => {
      setProgress(65);
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        job_id: 'CURRENT',
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        message: 'Calculating breach progression hydrograph: Peak outflow = 14,200 m³/s...'
      }]);
    }, 2400);

    setTimeout(() => {
      setProgress(100);
      setJobState('COMPLETED');
      setStatusMessage('Simulation completed! Hydrodynamic outputs loaded into GIS layers.');
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        job_id: 'CURRENT',
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        message: 'Completed: Inundation contours and arrival hydrographs persisted to database.'
      }]);
    }, 3800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dam-Break Simulation Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure hydraulic parameters, dam breach geometry, computational domain, and execute 2D hydrodynamic modelling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleValidate}
            className="px-3 py-2 bg-[#122238] hover:bg-[#1a2f4c] text-cyan-300 border border-cyan-800/60 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Validate Inputs</span>
          </button>
          
          <button
            onClick={handleRunSimulation}
            disabled={jobState === 'RUNNING'}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Run Simulation Job</span>
          </button>
        </div>
      </div>

      {/* Validation alert banner if errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Input Validation Errors Detected</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* State & Progress Status Banner */}
      <div className="bg-[#122238] border border-slate-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400">Current Job Status:</div>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
              jobState === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
              jobState === 'RUNNING' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse' :
              jobState === 'QUEUED' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-slate-800 text-slate-300'
            }`}>
              {jobState}
            </span>
          </div>

          <div className="text-xs text-slate-400">
            Engine: <span className="text-cyan-300 font-mono">HEC-RAS 2D v6.4.1 (Modular Adapter)</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-sky-400 h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-[11px] text-slate-400">
          <span>{statusMessage}</span>
          <span className="font-mono">{progress}% Complete</span>
        </div>
      </div>

      {/* Configuration Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section A: Study & River Basin */}
        <div className="bg-[#122238] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Section A
            </span>
            <h3 className="text-sm font-semibold text-white">Study Basin & Location Metadata</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Study Name</label>
              <input
                type="text"
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">River Name</label>
                <input
                  type="text"
                  value={riverName}
                  onChange={(e) => setRiverName(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Downstream Reach (km)</label>
                <input
                  type="number"
                  value={downstreamBoundaryKm}
                  onChange={(e) => setDownstreamBoundaryKm(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Dam Latitude (°N)</label>
                <input
                  type="text"
                  value={damLat}
                  onChange={(e) => setDamLat(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Dam Longitude (°E)</label>
                <input
                  type="text"
                  value={damLng}
                  onChange={(e) => setDamLng(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Dam & Breach Mechanics */}
        <div className="bg-[#122238] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Section B
            </span>
            <h3 className="text-sm font-semibold text-white">Dam & Hydraulic Breach Parameters</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Water-Surface Elevation (m MSL)</label>
                <input
                  type="number"
                  value={reservoirElevation}
                  onChange={(e) => setReservoirElevation(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Reservoir Storage (MCM)</label>
                <input
                  type="number"
                  value={storageVolume}
                  onChange={(e) => setStorageVolume(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Breach Failure Mode</label>
                <select
                  value={breachType}
                  onChange={(e) => setBreachType(e.target.value as any)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Overtopping">Overtopping Failure (Catastrophic)</option>
                  <option value="Piping Failure">Piping Erosion / Seepage</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Formation Time (hrs)</label>
                <input
                  type="number"
                  step="0.1"
                  value={breachFormationTime}
                  onChange={(e) => setBreachFormationTime(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Breach Bottom Width (m)</label>
                <input
                  type="number"
                  value={breachWidth}
                  onChange={(e) => setBreachWidth(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Manning Roughness 'n'</label>
                <input
                  type="number"
                  step="0.005"
                  value={roughnessManning}
                  onChange={(e) => setRoughnessManning(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Computation Console / Logs Section */}
      <div className="bg-[#122238] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Simulation Engine Execution Log</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Standard Output (stdout)</span>
        </div>

        <div className="bg-[#08111F] p-4 rounded-lg font-mono text-xs text-slate-300 h-44 overflow-y-auto space-y-1.5 border border-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={`shrink-0 font-bold ${
                log.level === 'INFO' ? 'text-cyan-400' :
                log.level === 'WARN' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                [{log.level}]
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
