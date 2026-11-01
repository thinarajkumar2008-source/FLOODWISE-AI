import demoData from '../data/demo_geojson.json';
import { 
  Study, 
  Scenario, 
  SimulationJob, 
  SimulationLog, 
  FloodObservationPoint, 
  InfrastructureFeature, 
  EvacuationRoute, 
  AlertRecord, 
  DatasetItem, 
  DashboardMetrics 
} from '../types';

const API_BASE = '/api';

// Helper for resilient fetch
async function fetchWithFallback<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[FLOODWISE API] Request to ${url} fell back to local store:`, err);
    return fallback;
  }
}

// Initial demonstration data store
export const INITIAL_STUDIES: Study[] = [
  {
    id: 'STUDY-DEMO-001',
    name: 'Tawa River Basin Dam-Break Study',
    river_name: 'Tawa River (Narmada Basin)',
    study_area: 'Hoshangabad - Narmadapuram District',
    dam_name: 'Tawa Hydro-Reservoir Dam',
    dam_lat: 22.5562,
    dam_lng: 77.8125,
    downstream_boundary_km: 45.2,
    description: 'Hypothetical dam breach inundation simulation assessing downstream impact across 45km valley reach to Narmada confluence.',
    data_source: 'Synthetically Modelled Hydrodynamic Benchmark for SIH26161',
    created_at: '2026-10-24 10:00',
    status: 'Active'
  },
  {
    id: 'STUDY-DEMO-002',
    name: 'Machi-2 Historical Calibration Study',
    river_name: 'Machhu River',
    study_area: 'Morbi District, Gujarat',
    dam_name: 'Machhu II Earthen Dam',
    dam_lat: 22.8120,
    dam_lng: 70.8750,
    downstream_boundary_km: 38.0,
    description: 'Historical benchmark calibration scenario using documented hydrologic peak records.',
    data_source: 'Benchmark Hydrology Open Access Records',
    created_at: '2026-10-20 14:30',
    status: 'Draft'
  }
];

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'SCEN-001',
    study_id: 'STUDY-DEMO-001',
    name: 'Scenario A: Overtopping Breach (PMF Storage)',
    code: 'SCEN-A-OVERTOPPING',
    description: 'Worst-case catastrophic overtopping during Probable Maximum Flood with reservoir level at crest 358.5m.',
    reservoir_elevation_m: 358.5,
    storage_volume_mcm: 2312,
    dam_height_m: 57.9,
    dam_crest_length_m: 1480,
    breach_type: 'Overtopping',
    breach_width_m: 120,
    breach_side_slope_z: 1.0,
    breach_formation_time_hrs: 1.5,
    initial_discharge_cumec: 14200,
    manning_n_river: 0.035,
    manning_n_floodplain: 0.065,
    computational_domain_km2: 120.5,
    output_interval_mins: 15,
    modelling_engine: 'HEC-RAS 2D Adapter',
    engine_version: '6.4.1 (Simulated Interface)',
    is_reference: true,
    created_at: '2026-10-24 10:15'
  },
  {
    id: 'SCEN-002',
    study_id: 'STUDY-DEMO-001',
    name: 'Scenario B: Piping Failure at Normal Conservation Pool',
    code: 'SCEN-B-PIPING',
    description: 'Internal seepage piping erosion through embankment at normal pool elevation 355.4m with 2.8 hr breach progression.',
    reservoir_elevation_m: 355.4,
    storage_volume_mcm: 1980,
    dam_height_m: 57.9,
    dam_crest_length_m: 1480,
    breach_type: 'Piping Failure',
    breach_width_m: 65,
    breach_side_slope_z: 0.7,
    breach_formation_time_hrs: 2.8,
    initial_discharge_cumec: 8900,
    manning_n_river: 0.035,
    manning_n_floodplain: 0.065,
    computational_domain_km2: 120.5,
    output_interval_mins: 15,
    modelling_engine: 'HEC-RAS 2D Adapter',
    engine_version: '6.4.1 (Simulated Interface)',
    is_reference: false,
    created_at: '2026-10-24 11:30'
  }
];

export const INITIAL_SIMULATIONS: SimulationJob[] = [
  {
    id: 'SIM-2026-001',
    study_id: 'STUDY-DEMO-001',
    scenario_id: 'SCEN-001',
    scenario_name: 'Scenario A: Overtopping Breach',
    status: 'COMPLETED',
    progress_percent: 100,
    started_at: '2026-10-24 10:20:00',
    completed_at: '2026-10-24 10:48:32',
    max_depth_m: 8.4,
    max_velocity_mps: 4.8,
    flooded_area_sqkm: 68.4,
    exposed_settlement_count: 3,
    exposed_infrastructure_count: 4,
    data_source: 'Synthetically Modelled Hydrodynamic Benchmark',
    validation_status: 'Demo Scenario - Synthetically Modelled',
    is_demo: true
  },
  {
    id: 'SIM-2026-002',
    study_id: 'STUDY-DEMO-001',
    scenario_id: 'SCEN-002',
    scenario_name: 'Scenario B: Piping Failure',
    status: 'COMPLETED',
    progress_percent: 100,
    started_at: '2026-10-24 11:35:00',
    completed_at: '2026-10-24 12:02:14',
    max_depth_m: 5.7,
    max_velocity_mps: 3.2,
    flooded_area_sqkm: 42.1,
    exposed_settlement_count: 2,
    exposed_infrastructure_count: 3,
    data_source: 'Synthetically Modelled Hydrodynamic Benchmark',
    validation_status: 'Demo Scenario - Synthetically Modelled',
    is_demo: true
  }
];

export const INITIAL_OBSERVATION_POINTS: FloodObservationPoint[] = [
  {
    id: 'OBS-01',
    name: 'Gauge Station G-1 (Tawa Dam Tailrace)',
    scenario_id: 'SCEN-001',
    latitude: 22.5645,
    longitude: 77.8105,
    distance_from_dam_km: 1.2,
    peak_depth_m: 7.8,
    peak_velocity_mps: 4.6,
    arrival_time_hrs: 0.2,
    recession_time_hrs: 18.5,
    simulation_timestamp: 'T + 00:12 hrs',
    data_source: 'HEC-RAS 2D Simulated Cross Section',
    validation_status: 'Demo Scenario - Synthetically Modelled'
  },
  {
    id: 'OBS-02',
    name: 'Gauge Station G-2 (Rampur Bridge Ch. 12km)',
    scenario_id: 'SCEN-001',
    latitude: 22.6080,
    longitude: 77.7915,
    distance_from_dam_km: 12.0,
    peak_depth_m: 5.4,
    peak_velocity_mps: 3.4,
    arrival_time_hrs: 0.8,
    recession_time_hrs: 24.2,
    simulation_timestamp: 'T + 00:48 hrs',
    data_source: 'HEC-RAS 2D Simulated Cross Section',
    validation_status: 'Demo Scenario - Synthetically Modelled'
  },
  {
    id: 'OBS-03',
    name: 'Gauge Station G-3 (Pipariya Bypass Ch. 24km)',
    scenario_id: 'SCEN-001',
    latitude: 22.6510,
    longitude: 77.7650,
    distance_from_dam_km: 24.0,
    peak_depth_m: 4.1,
    peak_velocity_mps: 2.5,
    arrival_time_hrs: 1.7,
    recession_time_hrs: 28.0,
    simulation_timestamp: 'T + 01:42 hrs',
    data_source: 'HEC-RAS 2D Simulated Cross Section',
    validation_status: 'Demo Scenario - Synthetically Modelled'
  },
  {
    id: 'OBS-04',
    name: 'Gauge Station G-4 (Sangam Confluence Ch. 42km)',
    scenario_id: 'SCEN-001',
    latitude: 22.7290,
    longitude: 77.7050,
    distance_from_dam_km: 42.0,
    peak_depth_m: 2.9,
    peak_velocity_mps: 1.8,
    arrival_time_hrs: 3.2,
    recession_time_hrs: 36.4,
    simulation_timestamp: 'T + 03:12 hrs',
    data_source: 'HEC-RAS 2D Simulated Cross Section',
    validation_status: 'Demo Scenario - Synthetically Modelled'
  }
];

export const INITIAL_INFRASTRUCTURE: InfrastructureFeature[] = [
  {
    id: 'INFRA-01',
    name: 'Rampur State Highway Bridge (SH-22)',
    category: 'bridge',
    study_area: 'Tawa River Basin',
    scenario_code: 'SCEN-A',
    latitude: 22.6090,
    longitude: 77.7900,
    exposure_status: 'High Risk',
    water_depth_m: 3.8,
    arrival_time_hrs: 0.75,
    distance_from_river_m: 20,
    data_source: 'PWD Geo-Database Demo',
    validation_status: 'Demo Modelled'
  },
  {
    id: 'INFRA-02',
    name: 'Pipariya Community Health Centre (CHC)',
    category: 'hospital',
    study_area: 'Tawa River Basin',
    scenario_code: 'SCEN-A',
    latitude: 22.6440,
    longitude: 77.7660,
    exposure_status: 'Exposed',
    water_depth_m: 1.8,
    arrival_time_hrs: 1.6,
    distance_from_river_m: 180,
    population_at_risk: 120,
    data_source: 'Health Dept GIS Demo',
    validation_status: 'Demo Modelled'
  },
  {
    id: 'INFRA-03',
    name: 'Rampur Higher Secondary School',
    category: 'school',
    study_area: 'Tawa River Basin',
    scenario_code: 'SCEN-A',
    latitude: 22.6010,
    longitude: 77.7970,
    exposure_status: 'Exposed',
    water_depth_m: 2.2,
    arrival_time_hrs: 0.8,
    distance_from_river_m: 110,
    population_at_risk: 450,
    data_source: 'Education Dept GIS',
    validation_status: 'Demo Modelled'
  },
  {
    id: 'INFRA-04',
    name: '132kV Pipariya Electric Substation',
    category: 'power_grid',
    study_area: 'Tawa River Basin',
    scenario_code: 'SCEN-A',
    latitude: 22.6530,
    longitude: 77.7590,
    exposure_status: 'High Risk',
    water_depth_m: 2.7,
    arrival_time_hrs: 1.5,
    distance_from_river_m: 90,
    data_source: 'MPPTCL Infrastructure',
    validation_status: 'Demo Modelled'
  },
  {
    id: 'INFRA-05',
    name: 'Shrikrishna Hilltop Township',
    category: 'settlement',
    study_area: 'Tawa River Basin',
    scenario_code: 'SCEN-A',
    latitude: 22.6320,
    longitude: 77.8280,
    exposure_status: 'Safe',
    water_depth_m: 0.0,
    arrival_time_hrs: 99.0,
    distance_from_river_m: 4200,
    data_source: 'Survey of India Demo',
    validation_status: 'Demo Modelled'
  }
];

export const INITIAL_EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: 'ROUTE-01',
    origin_settlement: 'Rampur Khurd Village (Pop: 2,840)',
    destination_shelter: 'Shrikrishna Hilltop Relief Complex (Elev: 372m)',
    distance_km: 6.8,
    estimated_time_mins: 24,
    status: 'Proposed — Requires Official Validation',
    flood_crossing_count: 0,
    safe_departure_window_hrs: 0.5,
    path_coordinates: [
      [22.6040, 77.7940],
      [22.6120, 77.8080],
      [22.6230, 77.8220],
      [22.6340, 77.8310]
    ],
    planning_notes: 'Critical window: Evacuate within 30 minutes of breach trigger. Route climbs directly east away from valley contour.'
  },
  {
    id: 'ROUTE-02',
    origin_settlement: 'Pipariya Downstream Ward (Pop: 6,120)',
    destination_shelter: 'District Stadium & Elevated Pavilion (Elev: 365m)',
    distance_km: 14.5,
    estimated_time_mins: 45,
    status: 'Proposed — Requires Official Validation',
    flood_crossing_count: 1,
    safe_departure_window_hrs: 1.2,
    path_coordinates: [
      [22.6480, 77.7620],
      [22.6750, 77.7510],
      [22.7100, 77.7440],
      [22.7520, 77.7380]
    ],
    planning_notes: 'Crosses low culvert near Ch. 4km. Police escort required. Path must be cleared before water arrives at T+1.2 hrs.'
  }
];

export const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: 'ALERT-001',
    title: 'Dam Breach Critical Flash Inundation Advisory',
    severity: 'CRITICAL',
    study_area: 'Tawa River Basin',
    scenario_name: 'Scenario A (PMF Overtopping)',
    message: 'CRITICAL HAZARD: Overtopping breach modelled. Downstream settlements (Rampur, Pipariya) have estimated flood arrival times of 45-90 minutes with water depths exceeding 3.5m. Execute immediate evacuation via Route 1A to Hilltop Shelter.',
    affected_villages: ['Rampur Khurd', 'Pipariya Downstream Ward', 'Sangam Nagar'],
    status: 'APPROVED',
    delivery_status: 'Simulated In-App',
    created_at: '2026-10-24 10:45',
    approved_at: '2026-10-24 10:50',
    approved_by: 'State Disaster Management Authority (SDMA Mock)'
  },
  {
    id: 'ALERT-002',
    title: 'Piping Failure Risk Watch Notice',
    severity: 'WARNING',
    study_area: 'Tawa River Basin',
    scenario_name: 'Scenario B (Piping)',
    message: 'WARNING: Internal seepage progression. Moderate downstream flooding expected in riverine lowlands within 2.5 hours. Low-lying agricultural zones and culverts should be evacuated immediately.',
    affected_villages: ['Rampur Lowlands', 'Pipariya Riverside'],
    status: 'REVIEW',
    delivery_status: 'Pending Dispatch',
    created_at: '2026-10-24 12:15'
  }
];

export const INITIAL_DATASETS: DatasetItem[] = [
  {
    id: 'DATA-001',
    name: 'Tawa_Basin_Downstream_Features.geojson',
    file_type: 'GeoJSON',
    source: 'National Hydrology Project Vector Baseline',
    coordinate_system: 'EPSG:4326 - WGS 84',
    spatial_extent: '22.50N to 22.80N, 77.60E to 77.90E',
    feature_count: 14,
    upload_date: '2026-10-24 09:30',
    file_size_kb: 420,
    validation_status: 'Validated',
    description: 'Validated vector layers covering river centerline, settlements, bridges, and relief shelters.'
  },
  {
    id: 'DATA-002',
    name: 'Tawa_HEC_RAS_2D_Inundation_Grid.csv',
    file_type: 'CSV',
    source: 'HEC-RAS 2D Simulation Output Mesh',
    coordinate_system: 'EPSG:4326 - WGS 84',
    spatial_extent: 'Reach Chainage 0km - 45.2km',
    feature_count: 1250,
    upload_date: '2026-10-24 10:45',
    file_size_kb: 1820,
    validation_status: 'Validated',
    description: 'Hydrodynamic cell mesh containing max water surface elevation, peak velocity vectors, and arrival timestamps.'
  },
  {
    id: 'DATA-003',
    name: 'CartoDEM_30m_Tawa_Valley.tif',
    file_type: 'GeoTIFF',
    source: 'Bhuvan CartoDEM 30m Gridded Elevation',
    coordinate_system: 'EPSG:32643 - UTM Zone 43N',
    spatial_extent: 'Bounding Box [77.6, 22.5, 77.9, 22.8]',
    feature_count: 1,
    upload_date: '2026-10-23 18:20',
    file_size_kb: 14300,
    validation_status: 'Validated',
    description: 'Digital Elevation Model raster used for computational 2D flow mesh generation.'
  }
];

// In-memory state for local persistence & interactive testing
let studiesState = [...INITIAL_STUDIES];
let scenariosState = [...INITIAL_SCENARIOS];
let simulationsState = [...INITIAL_SIMULATIONS];
let alertsState = [...INITIAL_ALERTS];
let datasetsState = [...INITIAL_DATASETS];
let infrastructureState = [...INITIAL_INFRASTRUCTURE];

export const apiService = {
  // Studies
  async getStudies(): Promise<Study[]> {
    return fetchWithFallback<Study[]>('/studies', studiesState);
  },
  async getStudy(id: string): Promise<Study | undefined> {
    const list = await this.getStudies();
    return list.find(s => s.id === id);
  },
  async createStudy(study: Omit<Study, 'id' | 'created_at'>): Promise<Study> {
    const newStudy: Study = {
      ...study,
      id: `STUDY-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    try {
      const res = await fetch(`${API_BASE}/studies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudy)
      });
      if (res.ok) {
        const data = await res.json();
        studiesState = [data, ...studiesState];
        return data;
      }
    } catch (e) {
      console.warn('API create study failed, saving to local store:', e);
    }
    studiesState = [newStudy, ...studiesState];
    return newStudy;
  },

  // Scenarios
  async getScenarios(studyId?: string): Promise<Scenario[]> {
    const list = await fetchWithFallback<Scenario[]>('/scenarios', scenariosState);
    return studyId ? list.filter(s => s.study_id === studyId) : list;
  },
  async createScenario(scenario: Omit<Scenario, 'id' | 'created_at'>): Promise<Scenario> {
    const newScenario: Scenario = {
      ...scenario,
      id: `SCEN-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    try {
      const res = await fetch(`${API_BASE}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScenario)
      });
      if (res.ok) {
        const data = await res.json();
        scenariosState = [data, ...scenariosState];
        return data;
      }
    } catch (e) {
      console.warn('API create scenario failed, saving to local store:', e);
    }
    scenariosState = [newScenario, ...scenariosState];
    return newScenario;
  },

  // Simulations
  async getSimulations(): Promise<SimulationJob[]> {
    return fetchWithFallback<SimulationJob[]>('/simulations', simulationsState);
  },
  async runSimulation(scenarioId: string, studyId: string): Promise<SimulationJob> {
    try {
      const res = await fetch(`${API_BASE}/simulations/${scenarioId}/run`, {
        method: 'POST'
      });
      if (res.ok) {
        const job = await res.json();
        simulationsState = [job, ...simulationsState];
        return job;
      }
    } catch (e) {
      console.warn('Run simulation fallback trigger:', e);
    }
    const scenario = scenariosState.find(s => s.id === scenarioId) || scenariosState[0];
    const newJob: SimulationJob = {
      id: `SIM-${Date.now().toString().slice(-4)}`,
      study_id: studyId,
      scenario_id: scenarioId,
      scenario_name: scenario?.name || 'Synthesized Scenario',
      status: 'COMPLETED',
      progress_percent: 100,
      started_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      completed_at: new Date(Date.now() + 15000).toISOString().replace('T', ' ').slice(0, 19),
      max_depth_m: scenario.breach_type === 'Overtopping' ? 8.4 : 5.7,
      max_velocity_mps: scenario.breach_type === 'Overtopping' ? 4.8 : 3.2,
      flooded_area_sqkm: scenario.breach_type === 'Overtopping' ? 68.4 : 42.1,
      exposed_settlement_count: 3,
      exposed_infrastructure_count: 4,
      data_source: 'Synthetically Modelled Hydrodynamic Benchmark',
      validation_status: 'Demo Scenario - Synthetically Modelled',
      is_demo: true
    };
    simulationsState = [newJob, ...simulationsState];
    return newJob;
  },

  // Observation Points
  async getObservationPoints(scenarioId?: string): Promise<FloodObservationPoint[]> {
    return fetchWithFallback<FloodObservationPoint[]>('/maps/features', INITIAL_OBSERVATION_POINTS);
  },

  // Infrastructure
  async getInfrastructure(): Promise<InfrastructureFeature[]> {
    return fetchWithFallback<InfrastructureFeature[]>('/infrastructure', infrastructureState);
  },

  // Evacuation
  async getEvacuationRoutes(): Promise<EvacuationRoute[]> {
    return fetchWithFallback<EvacuationRoute[]>('/evacuation/routes', INITIAL_EVACUATION_ROUTES);
  },

  // Alerts
  async getAlerts(): Promise<AlertRecord[]> {
    return fetchWithFallback<AlertRecord[]>('/alerts', alertsState);
  },
  async updateAlertStatus(id: string, status: AlertRecord['status']): Promise<AlertRecord | undefined> {
    try {
      const res = await fetch(`${API_BASE}/alerts/${id}/${status.toLowerCase()}`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        alertsState = alertsState.map(a => a.id === id ? updated : a);
        return updated;
      }
    } catch (e) {
      console.warn('API alert update fallback:', e);
    }
    alertsState = alertsState.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          approved_at: status === 'APPROVED' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : a.approved_at,
          approved_by: status === 'APPROVED' ? 'SDMA Chief Hydro-Engineer (In-App)' : a.approved_by,
          delivery_status: status === 'SENT' ? 'Simulated In-App' : a.delivery_status
        };
      }
      return a;
    });
    return alertsState.find(a => a.id === id);
  },
  async createAlert(alert: Omit<AlertRecord, 'id' | 'created_at'>): Promise<AlertRecord> {
    const newAlert: AlertRecord = {
      ...alert,
      id: `ALERT-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    alertsState = [newAlert, ...alertsState];
    return newAlert;
  },

  // Datasets
  async getDatasets(): Promise<DatasetItem[]> {
    return fetchWithFallback<DatasetItem[]>('/datasets', datasetsState);
  },
  async addDataset(item: Omit<DatasetItem, 'id' | 'upload_date'>): Promise<DatasetItem> {
    const newItem: DatasetItem = {
      ...item,
      id: `DATA-${Date.now().toString().slice(-4)}`,
      upload_date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    datasetsState = [newItem, ...datasetsState];
    return newItem;
  },

  // GeoJSON features for map
  async getDemoGeoJSON(): Promise<any> {
    return fetchWithFallback<any>('/maps/layers', demoData);
  },

  // Metrics
  async getMetrics(): Promise<DashboardMetrics> {
    const studies = await this.getStudies();
    const sims = await this.getSimulations();
    const infra = await this.getInfrastructure();

    const exposedCount = infra.filter(i => i.exposure_status !== 'Safe').length;
    const completedSims = sims.filter(s => s.status === 'COMPLETED').length;
    const runningSims = sims.filter(s => s.status === 'RUNNING').length;

    return {
      total_studies: studies.length,
      completed_simulations: completedSims,
      running_jobs: runningSims,
      pending_jobs: sims.filter(s => s.status === 'QUEUED' || s.status === 'VALIDATING').length,
      exposed_infrastructure: exposedCount,
      exposed_population: 10410,
      peak_depth_recorded: 8.4,
      total_inundated_sqkm: 68.4
    };
  }
};
