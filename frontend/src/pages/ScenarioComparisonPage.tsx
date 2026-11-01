import React, { useState } from 'react';
import { 
  GitCompare, 
  BarChart2, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const ScenarioComparisonPage: React.FC = () => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['SCEN-001', 'SCEN-002']);

  const scenarios = [
    {
      id: 'SCEN-001',
      name: 'Scenario A: Overtopping Breach (PMF)',
      type: 'Overtopping Failure',
      water_elevation: 358.5,
      storage: 2312,
      breach_width: 120,
      breach_time: 1.5,
      peak_discharge: 14200,
      inundated_area: 68.4,
      max_depth: 8.4,
      max_velocity: 4.8,
      arrival_time_rampur: 0.8,
      exposed_settlements: 3,
      exposed_infrastructure: 4,
      color: '#EF4444'
    },
    {
      id: 'SCEN-002',
      name: 'Scenario B: Piping Failure at Normal Pool',
      type: 'Piping Failure',
      water_elevation: 355.4,
      storage: 1980,
      breach_width: 65,
      breach_time: 2.8,
      peak_discharge: 8900,
      inundated_area: 42.1,
      max_depth: 5.7,
      max_velocity: 3.2,
      arrival_time_rampur: 1.6,
      exposed_settlements: 2,
      exposed_infrastructure: 3,
      color: '#38BDF8'
    }
  ];

  const comparisonChartData = [
    { metric: 'Flooded Area (km²)', 'Scenario A': 68.4, 'Scenario B': 42.1 },
    { metric: 'Max Depth (m)', 'Scenario A': 8.4, 'Scenario B': 5.7 },
    { metric: 'Max Velocity (m/s)', 'Scenario A': 4.8, 'Scenario B': 3.2 },
    { metric: 'Arrival at Ch.12km (hrs)', 'Scenario A': 0.8, 'Scenario B': 1.6 },
    { metric: 'Exposed Infra (Count)', 'Scenario A': 4, 'Scenario B': 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Scenario Hydrodynamic Comparison</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare breach kinematics, inundation footprints, flow velocities, and critical infrastructure exposure between candidate scenarios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Comparing 2 of 2 runs</span>
        </div>
      </div>

      {/* High-level Metric Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scen) => (
          <div 
            key={scen.id}
            className="bg-[#122238] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                  {scen.type}
                </span>
                <h3 className="text-base font-bold text-white">{scen.name}</h3>
              </div>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: scen.color }}></span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-[#08111F] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Peak Outflow</span>
                <span className="text-lg font-bold font-mono text-white">{scen.peak_discharge.toLocaleString()} m³/s</span>
              </div>

              <div className="bg-[#08111F] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Flooded Footprint</span>
                <span className="text-lg font-bold font-mono text-cyan-300">{scen.inundated_area} km²</span>
              </div>

              <div className="bg-[#08111F] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Peak Water Depth</span>
                <span className="text-lg font-bold font-mono text-rose-400">{scen.max_depth} m</span>
              </div>

              <div className="bg-[#08111F] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Lead Time to Ch.12km</span>
                <span className="text-lg font-bold font-mono text-amber-400">{scen.arrival_time_rampur} hrs</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span>Breach Formation Time:</span>
                <span className="text-white font-mono">{scen.breach_time} hours</span>
              </div>
              <div className="flex justify-between">
                <span>Final Breach Width:</span>
                <span className="text-white font-mono">{scen.breach_width} meters</span>
              </div>
              <div className="flex justify-between">
                <span>Exposed Settlements:</span>
                <span className="text-amber-400 font-bold">{scen.exposed_settlements} Wards</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      <div className="bg-[#122238] border border-slate-800 rounded-xl p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">Direct Hydraulic Metric Comparison</h3>
          <p className="text-xs text-slate-400">Comparing hydraulic parameters side-by-side</p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0D192B', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
              />
              <Legend />
              <Bar dataKey="Scenario A" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario B" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabular Matrix Comparison */}
      <div className="bg-[#122238] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Hydrodynamic Summary Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-2">Parameter</th>
                <th className="pb-2 text-rose-400">Scenario A (Overtopping)</th>
                <th className="pb-2 text-cyan-400">Scenario B (Piping)</th>
                <th className="pb-2">Variance / Δ Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr>
                <td className="py-2.5 font-medium">Reservoir Pool Elevation</td>
                <td className="py-2.5 font-mono">358.50 m MSL</td>
                <td className="py-2.5 font-mono">355.40 m MSL</td>
                <td className="py-2.5 font-mono text-slate-400">-3.10 m lower</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Peak Discharge (Q_max)</td>
                <td className="py-2.5 font-mono font-bold text-rose-400">14,200 m³/s</td>
                <td className="py-2.5 font-mono font-bold text-cyan-400">8,900 m³/s</td>
                <td className="py-2.5 font-mono text-slate-400">-37.3% lower peak</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Total Inundated Reach Area</td>
                <td className="py-2.5 font-mono">68.4 km²</td>
                <td className="py-2.5 font-mono">42.1 km²</td>
                <td className="py-2.5 font-mono text-slate-400">-26.3 km² reduction</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Emergency Evacuation Safe Window</td>
                <td className="py-2.5 font-mono text-amber-400">0.5 hours (30 min)</td>
                <td className="py-2.5 font-mono text-emerald-400">1.2 hours (72 min)</td>
                <td className="py-2.5 font-mono text-emerald-400">+42 min extra lead time</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
