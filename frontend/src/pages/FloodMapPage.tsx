import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Polyline, 
  Marker, 
  Popup, 
  LayersControl, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Info, 
  Sliders, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Navigation, 
  Search,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { apiService } from '../services/api';

// Custom SVG map marker creators for clean styling without broken png assets
const createMarkerIcon = (color: string, symbol: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: ${color};
        color: #fff;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.6);
      ">
        ${symbol}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const damIcon = createMarkerIcon('#0284C7', 'D');
const obsIcon = createMarkerIcon('#38BDF8', 'G');
const settleIcon = createMarkerIcon('#F59E0B', 'V');
const infraBridgeIcon = createMarkerIcon('#8B5CF6', 'B');
const infraHospitalIcon = createMarkerIcon('#EC4899', 'H');
const infraSchoolIcon = createMarkerIcon('#10B981', 'S');
const infraPowerIcon = createMarkerIcon('#EAB308', 'P');
const shelterIcon = createMarkerIcon('#22C55E', 'R');

// Center map on Tawa Basin
const MAP_CENTER: [number, number] = [22.6500, 77.7500];
const MAP_ZOOM = 11;

export const FloodMapPage: React.FC = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  
  // Layer visibility toggles
  const [showRiver, setShowRiver] = useState(true);
  const [showInundation, setShowInundation] = useState(true);
  const [showObservationPoints, setShowObservationPoints] = useState(true);
  const [showSettlements, setShowSettlements] = useState(true);
  const [showInfrastructure, setShowInfrastructure] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [inundationOpacity, setInundationOpacity] = useState(0.65);
  const [selectedScenario, setSelectedScenario] = useState<'SCEN-001' | 'SCEN-002'>('SCEN-001');

  useEffect(() => {
    async function loadMapData() {
      try {
        const data = await apiService.getDemoGeoJSON();
        setGeoData(data);
      } catch (err) {
        console.error('Failed to load map GeoJSON:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3 bg-[#122238] p-4 rounded-xl border border-slate-800">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Hydrodynamic GIS Spatial Layers...</span>
        </div>
      </div>
    );
  }

  // Filter features
  const features = geoData?.features || [];
  const damFeature = features.find((f: any) => f.properties?.feature_type === 'dam_structure');
  const riverFeature = features.find((f: any) => f.properties?.feature_type === 'river_network');
  const inundationZones = features.filter((f: any) => 
    f.properties?.feature_type === 'inundation_zone' && 
    (f.properties?.scenario_id === selectedScenario || !f.properties?.scenario_id)
  );
  const obsPoints = features.filter((f: any) => f.properties?.feature_type === 'observation_point');
  const settlements = features.filter((f: any) => f.properties?.feature_type === 'settlement');
  const infrastructure = features.filter((f: any) => f.properties?.feature_type === 'infrastructure');
  const shelters = features.filter((f: any) => f.properties?.feature_type === 'shelter');
  const routes = features.filter((f: any) => f.properties?.feature_type === 'evacuation_route');

  return (
    <div className="relative h-[calc(100vh-140px)] flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-[#08111F]">
      {/* Top Map Control Bar */}
      <div className="bg-[#0D192B] border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-xs">Flood Intelligence 2D Viewer</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-[#122238] border border-slate-700 rounded-lg px-2 py-1 text-xs">
            <span className="text-slate-400">Scenario:</span>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value as any)}
              className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="SCEN-001" className="bg-[#0D192B]">Scenario A: Overtopping (PMF)</option>
              <option value="SCEN-002" className="bg-[#0D192B]">Scenario B: Piping Failure</option>
            </select>
          </div>
        </div>

        {/* Demo Data Notice */}
        <div className="flex items-center gap-2 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-[11px]">DEMO DATA — NOT A REAL-TIME FLOOD FORECAST</span>
        </div>

        {/* Opacity slider */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="text-[11px] text-slate-400">Flood Opacity:</span>
          <input
            type="range"
            min="0.2"
            max="0.9"
            step="0.05"
            value={inundationOpacity}
            onChange={(e) => setInundationOpacity(parseFloat(e.target.value))}
            className="w-20 accent-cyan-400 cursor-pointer"
          />
          <span className="font-mono text-[11px] text-cyan-300">{Math.round(inundationOpacity * 100)}%</span>
        </div>
      </div>

      {/* Main Map Body */}
      <div className="relative flex-1">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* CartoDB Dark Matter Basemap */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Dam Marker */}
          {damFeature && (
            <Marker
              position={[damFeature.geometry.coordinates[1], damFeature.geometry.coordinates[0]]}
              icon={damIcon}
              eventHandlers={{ click: () => setSelectedFeature(damFeature.properties) }}
            >
              <Popup>
                <div className="text-xs">
                  <strong className="text-cyan-400 text-sm block mb-1">{damFeature.properties.name}</strong>
                  <p><strong>Crest Elevation:</strong> {damFeature.properties.crest_elevation_m} m</p>
                  <p><strong>Height:</strong> {damFeature.properties.height_m} m</p>
                  <p><strong>Capacity:</strong> {damFeature.properties.reservoir_capacity_mcm} MCM</p>
                  <p className="text-amber-400 mt-1 font-semibold">{damFeature.properties.status}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* River Centerline */}
          {showRiver && riverFeature && (
            <Polyline
              positions={riverFeature.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]])}
              pathOptions={{ color: '#0ea5e9', weight: 4, opacity: 0.85 }}
              eventHandlers={{ click: () => setSelectedFeature(riverFeature.properties) }}
            />
          )}

          {/* Inundation Extent Polygons */}
          {showInundation && inundationZones.map((zone: any) => (
            <Polygon
              key={zone.properties.id}
              positions={zone.geometry.coordinates[0].map((c: [number, number]) => [c[1], c[0]])}
              pathOptions={{
                fillColor: zone.properties.fill_color || '#ef4444',
                fillOpacity: inundationOpacity,
                color: zone.properties.fill_color || '#ef4444',
                weight: 1.5
              }}
              eventHandlers={{ click: () => setSelectedFeature(zone.properties) }}
            />
          ))}

          {/* Observation Telemetry Points */}
          {showObservationPoints && obsPoints.map((obs: any) => (
            <Marker
              key={obs.properties.id}
              position={[obs.geometry.coordinates[1], obs.geometry.coordinates[0]]}
              icon={obsIcon}
              eventHandlers={{ click: () => setSelectedFeature(obs.properties) }}
            >
              <Popup>
                <div className="text-xs">
                  <strong className="text-cyan-300 text-sm block mb-1">{obs.properties.name}</strong>
                  <p><strong>Chainage:</strong> Ch. {obs.properties.chainage_km} km</p>
                  <p><strong>Peak Depth:</strong> <span className="text-rose-400 font-bold">{obs.properties.peak_water_depth_m} m</span></p>
                  <p><strong>Peak Velocity:</strong> {obs.properties.peak_velocity_mps} m/s</p>
                  <p><strong>Arrival Time:</strong> {obs.properties.flood_arrival_hrs} hrs post-breach</p>
                  <p className="text-slate-400 text-[10px] mt-1">{obs.properties.data_source}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Settlements */}
          {showSettlements && settlements.map((set: any) => (
            <Marker
              key={set.properties.id}
              position={[set.geometry.coordinates[1], set.geometry.coordinates[0]]}
              icon={settleIcon}
              eventHandlers={{ click: () => setSelectedFeature(set.properties) }}
            >
              <Popup>
                <div className="text-xs">
                  <strong className="text-amber-300 text-sm block mb-1">{set.properties.name}</strong>
                  <p><strong>Population:</strong> {set.properties.population?.toLocaleString()}</p>
                  <p><strong>Exposure:</strong> <span className={set.properties.exposure_status === 'Safe' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{set.properties.exposure_status}</span></p>
                  <p><strong>Modelled Water Depth:</strong> {set.properties.modelled_depth_m} m</p>
                  <p><strong>Arrival Time:</strong> {set.properties.arrival_time_hrs} hrs</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Critical Infrastructure */}
          {showInfrastructure && infrastructure.map((inf: any) => {
            let icon = infraBridgeIcon;
            if (inf.properties.category === 'hospital') icon = infraHospitalIcon;
            if (inf.properties.category === 'school') icon = infraSchoolIcon;
            if (inf.properties.category === 'power_grid') icon = infraPowerIcon;

            return (
              <Marker
                key={inf.properties.id}
                position={[inf.geometry.coordinates[1], inf.geometry.coordinates[0]]}
                icon={icon}
                eventHandlers={{ click: () => setSelectedFeature(inf.properties) }}
              >
                <Popup>
                  <div className="text-xs">
                    <strong className="text-white text-sm block mb-1">{inf.properties.name}</strong>
                    <p><strong>Category:</strong> <span className="uppercase text-cyan-400">{inf.properties.category}</span></p>
                    <p><strong>Status:</strong> <span className="text-rose-400 font-bold">{inf.properties.exposure_status}</span></p>
                    <p><strong>Modelled Depth:</strong> {inf.properties.modelled_depth_m} m</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Designated Safe Shelters */}
          {showShelters && shelters.map((sh: any) => (
            <Marker
              key={sh.properties.id}
              position={[sh.geometry.coordinates[1], sh.geometry.coordinates[0]]}
              icon={shelterIcon}
              eventHandlers={{ click: () => setSelectedFeature(sh.properties) }}
            >
              <Popup>
                <div className="text-xs">
                  <strong className="text-emerald-300 text-sm block mb-1">{sh.properties.name}</strong>
                  <p><strong>Capacity:</strong> {sh.properties.capacity} persons</p>
                  <p><strong>Elevation:</strong> {sh.properties.elevation_m} m (Safe high ground)</p>
                  <p className="text-slate-300 mt-1">{sh.properties.facilities}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Evacuation Routes */}
          {showRoutes && routes.map((rt: any) => (
            <Polyline
              key={rt.properties.id}
              positions={rt.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]])}
              pathOptions={{ color: '#22C55E', weight: 3.5, dashArray: '6, 6', opacity: 0.9 }}
              eventHandlers={{ click: () => setSelectedFeature(rt.properties) }}
            />
          ))}
        </MapContainer>

        {/* Floating Layer Visibility Controls */}
        <div className="absolute top-4 left-4 z-[1000] bg-[#0D192B]/95 backdrop-blur border border-slate-700/80 rounded-xl p-3 shadow-2xl max-w-xs text-xs space-y-2">
          <div className="font-bold text-white uppercase text-[10px] tracking-wider pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>GIS Map Layers</span>
            <span className="text-cyan-400 text-[10px]">Active</span>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-1 bg-sky-400 rounded"></span> River Centerline
              </span>
              <input type="checkbox" checked={showRiver} onChange={(e) => setShowRiver(e.target.checked)} className="accent-cyan-400" />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> Inundation Extent
              </span>
              <input type="checkbox" checked={showInundation} onChange={(e) => setShowInundation(e.target.checked)} className="accent-cyan-400" />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-sky-400 rounded-full"></span> Observation Gauges
              </span>
              <input type="checkbox" checked={showObservationPoints} onChange={(e) => setShowObservationPoints(e.target.checked)} className="accent-cyan-400" />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Villages & Settlements
              </span>
              <input type="checkbox" checked={showSettlements} onChange={(e) => setShowSettlements(e.target.checked)} className="accent-cyan-400" />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span> Infrastructure Assets
              </span>
              <input type="checkbox" checked={showInfrastructure} onChange={(e) => setShowInfrastructure(e.target.checked)} className="accent-cyan-400" />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Designated Shelters
              </span>
              <input type="checkbox" checked={showShelters} onChange={(e) => setShowShelters(e.target.checked)} className="accent-cyan-400" />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-1 border-t-2 border-dashed border-emerald-400"></span> Evacuation Routes
              </span>
              <input type="checkbox" checked={showRoutes} onChange={(e) => setShowRoutes(e.target.checked)} className="accent-cyan-400" />
            </label>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-[#0D192B]/95 backdrop-blur border border-slate-700/80 rounded-xl p-3 shadow-2xl text-[11px] space-y-1.5">
          <div className="font-bold text-white text-[10px] uppercase tracking-wider mb-1">Depth Hazard Scale</div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#EF4444] opacity-80"></span>
            <span className="text-slate-300">&gt; 4.0 m (Critical Danger)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#F59E0B] opacity-80"></span>
            <span className="text-slate-300">1.5 - 4.0 m (Moderate Inundation)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#38BDF8] opacity-80"></span>
            <span className="text-slate-300">&lt; 1.5 m (Low-lying Floodplain)</span>
          </div>
        </div>

        {/* Feature Detail Inspector Sidebar Panel */}
        {selectedFeature && (
          <div className="absolute top-4 right-4 z-[1000] bg-[#0D192B]/95 backdrop-blur border border-cyan-500/40 rounded-xl p-4 shadow-2xl max-w-sm w-80 text-xs text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                <Info className="w-4 h-4" />
                <span>Feature Attributes</span>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-white text-sm">{selectedFeature.name || selectedFeature.id}</div>
              
              {selectedFeature.feature_type && (
                <div className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-cyan-300 rounded inline-block">
                  Type: {selectedFeature.feature_type}
                </div>
              )}

              {selectedFeature.peak_water_depth_m !== undefined && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Peak Water Depth:</span>
                  <span className="text-rose-400 font-bold font-mono">{selectedFeature.peak_water_depth_m} m</span>
                </div>
              )}

              {selectedFeature.peak_velocity_mps !== undefined && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Peak Flow Velocity:</span>
                  <span className="text-cyan-300 font-bold font-mono">{selectedFeature.peak_velocity_mps} m/s</span>
                </div>
              )}

              {selectedFeature.flood_arrival_hrs !== undefined && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Arrival Time post-break:</span>
                  <span className="text-amber-400 font-bold font-mono">{selectedFeature.flood_arrival_hrs} hrs</span>
                </div>
              )}

              {selectedFeature.population !== undefined && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Settlement Population:</span>
                  <span className="text-white font-mono font-medium">{selectedFeature.population.toLocaleString()}</span>
                </div>
              )}

              {selectedFeature.exposure_status && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Exposure Status:</span>
                  <span className={selectedFeature.exposure_status === 'Safe' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {selectedFeature.exposure_status}
                  </span>
                </div>
              )}

              {selectedFeature.capacity && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Shelter Capacity:</span>
                  <span className="text-emerald-300 font-bold">{selectedFeature.capacity} persons</span>
                </div>
              )}

              {selectedFeature.notes && (
                <div className="pt-2 text-[11px] text-slate-300 leading-normal bg-slate-900/60 p-2 rounded border border-slate-800">
                  {selectedFeature.notes}
                </div>
              )}

              <div className="pt-2 text-[10px] text-slate-500">
                <strong>Data Source:</strong> {selectedFeature.data_source || 'Synthetic SIH Demonstration Benchmark'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
