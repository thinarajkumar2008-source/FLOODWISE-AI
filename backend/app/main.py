from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.study import Study, Scenario, SimulationJob, SimulationLog, Dataset
from app.models.features import ObservationPoint, InfrastructureFeature, EvacuationRoute
from app.models.alerts import Alert

# Import all routers
from app.routers import (
    health,
    dashboard,
    studies,
    scenarios,
    simulations,
    maps,
    risk,
    infrastructure,
    evacuation,
    alerts,
    reports,
    datasets
)

def init_db_and_seed():
    """Create tables and initialize baseline benchmark demonstration data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Study).count() == 0:
            # Seed Study
            study = Study(
                id="STUDY-DEMO-001",
                name="Tawa River Basin Dam-Break Study",
                river_name="Tawa River (Narmada Basin)",
                study_area="Hoshangabad - Narmadapuram District",
                dam_name="Tawa Hydro-Reservoir Dam",
                dam_lat=22.5562,
                dam_lng=77.8125,
                downstream_boundary_km=45.2,
                description="Hypothetical dam breach inundation simulation assessing downstream impact across 45km valley reach to Narmada confluence.",
                data_source="Synthetically Modelled Hydrodynamic Benchmark for SIH26161",
                status="Active"
            )
            db.add(study)

            # Seed Scenarios
            scen_a = Scenario(
                id="SCEN-001",
                study_id="STUDY-DEMO-001",
                name="Scenario A: Overtopping Breach (PMF Storage)",
                code="SCEN-A-OVERTOPPING",
                description="Worst-case catastrophic overtopping during Probable Maximum Flood with reservoir level at crest 358.5m.",
                reservoir_elevation_m=358.5,
                storage_volume_mcm=2312,
                dam_height_m=57.9,
                dam_crest_length_m=1480,
                breach_type="Overtopping",
                breach_width_m=120,
                breach_side_slope_z=1.0,
                breach_formation_time_hrs=1.5,
                initial_discharge_cumec=14200,
                manning_n_river=0.035,
                manning_n_floodplain=0.065,
                computational_domain_km2=120.5,
                output_interval_mins=15,
                modelling_engine="HEC-RAS 2D Adapter",
                engine_version="6.4.1 (Simulated Interface)",
                is_reference=True
            )
            scen_b = Scenario(
                id="SCEN-002",
                study_id="STUDY-DEMO-001",
                name="Scenario B: Piping Failure at Normal Conservation Pool",
                code="SCEN-B-PIPING",
                description="Internal seepage piping erosion through embankment at normal pool elevation 355.4m with 2.8 hr breach progression.",
                reservoir_elevation_m=355.4,
                storage_volume_mcm=1980,
                dam_height_m=57.9,
                dam_crest_length_m=1480,
                breach_type="Piping Failure",
                breach_width_m=65,
                breach_side_slope_z=0.7,
                breach_formation_time_hrs=2.8,
                initial_discharge_cumec=8900,
                manning_n_river=0.035,
                manning_n_floodplain=0.065,
                computational_domain_km2=120.5,
                output_interval_mins=15,
                modelling_engine="HEC-RAS 2D Adapter",
                engine_version="6.4.1 (Simulated Interface)",
                is_reference=False
            )
            db.add_all([scen_a, scen_b])

            # Seed Simulation Jobs
            sim_a = SimulationJob(
                id="SIM-2026-001",
                study_id="STUDY-DEMO-001",
                scenario_id="SCEN-001",
                scenario_name="Scenario A: Overtopping Breach",
                status="COMPLETED",
                progress_percent=100,
                started_at=datetime.now(timezone.utc),
                completed_at=datetime.now(timezone.utc),
                max_depth_m=8.4,
                max_velocity_mps=4.8,
                flooded_area_sqkm=68.4,
                exposed_settlement_count=3,
                exposed_infrastructure_count=4,
                data_source="Synthetically Modelled Hydrodynamic Benchmark",
                validation_status="Demo Scenario - Synthetically Modelled",
                is_demo=True
            )
            db.add(sim_a)

            # Seed Observation Points
            obs = [
                ObservationPoint(
                    id="OBS-01",
                    scenario_id="SCEN-001",
                    name="Gauge Station G-1 (Tawa Dam Tailrace)",
                    latitude=22.5645,
                    longitude=77.8105,
                    chainage_km=1.2,
                    peak_water_depth_m=7.8,
                    peak_velocity_mps=4.6,
                    flood_arrival_hrs=0.2,
                    data_source="HEC-RAS 2D Simulated Cross Section"
                ),
                ObservationPoint(
                    id="OBS-02",
                    scenario_id="SCEN-001",
                    name="Gauge Station G-2 (Rampur Bridge Ch. 12km)",
                    latitude=22.6080,
                    longitude=77.7915,
                    chainage_km=12.0,
                    peak_water_depth_m=5.4,
                    peak_velocity_mps=3.4,
                    flood_arrival_hrs=0.8,
                    data_source="HEC-RAS 2D Simulated Cross Section"
                ),
                ObservationPoint(
                    id="OBS-03",
                    scenario_id="SCEN-001",
                    name="Gauge Station G-3 (Pipariya Bypass Ch. 24km)",
                    latitude=22.6510,
                    longitude=77.7650,
                    chainage_km=24.0,
                    peak_water_depth_m=4.1,
                    peak_velocity_mps=2.5,
                    flood_arrival_hrs=1.7,
                    data_source="HEC-RAS 2D Simulated Cross Section"
                )
            ]
            db.add_all(obs)

            # Seed Infrastructure
            infra = [
                InfrastructureFeature(
                    id="INFRA-01",
                    name="Rampur State Highway Bridge (SH-22)",
                    category="bridge",
                    study_area="Tawa River Basin",
                    scenario_code="SCEN-A",
                    latitude=22.6090,
                    longitude=77.7900,
                    exposure_status="High Risk",
                    water_depth_m=3.8,
                    arrival_time_hrs=0.75,
                    data_source="PWD Geo-Database Demo"
                ),
                InfrastructureFeature(
                    id="INFRA-02",
                    name="Pipariya Community Health Centre (CHC)",
                    category="hospital",
                    study_area="Tawa River Basin",
                    scenario_code="SCEN-A",
                    latitude=22.6440,
                    longitude=77.7660,
                    exposure_status="Exposed",
                    water_depth_m=1.8,
                    arrival_time_hrs=1.6,
                    population_at_risk=120,
                    data_source="Health Dept GIS Demo"
                ),
                InfrastructureFeature(
                    id="INFRA-03",
                    name="Rampur Higher Secondary School",
                    category="school",
                    study_area="Tawa River Basin",
                    scenario_code="SCEN-A",
                    latitude=22.6010,
                    longitude=77.7970,
                    exposure_status="Exposed",
                    water_depth_m=2.2,
                    arrival_time_hrs=0.8,
                    population_at_risk=450,
                    data_source="Education Dept GIS"
                ),
                InfrastructureFeature(
                    id="INFRA-04",
                    name="132kV Pipariya Electric Substation",
                    category="power_grid",
                    study_area="Tawa River Basin",
                    scenario_code="SCEN-A",
                    latitude=22.6530,
                    longitude=77.7590,
                    exposure_status="High Risk",
                    water_depth_m=2.7,
                    arrival_time_hrs=1.5,
                    data_source="MPPTCL Infrastructure"
                )
            ]
            db.add_all(infra)

            # Seed Evacuation Route
            evac = EvacuationRoute(
                id="ROUTE-01",
                origin_settlement="Rampur Khurd Village (Pop: 2,840)",
                destination_shelter="Shrikrishna Hilltop Relief Complex (Elev: 372m)",
                distance_km=6.8,
                estimated_time_mins=24,
                status="Proposed — Requires Official Validation",
                flood_crossing_count=0,
                safe_departure_window_hrs=0.5,
                path_coordinates=[[22.6040, 77.7940], [22.6120, 77.8080], [22.6230, 77.8220], [22.6340, 77.8310]],
                planning_notes="Immediate eastward climb away from valley contour."
            )
            db.add(evac)

            # Seed Alert
            alert = Alert(
                id="ALERT-001",
                title="Dam Breach Critical Flash Inundation Advisory",
                severity="CRITICAL",
                study_area="Tawa River Basin",
                scenario_name="Scenario A (PMF Overtopping)",
                message="CRITICAL HAZARD: Overtopping breach modelled. Downstream settlements (Rampur, Pipariya) have estimated flood arrival times of 45-90 minutes with water depths exceeding 3.5m. Execute immediate evacuation via Route 1A to Hilltop Shelter.",
                affected_villages=["Rampur Khurd", "Pipariya Downstream Ward", "Sangam Nagar"],
                status="APPROVED",
                delivery_status="Simulated In-App",
                approved_at=datetime.now(timezone.utc),
                approved_by="State Disaster Management Authority (SDMA Mock)"
            )
            db.add(alert)

            # Seed Dataset
            ds = Dataset(
                id="DATA-001",
                name="Tawa_Basin_Downstream_Features.geojson",
                file_type="GeoJSON",
                source="National Hydrology Project Vector Baseline",
                coordinate_system="EPSG:4326 - WGS 84",
                spatial_extent="22.50N to 22.80N, 77.60E to 77.90E",
                feature_count=14,
                file_size_kb=420,
                validation_status="Validated",
                description="Validated vector layers covering river centerline, settlements, bridges, and relief shelters."
            )
            db.add(ds)

            db.commit()
    finally:
        db.close()

# Initialize tables immediately on load
init_db_and_seed()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db_and_seed()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent Geospatial Dam-Break Inundation & Downstream Disaster Intelligence Platform for SIH26161.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware for development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under API prefix
app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)
app.include_router(studies.router, prefix=settings.API_PREFIX)
app.include_router(scenarios.router, prefix=settings.API_PREFIX)
app.include_router(simulations.router, prefix=settings.API_PREFIX)
app.include_router(maps.router, prefix=settings.API_PREFIX)
app.include_router(risk.router, prefix=settings.API_PREFIX)
app.include_router(infrastructure.router, prefix=settings.API_PREFIX)
app.include_router(evacuation.router, prefix=settings.API_PREFIX)
app.include_router(alerts.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)
app.include_router(datasets.router, prefix=settings.API_PREFIX)
