import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  SlidersHorizontal,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import { INITIAL_INFRASTRUCTURE } from '../services/api';
import { InfrastructureFeature } from '../types';

export const InfrastructurePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [exposureFilter, setExposureFilter] = useState('all');

  const filtered = INITIAL_INFRASTRUCTURE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesExposure = exposureFilter === 'all' || item.exposure_status === exposureFilter;
    return matchesSearch && matchesCategory && matchesExposure;
  });

  const handleExportCSV = () => {
    const headers = ['Feature ID', 'Name', 'Category', 'Study Area', 'Scenario', 'Exposure Status', 'Modelled Depth (m)', 'Arrival Time (hrs)', 'Data Source', 'Validation Status'];
    const rows = filtered.map(item => [
      item.id,
      `"${item.name}"`,
      item.category,
      `"${item.study_area}"`,
      item.scenario_code,
      item.exposure_status,
      item.water_depth_m,
      item.arrival_time_hrs,
      `"${item.data_source}"`,
      `"${item.validation_status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `floodwise_infrastructure_inventory.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Downstream Infrastructure Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable, categorized registry of all surveyed geographic infrastructure features and their modelled hydrodynamic exposure.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 bg-[#122238] hover:bg-[#1a2f4c] text-cyan-300 border border-cyan-800/60 px-3 py-2 rounded-lg text-xs font-medium transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Inventory CSV</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by asset name or Feature ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#08111F] border border-slate-700 text-xs rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#08111F] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Categories</option>
              <option value="bridge">Bridges</option>
              <option value="hospital">Hospitals</option>
              <option value="school">Schools</option>
              <option value="power_grid">Power Substations</option>
              <option value="settlement">Settlements</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={exposureFilter}
              onChange={(e) => setExposureFilter(e.target.value)}
              className="bg-[#08111F] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Statuses</option>
              <option value="High Risk">High Risk</option>
              <option value="Exposed">Exposed</option>
              <option value="Safe">Safe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#122238] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0D192B] border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4">Feature ID</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Scenario</th>
                <th className="py-3 px-4">Exposure Status</th>
                <th className="py-3 px-4">Modelled Depth</th>
                <th className="py-3 px-4">Arrival Lead Time</th>
                <th className="py-3 px-4">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">{item.id}</td>
                  <td className="py-3 px-4 font-medium text-white">{item.name}</td>
                  <td className="py-3 px-4">
                    <span className="uppercase font-mono text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{item.study_area}</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">{item.scenario_code}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.exposure_status === 'High Risk' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      item.exposure_status === 'Exposed' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {item.exposure_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-300">
                    {item.water_depth_m > 0 ? `${item.water_depth_m} m` : '0.0 m (Dry)'}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-300">
                    {item.arrival_time_hrs < 90 ? `T + ${item.arrival_time_hrs} hrs` : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[150px]" title={item.data_source}>
                    {item.data_source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#0D192B] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {INITIAL_INFRASTRUCTURE.length} registered features</span>
          <span className="font-mono text-[10px] text-amber-400">Benchmark SIH Dataset</span>
        </div>
      </div>
    </div>
  );
};
