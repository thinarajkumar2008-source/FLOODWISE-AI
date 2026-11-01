# FLOODWISE AI — System Architecture

## Overview
FLOODWISE AI is an enterprise-grade geospatial decision-support intelligence platform developed for **Smart India Hackathon Problem Statement SIH26161**:
> *"Dam Break Inundation Modelling Using Hydrodynamic Modelling of Any River."*

## Architectural Integrity Principle
The core architectural rule of FLOODWISE AI is the strict separation between:
1. **Frontend Presentation & Geospatial Visualization** (React + TypeScript + Vite + Tailwind CSS + React Leaflet)
2. **Scientific Computation & Hydrodynamic Simulation** (HEC-RAS 2D Adapter, Shallow Water Equations Solver, GeoPandas & Shapely Spatial Processing)

React and AI heuristics display, filter, and organize flood risk results, but **never substitute arbitrary mathematics or CSS animations for genuine hydrodynamic physics.**

```
                  FLOODWISE AI
       Dam-Break Flood Intelligence Platform
                         |
          +--------------+--------------+
          |                             |
          v                             v
    PUBLIC WEBSITE                USER APPLICATION
    Landing Page                  Authentication / Session
    About Project                 Executive Dashboard
    Features                      Flood Intelligence 2D GIS
    Documentation                 Simulation Workspace
                                  Risk Assessment & Exposure
                                  Evacuation Planning
                                          |
                                          v
                              FRONTEND PRESENTATION LAYER
                              React 19 + TypeScript + Vite
                              Tailwind CSS + Lucide Icons
                              React Router v7 + Recharts
                              React Leaflet (WGS 84 / CartoDB)
                                          |
                                          v
                                  API COMMUNICATION
                                 REST API (JSON & CSV)
                                          |
                                          v
                              BACKEND APPLICATION LAYER
                                  Python 3.12 + FastAPI
                                          |
            +-----------------------------+---------------------+
            |                 |            |                    |
            v                 v            v                    v
       User Service     Study Service  GIS Service        Alert Service
       Session/Profile  Scenarios     Spatial Analysis   State Machine
            |                 |            |                    |
            +-----------------+------------+--------------------+
                                          |
                                          v
                               SCIENTIFIC COMPUTATION
                                          |
                            +-------------+-------------+
                            |                           |
                            v                           v
                    Hydrodynamic Engine          Geospatial Engine
                    HEC-RAS 2D Adapter           GeoPandas / Shapely
                    Simulation Jobs & Logs       Spatial Intersections
                    Froehlich Peak Discharge     Distance & Buffers
                            |                           |
                            +-------------+-------------+
                                          |
                                          v
                                  DATA STORAGE LAYER
                                          |
                      +-------------------+------------------+
                      |                   |                  |
                      v                   v                  v
                  SQLite / PostgreSQL   Spatial Geometry   File Storage
                  Studies & Scenarios   GeoJSON Polygons   GeoTIFF Rasters
                  Simulation Jobs       Telemetry Gauges   CSV Summaries
                                          |
                                          v
                                 OUTPUT AND ANALYSIS
                                          |
                    +---------------------+-------------------+
                    |                     |                   |
                    v                     v                   v
               Flood Maps           Risk Dashboard     Emergency Planning
               Depth / Velocity     Village Exposure   Evacuation Corridors
               Arrival Hydrographs  Infrastructure     Alerts & Reports
```

## Six-Tier Architecture Details

### Tier 1: Frontend Presentation
- **Framework:** React 19 + TypeScript with Vite.
- **Styling:** Tailwind CSS with dark navy & cyan visual theme (`#08111F`, `#0D192B`, `#122238`, `#38BDF8`).
- **Mapping:** React Leaflet with high-contrast custom SVG glyph markers for Dams, Gauges, Settlements, Bridges, Hospitals, Schools, Power grids, and Shelters.
- **Charts:** Recharts for breach discharge hydrographs, depth distributions, and scenario comparative bar charts.

### Tier 2: API Communication
- Documented REST endpoints with OpenAPI / Swagger documentation (`/docs`).
- Pydantic v2 type validation for all inbound request payloads and responses.

### Tier 3: Backend Application Services
- `StudyService`: Manages multi-basin study areas and metadata.
- `ScenarioEngine`: Configures dam geometry, pool elevations, breach widths, and formation times.
- `JobManager`: Handles job status states: `DRAFT` → `VALIDATING` → `QUEUED` → `RUNNING` → `COMPLETED`.
- `AlertManager`: Governs emergency escalation lifecycle: `DRAFT` → `REVIEW` → `APPROVED` → `SENT`.

### Tier 4: Scientific Hydrodynamic Adapter
- Interface for HEC-RAS 2D execution.
- Includes Froehlich empirical breach equations and 2D shallow water attenuation curves for benchmark simulation when physical binaries are uninstalled.

### Tier 5: Data Storage
- Local development: SQLite with SQLAlchemy ORM.
- Production compatible: PostgreSQL + PostGIS with spatial indexing.

### Tier 6: Decision Support Outputs
- Exportable CSV datasets.
- JSON Geo-specifications.
- Printable PDF and operational evacuation plans.
