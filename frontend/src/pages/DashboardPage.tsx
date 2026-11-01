import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { 
  FolderKanban, 
  Play, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Users, 
  Droplets, 
  Layers, 
  Plus, 
  ArrowUpRight, 
  Sliders, 
  FileText, 
  GitCompare,
  AlertTriangle
} from 'lucide-react';
import { apiService } from '../services/api';
import { DashboardMetrics, SimulationJob, Study } from '../types';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [simulations, setSimulations] = useState<SimulationJob[]>([]);
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, s, st] = await Promise.all([
          apiService.getMetrics(),
          apiService.getSimulations(),
          apiService.getStudies()
        ]);
        setMetrics(m);
        setSimulations(s);
        setStudies(st);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Depth distribution data
  const depthDistribution = [
    { range: '< 1.0 m (Shallow)', area: 18.2, color: '#38BDF8' },
    { range: '1.0 - 2.0 m (Moderate)', area: 24.5, color: '#22D3EE' },
    { range: '2.0 - 4.0 m (Severe)', area: 16.3, color: '#F59E0B' },
    { range: '> 4.0 m (Critical)', area: 9.4, color: '#EF4444' },
  ];

  // Infrastructure exposure category chart
  const infrastructureData = [
    { category: 'Bridges', count: 2, exposed: 1 },
    { category: 'Hospitals', count: 3, exposed: 1 },
    { category: 'Schools', count: 5, exposed: 2 },
    { category: 'Power Substations', count: 2, exposed: 1 },
    { category: 'Settlements', count: 4, exposed: 3 },
  ];

  // Scenario comparison peak discharge data
  const scenarioHydrograph = [
    { hour: '0h', scenA: 250, scenB: 180 },
    { hour: '1h', scenA: 4800, scenB: 1200 },
    { hour: '2h', scenA: 14200, scenB: 4500 },
    { hour: '3h', scenA: 11500, scenB: 8900 },
    { hour: '4h', scenA: 7200, scenB: 6200 },
    { hour: '6h', scenA: 3400, scenB: 3100 },
    { hour: '12h', scenA: 1100, scenB: 950 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading hydrodynamic intelligence metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Flood Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Basin: <span className="text-cyan-400 font-medium">Tawa River (Narmada Valley)</span> • Numerical Engine: <span className="text-slate-300">HEC-RAS 2D Simulated</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/simulation"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs shadow-md shadow-cyan-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Simulation</span>
          </Link>

          <Link
            to="/scenarios"
            className="inline-flex items-center gap-1.5 bg-[#122238] hover:bg-[#192f4e] text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition"
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compare Scenarios</span>
          </Link>

          <Link
            to="/reports"
            className="inline-flex items-center gap-1.5 bg-[#122238] hover:bg-[#192f4e] text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate Report</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Study Areas</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics?.total_studies || 2}</div>
          <span className="text-[10px] text-cyan-400/80">Tawa & Machhu Basins</span>
        </div>

        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Completed Simulations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics?.completed_simulations || 2}</div>
          <span className="text-[10px] text-emerald-400/80">2 Solved Jobs Ready</span>
        </div>

        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Exposed Infrastructure</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{metrics?.exposed_infrastructure || 4}</div>
          <span className="text-[10px] text-amber-400/80">4 of 5 Intersecting Floodplain</span>
        </div>

        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Downstream Population at Risk</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{metrics?.exposed_population.toLocaleString() || '10,410'}</div>
          <span className="text-[10px] text-rose-400/80">Across 3 Exposed Wards</span>
        </div>
      </div>

      {/* Main Charts & Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Hydrograph Chart */}
        <div className="lg:col-span-2 bg-[#122238] border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Breach Outflow Hydrograph Comparison</h3>
              <p className="text-xs text-slate-400">Peak Discharge (m³/s) vs. Time Elapsed post-failure</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Scenario A (Overtopping)
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Scenario B (Piping)
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioHydrograph} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit=" m³/s" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D192B', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="scenA" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 3 }} name="Scenario A" />
                <Line type="monotone" dataKey="scenB" stroke="#38BDF8" strokeWidth={2} dot={{ fill: '#38BDF8', r: 3 }} name="Scenario B" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flood Depth Distribution Pie */}
        <div className="bg-[#122238] border border-slate-800 p-5 rounded-xl flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-white">Inundation Depth Severity</h3>
            <p className="text-xs text-slate-400">Spatial coverage: 68.4 km² total flooded zone</p>
          </div>
          <div className="h-48 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={depthDistribution}
                  dataKey="area"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {depthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D192B', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} km²`, 'Area']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
            {depthDistribution.map(d => (
              <div key={d.range} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-300 truncate">{d.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Infrastructure Exposure & Map Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infrastructure exposure bar chart */}
        <div className="bg-[#122238] border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Critical Assets in Flood Hazard Zone</h3>
              <p className="text-xs text-slate-400">Intersecting features by structural category</p>
            </div>
            <Link to="/infrastructure" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              <span>View Table</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={infrastructureData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D192B', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                />
                <Bar dataKey="exposed" fill="#F59E0B" name="Exposed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="count" fill="#1e3a5f" name="Total Mapped" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Map Preview Card */}
        <div className="lg:col-span-2 bg-[#122238] border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Spatial Inundation Intelligence Preview</h3>
              <p className="text-xs text-slate-400">Tawa Dam downstream valley: 45.2 km reach</p>
            </div>
            <Link
              to="/map"
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Open Full 2D Map</span>
            </Link>
          </div>

          <div className="bg-[#08111F] rounded-lg p-4 border border-slate-800 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
              <span className="text-slate-400">Modelled Breach Point:</span>
              <span className="text-white font-mono">Tawa Dam (22.5562° N, 77.8125° E)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
              <span className="text-slate-400">Peak Flood Depth Recorded:</span>
              <span className="text-rose-400 font-mono font-bold">8.4 m (Tailrace Cross-Section)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
              <span className="text-slate-400">Estimated Arrival Time at Rampur:</span>
              <span className="text-amber-400 font-mono font-bold">48 minutes</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2">
              <span className="text-slate-400">Evacuation Safe Window:</span>
              <span className="text-emerald-400 font-mono font-bold">30 min recommended lead time</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Coordinate System: EPSG:4326 (WGS 84)</span>
            <span className="text-amber-400/90 font-medium">Demonstration Benchmark Data</span>
          </div>
        </div>
      </div>

      {/* Recent Simulation Jobs Table */}
      <div className="bg-[#122238] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Hydrodynamic Simulation Jobs</h3>
          <Link to="/simulation" className="text-xs text-cyan-400 hover:underline">
            Manage All Jobs →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-2">Job ID</th>
                <th className="pb-2">Scenario</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Peak Depth</th>
                <th className="pb-2">Max Velocity</th>
                <th className="pb-2">Flooded Area</th>
                <th className="pb-2">Validation</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {simulations.map((sim) => (
                <tr key={sim.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-cyan-300 font-medium">{sim.id}</td>
                  <td className="py-3 text-slate-200">{sim.scenario_name}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      {sim.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-200">{sim.max_depth_m} m</td>
                  <td className="py-3 font-mono text-slate-200">{sim.max_velocity_mps} m/s</td>
                  <td className="py-3 font-mono text-slate-200">{sim.flooded_area_sqkm} km²</td>
                  <td className="py-3 text-slate-400 text-[11px]">{sim.validation_status}</td>
                  <td className="py-3 text-right">
                    <Link
                      to="/map"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs"
                    >
                      View Map →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
