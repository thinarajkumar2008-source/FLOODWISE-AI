import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DemoBannerProps {
  compact?: boolean;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ compact }) => {
  if (compact) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
        <span><strong>DEMO DATA:</strong> Not a real-time flood forecast. Synthetically modelled for SIH26161 demonstration.</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-slate-900/60 border-y border-amber-500/30 px-4 py-2 text-xs text-amber-200/90 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-2.5">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="font-semibold tracking-wider text-amber-300 uppercase text-[11px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
          SIH26161 Prototype Mode
        </span>
        <span>
          <strong>DEMONSTRATION DATA — NOT A VERIFIED REAL-TIME FLOOD FORECAST.</strong> Inundation contours and arrival hydrographs are benchmark simulations.
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
        <Info className="w-3.5 h-3.5 text-cyan-400" />
        <span>Scientific hydrodynamic engine adapter: HEC-RAS 2D Simulated</span>
      </div>
    </div>
  );
};
