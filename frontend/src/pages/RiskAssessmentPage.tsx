import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Filter, 
  Download, 
  AlertCircle, 
  Building2, 
  Users, 
  Activity, 
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { INITIAL_INFRASTRUCTURE } from '../services/api';

export const RiskAssessmentPage: React.FC = () => {
  const [selectedDepthThreshold, setSelectedDepthThreshold] = useState<number>(1.5);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAssets = INITIAL_INFRASTRUCTURE.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesDepth = asset.water_depth_m >= selectedDepthThreshold;
    return matchesCategory && matchesDepth;
  });

  const handleExportCSV = () => {
    const headers = ['Asset ID', 'Name', 'Category', 'Exposure Status', 'Modelled Depth (m)', 'Arrival Time (hrs)', 'Data Source'];
    const rows = filteredAssets.map(a => [
      a.id,
      `"${a.name}"`,
      a.category,
      a.exposure_status,
      a.water_depth_m,
      a.arrival_time_hrs,
      `"${a.data_source}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `floodwise_risk_assessment_threshold_${selectedDepthThreshold}m.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">GIS Exposure & Vulnerability Risk Analysis</h1>
          <p className="text-xs text-slate-400 mt-1">
            Spatial overlay of hydrodynamic inundation layers with downstream population centers and critical infrastructure.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 bg-[#122238] hover:bg-[#1a2f4c] text-cyan-300 border border-cyan-800/60 px-3 py-2 rounded-lg text-xs font-medium transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Assessment CSV</span>
        </button>
      </div>

      {/* Exposure vs Risk Concept Explainer Banner */}
      <div className="bg-[#122238] border-l-4 border-cyan-400 p-4 rounded-r-xl border-y border-r border-slate-800 text-xs text-slate-300">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Scientific Distinction: Exposure vs. Vulnerability Risk</strong>
            <span>
              A building or road intersecting a hydrodynamic flood contour indicates <em>spatial exposure</em>. Complete disaster risk is a composite function of water depth, peak flow momentum (depth × velocity), structural resistance, warning lead time, and population evacuation readiness.
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Sensitivity Threshold Controls */}
      <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Depth Hazard Cutoff:</span>
            <select
              value={selectedDepthThreshold}
              onChange={(e) => setSelectedDepthThreshold(parseFloat(e.target.value))}
              className="bg-[#08111F] border border-slate-700 text-cyan-300 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="0.0">All Inundated Features (&gt; 0.0 m)</option>
              <option value="1.0">Moderate Inundation (&ge; 1.0 m)</option>
              <option value="1.5">Hazard Threshold (&ge; 1.5 m)</option>
              <option value="3.0">Severe Life Risk (&ge; 3.0 m)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Asset Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#08111F] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">All Infrastructure Assets</option>
              <option value="settlement">Villages / Settlements</option>
              <option value="bridge">Bridges & Culverts</option>
              <option value="hospital">Hospitals & Clinics</option>
              <option value="school">Educational Institutes</option>
              <option value="power_grid">Power Substations</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-cyan-300 font-bold">{filteredAssets.length}</span> assets exceeding {selectedDepthThreshold}m depth
        </div>
      </div>

      {/* High Risk Asset Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Severe Hazard Intersections</span>
          <div className="text-2xl font-bold text-rose-400">
            {filteredAssets.filter(a => a.water_depth_m >= 3.0).length}
          </div>
          <span className="text-[11px] text-slate-400">Depth &gt; 3.0m • Immediate Structural Danger</span>
        </div>

        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Exposed Population</span>
          <div className="text-2xl font-bold text-amber-400">
            {filteredAssets.reduce((acc, cur) => acc + (cur.population_at_risk || 0), 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Residents in selected depth hazard zone</span>
        </div>

        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Earliest Inundation</span>
          <div className="text-2xl font-bold text-cyan-400">
            {Math.min(...filteredAssets.map(a => a.arrival_time_hrs || 99))} hrs
          </div>
          <span className="text-[11px] text-slate-400">Minimum lead time to first impact</span>
        </div>
      </div>

      {/* Tabular Exposure Assessment Table */}
      <div className="bg-[#122238] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Intersecting Downstream Geographic Features</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-2">Feature ID</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Exposure Status</th>
                <th className="pb-2">Modelled Depth</th>
                <th className="pb-2">Arrival Lead Time</th>
                <th className="pb-2">Validation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-cyan-400 font-medium">{asset.id}</td>
                  <td className="py-3 font-medium text-white">{asset.name}</td>
                  <td className="py-3 uppercase font-mono text-[10px] text-slate-400">{asset.category}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      asset.exposure_status === 'High Risk' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      asset.exposure_status === 'Exposed' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {asset.exposure_status}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-rose-300">{asset.water_depth_m} m</td>
                  <td className="py-3 font-mono text-amber-300">{asset.arrival_time_hrs} hrs</td>
                  <td className="py-3 text-slate-400 text-[11px]">{asset.validation_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
