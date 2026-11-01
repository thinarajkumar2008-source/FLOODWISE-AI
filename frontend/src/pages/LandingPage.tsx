import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Waves, 
  Map, 
  ShieldAlert, 
  Compass, 
  Sliders, 
  FileText, 
  Cpu, 
  Database, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Layers,
  Activity,
  GitBranch
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#08111F] text-slate-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-800">
        {/* Visual background grid / topographic contours */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Smart India Hackathon • Problem Statement SIH26161
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Predict Flood Impact. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
                Visualize Risk. Protect Communities.
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              An intelligent geospatial platform for dam-break inundation modelling, downstream risk assessment, and emergency-response planning.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold px-6 py-3 rounded-lg shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition"
              >
                <span>Open Flood Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/map"
                className="bg-[#122238] hover:bg-[#1a2f4c] text-cyan-300 border border-cyan-700/50 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition"
              >
                <Map className="w-4 h-4" />
                <span>Explore Demo Simulation</span>
              </Link>
              <a
                href="#architecture"
                className="text-slate-400 hover:text-white font-medium px-4 py-3 flex items-center gap-1.5 transition text-sm"
              >
                <span>System Architecture</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Scientific disclaimer badge */}
            <div className="mt-8 inline-block bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 text-left max-w-xl">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Scientific Responsibility Principle:</strong> FLOODWISE AI separates hydrodynamic simulation calculation (HEC-RAS 2D physics engine) from presentation software. React and AI assist in analysis, but do not replace validated fluid dynamics.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Feature Hero Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-[#0D192B] border border-slate-800 rounded-xl p-6 hover:border-cyan-500/40 transition">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Parametric Dam Breach</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Configure reservoir elevation, overtopping vs. piping failure modes, breach width progression, and Manning roughness coefficients.
              </p>
            </div>

            <div className="bg-[#0D192B] border border-slate-800 rounded-xl p-6 hover:border-cyan-500/40 transition">
              <div className="w-10 h-10 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 mb-4">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Dynamic Inundation Maps</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                High-resolution 2D water depth contours, velocity gradients, flood arrival times, and observation station cross-sections.
              </p>
            </div>

            <div className="bg-[#0D192B] border border-slate-800 rounded-xl p-6 hover:border-cyan-500/40 transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Flood-Aware Evacuation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect exposed settlements to designated high-ground shelters with time-to-inundation windows and crossing safety checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIH26161 Problem Context Section */}
      <section className="py-16 bg-[#0B1526] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">Problem Statement SIH26161</span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                Dam Break Inundation Modelling Using Hydrodynamic Modelling of Any River
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                India has over 5,700 large dams that provide essential irrigation and hydroelectric power. However, extreme precipitation events, structural stress, or spillway limitations carry catastrophic downstream failure risks.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Conventional emergency action plans frequently rely on static paper reports that cannot rapidly adapt to varying reservoir storage conditions, sudden breach mechanics, or dynamically assess affected villages and arterial roadways.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Supports any river basin using standardized GeoJSON & DEM elevation rasters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Calculates water depths, peak flow velocities, and critical arrival times</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Direct GIS overlay with schools, hospitals, bridges, and electrical grids</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#122238] border border-slate-700/80 rounded-xl p-6 shadow-2xl">
              <div className="text-xs font-mono text-cyan-400 mb-3 flex items-center justify-between border-b border-slate-700/80 pb-2">
                <span>SIMULATION BENCHMARK: TAWA BASIN</span>
                <span className="text-emerald-400">EPSG:4326</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Dam Crest Elevation:</span>
                  <span className="text-white font-mono font-medium">358.50 m MSL</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Simulated Failure Mode:</span>
                  <span className="text-amber-400 font-mono font-medium">Overtopping & Piping</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Peak Outflow Discharge:</span>
                  <span className="text-rose-400 font-mono font-medium">14,200 m³/s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Downstream Study Reach:</span>
                  <span className="text-white font-mono font-medium">45.2 km Valley Extent</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Exposed Settlements:</span>
                  <span className="text-cyan-300 font-mono font-medium">3 Downstream Wards</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/80">
                <Link
                  to="/simulation"
                  className="w-full block text-center bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg py-2 text-xs font-semibold transition"
                >
                  Configure New Dam-Break Scenario →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Main Architectural Layers */}
      <section id="architecture" className="py-20 bg-[#08111F] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">Engineering Rigor</span>
            <h2 className="text-3xl font-bold text-white mt-2">Six-Tier Platform Architecture</h2>
            <p className="text-slate-400 text-sm mt-3">
              Designed to guarantee clear separation between scientific hydrodynamic calculations and user experience presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#0D192B] border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Layer 1</span>
              <h3 className="text-white font-bold text-base mt-1 mb-2">Frontend Presentation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                React + TypeScript + Vite with Tailwind CSS, Lucide Icons, Recharts, and React Leaflet for seamless 2D spatial navigation.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0D192B] border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Layer 2</span>
              <h3 className="text-white font-bold text-base mt-1 mb-2">API Communication</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                High-performance REST API powered by FastAPI, Pydantic type validation, CORS control, and structured response schemas.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0D192B] border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Layer 3</span>
              <h3 className="text-white font-bold text-base mt-1 mb-2">Backend Application</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Study Service, Scenario Engine, GIS Spatial Intersections, and Alert Notification state machine (Draft → Approved → Sent).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0D192B] border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Layer 4</span>
              <h3 className="text-white font-bold text-base mt-1 mb-2">Scientific Computation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                HEC-RAS 2D Adapter interface, GeoPandas & Shapely spatial operations, and numerical boundary condition verifiers.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0D192B] border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Layer 5</span>
              <h3 className="text-white font-bold text-base mt-1 mb-2">Data Storage Layer</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                SQLite for zero-friction local SIH demonstration, architectured with SQLAlchemy ORM for instant PostgreSQL + PostGIS deployment.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0D192B] border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Layer 6</span>
              <h3 className="text-white font-bold text-base mt-1 mb-2">Output & Decision Support</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Flood maps, depth/velocity hydrographs, infrastructure exposure metrics, evacuation corridors, and downloadable compliance reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#060D18] text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-cyan-600 flex items-center justify-center text-slate-950 font-bold">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">FLOODWISE AI</span>
              <p className="text-[11px] text-slate-500">SIH26161 Dam-Break Hydrodynamic Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link>
            <Link to="/map" className="hover:text-cyan-400 transition">Interactive Map</Link>
            <Link to="/simulation" className="hover:text-cyan-400 transition">Workspace</Link>
            <Link to="/settings" className="hover:text-cyan-400 transition">Technical Docs</Link>
          </div>

          <p className="text-slate-500 text-center md:text-right">
            Built for Smart India Hackathon. Prototype for disaster management decision-support.
          </p>
        </div>
      </footer>
    </div>
  );
};
