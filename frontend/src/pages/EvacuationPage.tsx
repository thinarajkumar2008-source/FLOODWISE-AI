import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Download, 
  Navigation,
  Info
} from 'lucide-react';
import { INITIAL_EVACUATION_ROUTES } from '../services/api';
import { EvacuationRoute } from '../types';

export const EvacuationPage: React.FC = () => {
  const [routes, setRoutes] = useState<EvacuationRoute[]>(INITIAL_EVACUATION_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<EvacuationRoute>(INITIAL_EVACUATION_ROUTES[0]);
  const [planningNotes, setPlanningNotes] = useState(
    'MANDATORY PROTOCOL: Evacuation convoy must depart immediately upon Dam Overtopping Alert issuance. Police barricades required at Ch. 4km culvert before T+45min. Direct ambulance units along Route 1A.'
  );

  const handleExportPlan = () => {
    const text = `FLOODWISE AI — EMERGENCY EVACUATION OPERATIONAL PLAN\n` +
      `Study Basin: Tawa River Basin (SIH26161 Benchmark)\n` +
      `Date Generated: ${new Date().toISOString()}\n\n` +
      `DISCLAIMER: Proposed routes require on-ground SDMA / Police validation during flood conditions.\n\n` +
      `ROUTE 1:\n` +
      `- Origin: ${routes[0].origin_settlement}\n` +
      `- Destination Shelter: ${routes[0].destination_shelter}\n` +
      `- Distance: ${routes[0].distance_km} km\n` +
      `- Estimated Transit: ${routes[0].estimated_time_mins} minutes\n` +
      `- Safe Departure Window: Within ${routes[0].safe_departure_window_hrs} hrs (30 min)\n` +
      `- Status: ${routes[0].status}\n` +
      `- Notes: ${routes[0].planning_notes}\n\n` +
      `COMMAND NOTES:\n${planningNotes}\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `floodwise_evacuation_plan.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Emergency Evacuation Planning Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Hydrodynamically vetted evacuation corridors connecting vulnerable flood-zone settlements to safe high-ground relief shelters.
          </p>
        </div>

        <button
          onClick={handleExportPlan}
          className="inline-flex items-center gap-1.5 bg-[#122238] hover:bg-[#1a2f4c] text-cyan-300 border border-cyan-800/60 px-3 py-2 rounded-lg text-xs font-medium transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Operational Plan</span>
        </button>
      </div>

      {/* Safety Protocol Alert */}
      <div className="bg-[#122238] border-l-4 border-amber-500 p-4 rounded-r-xl border-y border-r border-slate-800 text-xs text-slate-300">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Critical Emergency Routing Rule</strong>
            <span>
              Standard GPS shortest-path algorithms are hazardous during dam breaks because roadways may be submerged under high-velocity water. All proposed routes here are cross-referenced with simulated arrival times and explicitly tagged as <strong>"Proposed — Requires Official Validation"</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Designated Shelters Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Primary Designated Shelter</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
              Safe High Ground
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1">Shrikrishna Hilltop Relief Complex</h3>
          <p className="text-xs text-slate-400 mb-3">Elevation: 372.0m MSL (+14m above peak flood surface)</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#08111F] p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Capacity</span>
              <span className="text-white font-bold font-mono">3,500 Persons</span>
            </div>
            <div className="bg-[#08111F] p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Facilities</span>
              <span className="text-cyan-300 text-[11px] font-medium">Clean Water, Generator, Meds</span>
            </div>
          </div>
        </div>

        <div className="bg-[#122238] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Secondary Regional Shelter</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
              Safe High Ground
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1">District Stadium & Elevated Pavilion</h3>
          <p className="text-xs text-slate-400 mb-3">Elevation: 365.0m MSL (+7m above peak flood surface)</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#08111F] p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Capacity</span>
              <span className="text-white font-bold font-mono">5,000 Persons</span>
            </div>
            <div className="bg-[#08111F] p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Facilities</span>
              <span className="text-cyan-300 text-[11px] font-medium">Helipad Access, Field Hospital</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proposed Evacuation Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route selector list */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Evaluated Corridors</h3>
          {routes.map((rt) => (
            <div
              key={rt.id}
              onClick={() => setSelectedRoute(rt)}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                selectedRoute.id === rt.id
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : 'bg-[#122238] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-cyan-400 font-semibold">{rt.id}</span>
                <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.5 rounded">
                  {rt.status.includes('Official') ? 'Proposed' : 'Validated'}
                </span>
              </div>
              <h4 className="font-bold text-white mb-1">{rt.origin_settlement.split('(')[0]}</h4>
              <p className="text-slate-400 text-[11px]">→ {rt.destination_shelter.split('(')[0]}</p>
              
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400">{rt.distance_km} km • {rt.estimated_time_mins} min</span>
                <span className="text-emerald-400 font-medium">Safe Window: {rt.safe_departure_window_hrs}h</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Route Detailed Card */}
        <div className="lg:col-span-2 bg-[#122238] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">Selected Action Corridor</span>
              <h3 className="text-base font-bold text-white">{selectedRoute.origin_settlement}</h3>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-cyan-300">
              {selectedRoute.distance_km} km Total
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-[#08111F] p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Transit Travel Time</span>
              <span className="text-white font-bold font-mono text-sm">{selectedRoute.estimated_time_mins} minutes</span>
            </div>

            <div className="bg-[#08111F] p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Safe Departure Window</span>
              <span className="text-rose-400 font-bold font-mono text-sm">{selectedRoute.safe_departure_window_hrs} hrs (Lead Time)</span>
            </div>

            <div className="bg-[#08111F] p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Flood Hazard Crossings</span>
              <span className="text-amber-400 font-bold font-mono text-sm">{selectedRoute.flood_crossing_count} Culvert Intersections</span>
            </div>
          </div>

          <div className="bg-[#08111F] p-3 rounded-lg border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 font-semibold">Hydrodynamic Field Notes:</div>
            <p className="text-slate-300 leading-relaxed">{selectedRoute.planning_notes}</p>
          </div>

          {/* Editable Commander Notes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-white mb-1.5">
              Disaster Management Incident Commander Protocol Notes:
            </label>
            <textarea
              rows={3}
              value={planningNotes}
              onChange={(e) => setPlanningNotes(e.target.value)}
              className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
