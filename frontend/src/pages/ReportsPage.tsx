import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  Building2, 
  Compass, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { INITIAL_STUDIES, INITIAL_SCENARIOS, INITIAL_SIMULATIONS } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState(INITIAL_STUDIES[0]);
  const [selectedScenario, setSelectedScenario] = useState(INITIAL_SCENARIOS[0]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handleDownloadJSON = () => {
    const reportData = {
      report_title: 'FLOODWISE AI Hydrodynamic Dam-Break Inundation Assessment Report',
      sih_problem_code: 'SIH26161',
      generated_at: new Date().toISOString(),
      disclaimer: 'DEMONSTRATION DATA — NOT A VERIFIED REAL-TIME FLOOD FORECAST',
      study: selectedStudy,
      scenario: selectedScenario,
      hydrodynamic_results: {
        engine: 'HEC-RAS 2D v6.4.1 Adapter',
        peak_outflow_discharge_cumec: selectedScenario.initial_discharge_cumec,
        max_inundation_area_sqkm: 68.4,
        peak_depth_m: 8.4,
        peak_velocity_mps: 4.8,
        affected_villages_count: 3,
        affected_infrastructure_count: 4,
        evacuation_routes_proposed: 2
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `floodwise_${selectedStudy.id}_report.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const rows = [
      ['METRIC', 'VALUE', 'UNIT', 'VALIDATION STATUS'],
      ['Study Name', `"${selectedStudy.name}"`, 'text', 'SIH Demonstration'],
      ['River System', `"${selectedStudy.river_name}"`, 'text', 'WGS 84'],
      ['Dam Crest Elevation', selectedScenario.reservoir_elevation_m, 'm MSL', 'Benchmark'],
      ['Reservoir Storage', selectedScenario.storage_volume_mcm, 'MCM', 'Benchmark'],
      ['Failure Mode', selectedScenario.breach_type, 'text', 'Simulated'],
      ['Peak Outflow', selectedScenario.initial_discharge_cumec, 'm3/s', 'HEC-RAS 2D Adapter'],
      ['Total Inundated Area', '68.4', 'sq km', 'Calculated'],
      ['Maximum Water Depth', '8.4', 'm', 'Calculated Tailrace'],
      ['Exposed Population', '10410', 'Persons', 'Census Demonstration'],
      ['Earliest Flood Arrival', '0.2', 'Hours', 'Calculated']
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `floodwise_${selectedStudy.id}_summary.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Scientific Reports & Data Exports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and export standardized disaster risk assessment documentation for state authorities and municipal planning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 bg-[#122238] hover:bg-[#1a2f4c] text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download CSV Summary</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 bg-[#122238] hover:bg-[#1a2f4c] text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Geo-JSON Specs</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs shadow-md shadow-cyan-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>View Printable PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Report Preview Dossier Container */}
      <div className="bg-[#122238] border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Report Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              National Dam Safety Authority / SDMA Standard Dossier
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Dam-Break Hydrodynamic Inundation & Downstream Exposure Audit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Study Code: {selectedStudy.id} • Scenario: {selectedScenario.name}
            </p>
          </div>

          <div className="text-right text-xs text-slate-400">
            <span className="inline-block bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold px-2 py-0.5 rounded text-[10px]">
              DEMO BENCHMARK AUDIT
            </span>
            <div className="mt-1 font-mono text-[11px]">Date: 2026-10-24 15:30 IST</div>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#08111F] p-4 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Dam Structure</span>
            <span className="text-white font-bold text-sm block mt-1">{selectedStudy.dam_name}</span>
            <span className="text-slate-500 text-[10px]">Height: 57.9m • Storage: 2,312 MCM</span>
          </div>

          <div className="bg-[#08111F] p-4 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Hydrodynamic Engine</span>
            <span className="text-cyan-300 font-bold text-sm block mt-1">HEC-RAS 2D v6.4.1</span>
            <span className="text-slate-500 text-[10px]">2D Shallow Water Equations</span>
          </div>

          <div className="bg-[#08111F] p-4 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Total Inundated Footprint</span>
            <span className="text-rose-400 font-bold text-sm block mt-1">68.4 km²</span>
            <span className="text-slate-500 text-[10px]">Max Reach: 45.2 km downstream</span>
          </div>

          <div className="bg-[#08111F] p-4 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Critical Evacuation Window</span>
            <span className="text-amber-400 font-bold text-sm block mt-1">0.5 - 1.2 Hours</span>
            <span className="text-slate-500 text-[10px]">Lead time before first arrival</span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <h4 className="font-bold text-white text-sm mb-2 border-b border-slate-800 pb-1">
              1. Hydrodynamic Inundation Mechanics & Peak Flow Velocity
            </h4>
            <p className="leading-relaxed">
              Under Probable Maximum Flood (PMF) conditions, a simulated overtopping breach spanning 120 meters develops across a 1.5-hour duration. Peak breach outflow discharge reaches <strong>14,200 m³/s</strong>. Inundation sweeps through the downstream valley with velocities exceeding 4.8 m/s at the tailrace and sustaining 2.5 m/s at 24 km downstream.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2 border-b border-slate-800 pb-1">
              2. Downstream Population & Structural Exposure Analysis
            </h4>
            <p className="leading-relaxed">
              Spatial vector intersection identifies three exposed settlement wards: <strong>Rampur Khurd</strong> (Pop: 2,840), <strong>Pipariya Downstream Ward</strong> (Pop: 6,120), and <strong>Sangam Nagar</strong> (Pop: 1,450). Four critical infrastructure facilities intersect the flood hazard zone, including the Rampur State Highway Bridge and Pipariya 132kV Substation.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2 border-b border-slate-800 pb-1">
              3. Emergency Evacuation Route Feasibility
            </h4>
            <p className="leading-relaxed">
              Evacuation Route 1A (Eastward climb to Shrikrishna Hilltop Relief Complex at 372m elevation) provides a 30-minute safe departure window without intersecting floodwaters. Route 2B requires early convoy movement before low culverts at Ch. 4km submerge at T+1.2 hours.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2 border-b border-slate-800 pb-1">
              4. Scientific Validation & Model Limitations
            </h4>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              This report compiles demonstration data for Smart India Hackathon problem statement SIH26161. While numerical modeling parameters adhere to realistic hydraulic boundary conditions, physical deployment requires field bathymetry surveys, calibrated Manning roughness coefficients, and official approval from the Central Water Commission (CWC) or State Disaster Management Authority (SDMA).
            </div>
          </div>
        </div>
      </div>

      {/* Printable Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-950">FLOODWISE AI — Official Assessment Dossier</h3>
                <p className="text-xs text-slate-600">SIH26161 Hydrodynamic Dam-Break Simulation</p>
              </div>
              <button 
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900 rounded">
              <strong>OFFICIAL NOTICE:</strong> SIH Demonstration Document. Synthetically modelled for Tawa River Basin.
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p><strong>Study:</strong> {selectedStudy.name} ({selectedStudy.river_name})</p>
              <p><strong>Scenario:</strong> {selectedScenario.name}</p>
              <p><strong>Simulated Peak Outflow:</strong> {selectedScenario.initial_discharge_cumec} m³/s</p>
              <p><strong>Flooded Footprint:</strong> 68.4 km²</p>
              <p><strong>Peak Tailrace Depth:</strong> 8.4 meters</p>
              <p><strong>Exposed Downstream Population:</strong> 10,410 persons</p>
              <p><strong>Recommended Action:</strong> Evacuate Rampur and Pipariya riverside areas to Shrikrishna Hilltop Shelter within 30 minutes of breach trigger.</p>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg"
              >
                Print to PDF / Printer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
