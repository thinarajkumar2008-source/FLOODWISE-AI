export type JobStatus = 'DRAFT' | 'VALIDATING' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type AlertStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'SENT' | 'REJECTED' | 'CANCELLED';
export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
export type InfrastructureCategory = 'settlement' | 'road' | 'bridge' | 'hospital' | 'school' | 'shelter' | 'power_grid' | 'water_facility';

export interface Study {
  id: string;
  name: string;
  river_name: string;
  study_area: string;
  dam_name: string;
  dam_lat: number;
  dam_lng: number;
  downstream_boundary_km: number;
  description: string;
  data_source: string;
  created_at: string;
  status: 'Active' | 'Archived' | 'Draft';
}

export interface Scenario {
  id: string;
  study_id: string;
  name: string;
  code: string;
  description: string;
  reservoir_elevation_m: number;
  storage_volume_mcm: number;
  dam_height_m: number;
  dam_crest_length_m: number;
  breach_type: 'Piping Failure' | 'Overtopping' | 'Structural Sudden Collapse';
  breach_width_m: number;
  breach_side_slope_z: number;
  breach_formation_time_hrs: number;
  initial_discharge_cumec: number;
  manning_n_river: number;
  manning_n_floodplain: number;
  computational_domain_km2: number;
  output_interval_mins: number;
  modelling_engine: string;
  engine_version: string;
  is_reference: boolean;
  created_at: string;
}

export interface SimulationJob {
  id: string;
  study_id: string;
  scenario_id: string;
  scenario_name: string;
  status: JobStatus;
  progress_percent: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  max_depth_m: number;
  max_velocity_mps: number;
  flooded_area_sqkm: number;
  exposed_settlement_count: number;
  exposed_infrastructure_count: number;
  data_source: string;
  validation_status: 'Scientifically Validated' | 'Demo Scenario - Synthetically Modelled' | 'Pending Review';
  is_demo: boolean;
}

export interface SimulationLog {
  id: string;
  job_id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export interface FloodObservationPoint {
  id: string;
  name: string;
  scenario_id: string;
  latitude: number;
  longitude: number;
  distance_from_dam_km: number;
  peak_depth_m: number;
  peak_velocity_mps: number;
  arrival_time_hrs: number;
  recession_time_hrs: number;
  simulation_timestamp: string;
  data_source: string;
  validation_status: string;
}

export interface InfrastructureFeature {
  id: string;
  name: string;
  category: InfrastructureCategory;
  study_area: string;
  scenario_code: string;
  latitude: number;
  longitude: number;
  exposure_status: 'Exposed' | 'Safe' | 'High Risk';
  water_depth_m: number;
  arrival_time_hrs: number;
  distance_from_river_m: number;
  population_at_risk?: number;
  data_source: string;
  validation_status: string;
}

export interface EvacuationRoute {
  id: string;
  origin_settlement: string;
  destination_shelter: string;
  distance_km: number;
  estimated_time_mins: number;
  status: 'Proposed — Requires Official Validation' | 'Validated Safe' | 'Impassable / Submerged';
  flood_crossing_count: number;
  safe_departure_window_hrs: number;
  path_coordinates: [number, number][];
  planning_notes: string;
}

export interface AlertRecord {
  id: string;
  title: string;
  severity: SeverityLevel;
  study_area: string;
  scenario_name: string;
  message: string;
  affected_villages: string[];
  status: AlertStatus;
  delivery_status: 'Simulated In-App' | 'Queued Mock SMS' | 'Pending Dispatch';
  created_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  file_type: 'GeoJSON' | 'CSV' | 'GeoTIFF' | 'HEC-RAS HDF5';
  source: string;
  coordinate_system: string;
  spatial_extent: string;
  feature_count: number;
  upload_date: string;
  file_size_kb: number;
  validation_status: 'Validated' | 'Processing' | 'Warning';
  description: string;
}

export interface DashboardMetrics {
  total_studies: number;
  completed_simulations: number;
  running_jobs: number;
  pending_jobs: number;
  exposed_infrastructure: number;
  exposed_population: number;
  peak_depth_recorded: number;
  total_inundated_sqkm: number;
}
