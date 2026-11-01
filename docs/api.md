# FLOODWISE AI — REST API Documentation

Base URL: `http://127.0.0.1:8000/api`  
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

---

## 1. System Health
### `GET /api/health`
Returns service status, database connectivity, and hydrodynamic engine detection.
```json
{
  "status": "healthy",
  "service": "FLOODWISE AI — Dam-Break Hydrodynamic Intelligence",
  "version": "1.0.0-SIH26161",
  "database": "sqlite_connected",
  "hydrodynamic_engine": {
    "hec_ras_detected": false,
    "mode": "Demonstration Synthetic Physics Adapter",
    "crs_supported": ["EPSG:4326", "EPSG:32643", "EPSG:32644"]
  }
}
```

---

## 2. Executive Dashboard
### `GET /api/dashboard/summary`
Returns aggregate platform statistics including total studies, completed runs, exposed infrastructure count, and peak flood depth.

---

## 3. Studies & Scenarios
### `GET /api/studies`
List all registered river basin study areas.

### `POST /api/studies`
Create a new dam study area with geographic bounding coordinates.

### `GET /api/scenarios`
List parametric dam-break scenarios. Query param: `?study_id=STUDY-DEMO-001`.

### `GET /api/scenarios/compare`
Compare hydraulic parameters, peak discharges, and flooded areas between scenarios. Query param: `?scenario_ids=SCEN-001,SCEN-002`.

---

## 4. Hydrodynamic Simulation
### `POST /api/simulations/{scenario_id}/validate`
Validates physical breach parameters (elevation, volume, width, formation time).

### `POST /api/simulations/{scenario_id}/run`
Executes 2D shallow water hydrodynamic modeling (or synthetic physics adapter) and persists job records.

### `GET /api/simulations/{job_id}/logs`
Returns standard output execution timestamps and step-by-step logs.

---

## 5. GIS & Exposure Analysis
### `GET /api/maps/layers`
Returns full GeoJSON FeatureCollection including river network, inundation contours, observation gauges, settlements, and shelters.

### `GET /api/risk/exposure`
Performs real-time spatial vector intersection between inundation polygons and critical infrastructure. Query params: `?scenario_id=SCEN-001&depth_threshold=1.5`.

### `GET /api/infrastructure`
Filterable registry of surveyed infrastructure features. Query params: `?category=hospital&exposure=Exposed`.

---

## 6. Evacuation & Emergency Alerts
### `GET /api/evacuation/routes`
Returns proposed evacuation corridors with distance, transit time, and safe departure lead times.

### `GET /api/alerts`
Returns emergency notification log.

### `POST /api/alerts`
Drafts a new emergency bulletin.

### `POST /api/alerts/{id}/review`
Advances alert from `DRAFT` to `REVIEW`.

### `POST /api/alerts/{id}/approved`
Advances alert from `REVIEW` to `APPROVED`.

### `POST /api/alerts/{id}/sent`
Dispatches simulated notification via in-app broadcast adapter.

---

## 7. Reports & Data Ingestion
### `GET /api/reports/csv`
Downloads standardized CSV report dossier. Query param: `?study_id=STUDY-DEMO-001`.

### `POST /api/datasets`
Ingests and validates uploaded GeoJSON, CSV, or DEM GeoTIFF files with CRS enforcement.
