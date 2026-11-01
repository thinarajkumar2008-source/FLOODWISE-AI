# FLOODWISE AI — Dam-Break Flood Intelligence Platform

**Smart India Hackathon (SIH) • Problem Statement SIH26161**  
- **Organization:** National Technical Research Organisation (NTRO)  
- **Theme:** Disaster Management  
- **Title:** *Dam Break Inundation Modelling Using Hydrodynamic Modelling of Any River*  

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_+_TypeScript-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Leaflet](https://img.shields.io/badge/GIS-React_Leaflet-199900.svg?style=flat&logo=leaflet)](https://react-leaflet.js.org/)
[![HEC-RAS](https://img.shields.io/badge/Hydrodynamic-HEC--RAS_2D_Adapter-0284C7.svg?style=flat)](https://www.hec.usace.army.mil/software/hec-ras/)
[![Test Status](https://img.shields.io/badge/Tests-8%20Passed-brightgreen.svg?style=flat)](tests)

---

## 🌊 Project Introduction
**FLOODWISE AI** is an enterprise-grade geospatial disaster-intelligence and decision-support platform. It is engineered to simulate dam-breach hydrodynamics, compute downstream flood propagation using 2D shallow water approximations, evaluate critical infrastructure and population vulnerability, and plan flood-aware evacuation corridors before catastrophic inundation waves strike downstream communities.

### 🎯 Project Objective
To deliver a modular, scientifically grounded, and extensible software framework for dam-break inundation modeling across any river basin. The platform provides disaster management officials, dam safety authorities, and emergency response teams with actionable, time-critical intelligence regarding flood arrival times, peak depths, flow velocities, exposed infrastructure assets, and safe evacuation corridors.

---

## ⚡ Key Features
- **Parametric Dam-Break Modeling Workspace**: Interactive configuration of reservoir storage volumes, pool elevations, breach geometry (Froehlich breach formulations), and failure modes (overtopping vs. piping).
- **Interactive 2D Flood Intelligence GIS**: Leaflet-powered multi-layer viewer supporting river centerlines, inundation depth contours, observation telemetry stations, settlements, infrastructure assets, and evacuation routes.
- **Dynamic Scenario Comparison**: Side-by-side analytical and hydrograph comparisons between baseline and alternative failure conditions (e.g., PMF Overtopping vs. Normal Pool Piping).
- **Spatial Exposure & Risk Assessment**: GIS vector intersection engine calculating affected populations, schools, hospitals, bridges, and power facilities with adjustable depth thresholds ($\ge 0.5$m, $\ge 1.5$m, $\ge 3.0$m).
- **Downstream Infrastructure Inventory**: Searchable and filterable asset database with direct CSV export capabilities.
- **Emergency Evacuation Planning Workspace**: Vetted evacuation routes connecting exposed settlements to safe high-ground shelters with time-to-inundation windows and crossing hazard checks.
- **Emergency Warning & Alert Escalation**: Four-stage governance lifecycle (`DRAFT` → `REVIEW` → `APPROVED` → `SENT`) with simulated dispatch.
- **Compliance Dossiers & Data Export**: Instant generation of standardized audit reports in CSV and JSON formats, with a printable executive PDF dossier.
- **Geospatial Data Manager**: Upload and coordinate reference system (CRS: `EPSG:4326`, `EPSG:32643`) validation for GeoJSON, CSV, and DEM GeoTIFF files.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | High-performance, type-safe user interface |
| **Build Tool & Bundler** | Vite | Rapid development and optimized production bundling |
| **Styling & Theme** | Tailwind CSS | Command-center dark navy/cyan visual theme |
| **Routing** | React Router v7 | Seamless client-side page navigation |
| **Geospatial Mapping** | Leaflet + React Leaflet | Interactive 2D GIS visualization |
| **Analytical Charts** | Recharts | Hydrographs, depth distributions, and comparison charts |
| **Icons** | Lucide React | Clean, consistent dashboard iconography |
| **Backend API** | Python 3.12 + FastAPI | High-throughput asynchronous REST API |
| **Data Validation** | Pydantic v2 | Strict schema and request/response validation |
| **ORM & Database** | SQLAlchemy + SQLite / PostGIS | Persistent relational and geospatial record storage |
| **Geospatial Processing** | Shapely | Precise vector polygon intersections and distance calculations |
| **Hydrodynamic Engine** | HEC-RAS 2D Adapter | Physics-based breach and 2D shallow water modeling interface |
| **Testing** | Pytest + Vitest | Automated integration and component testing |

---

## 🏛️ Project Architecture
The platform enforces strict separation between presentation software and scientific calculation engines:

```
                  FLOODWISE AI
       Dam-Break Flood Intelligence Platform
                         |
          +--------------+--------------+
          |                             |
          v                             v
    PUBLIC WEBSITE                USER APPLICATION
    Landing Page                  Executive Dashboard
    Problem Statement             Flood Intelligence 2D GIS
    Architecture                  Simulation Workspace
    Scientific Disclaimers        Scenario Comparison
                                  Risk Assessment & Exposure
                                  Evacuation Planning
                                  Alerts & Notifications
                                  Reports & Dossier Generator
                                          |
                                          v
                              FRONTEND PRESENTATION LAYER
                              React 19 + TypeScript + Vite + Tailwind CSS
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
       Study Service     Scenario Engine  GIS Service        Alert Service
       Basin Profiles    Breach Physics  Spatial Analysis   State Machine
            |                 |            |                    |
            +-----------------+------------+--------------------+
                                          |
                                          v
                               SCIENTIFIC COMPUTATION
                            +-------------+-------------+
                            |                           |
                            v                           v
                    Hydrodynamic Engine          Geospatial Engine
                    HEC-RAS 2D Adapter           Shapely / GeoPandas
                    Breach Formulations          Spatial Intersections
                            |                           |
                            +-------------+-------------+
                                          |
                                          v
                                  DATA STORAGE LAYER
                      +-------------------+------------------+
                      |                   |                  |
                      v                   v                  v
                  SQLite / PostgreSQL   Spatial Geometry   File Storage
                  Studies & Scenarios   GeoJSON Polygons   GeoTIFF / CSV
```

---

## 📁 Directory Structure
```
FLOODWISE_AI/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Layout, Navbar, Sidebar, DemoBanner
│   │   ├── pages/                # 12 Full-fidelity application modules
│   │   ├── services/api.ts       # API communication service
│   │   ├── types/index.ts        # TypeScript interfaces
│   │   └── data/demo_geojson.json
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # Python + FastAPI + SQLAlchemy + Shapely
│   ├── app/
│   │   ├── main.py               # Application entrypoint & table auto-seeder
│   │   ├── config.py             # Settings & environment variables
│   │   ├── database.py           # SQLAlchemy session engine
│   │   ├── models/               # Database models (Study, Scenario, Simulation, Alert, etc.)
│   │   ├── schemas/              # Pydantic v2 schemas
│   │   ├── routers/              # 12 Modular REST API endpoints
│   │   ├── gis/                  # Shapely vector exposure analyzer
│   │   ├── simulation/           # HEC-RAS 2D Hydrodynamic Adapter
│   │   ├── notifications/        # Alert escalation dispatcher
│   │   └── reports/              # CSV/JSON report generators
│   ├── tests/                    # Pytest integration suite
│   ├── requirements.txt
│   └── .env.example
├── data/
│   └── demo/                     # WGS 84 GeoJSON demonstration dataset
├── docs/                         # Technical architecture, API, and format specs
└── README.md
```

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18 or later (v24 tested)
- **Python**: 3.11 or later (Python 3.12 tested)
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/thinarajkumar2008-source/FLOODWISE-AI.git
cd FLOODWISE-AI
```

---

### Step 2: Configure & Run Backend API
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- **Backend API**: `http://127.0.0.1:8000/api`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

---

### Step 3: Configure & Run Frontend Application
Open a new terminal:
```powershell
cd frontend
npm install
npm run dev
```
- **Web Application**: `http://localhost:5173`

---

## 🧪 Testing

### Backend Test Suite
```powershell
cd backend
.\venv\Scripts\python -m pytest -v tests/
```
*(All 8 integration tests pass with 100% success rate)*

### Frontend Production Build
```powershell
cd frontend
npm run build
```
*(Generates clean, optimized static production bundle in `dist/`)*

---

## 📡 API Documentation Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, DB status, and HEC-RAS engine detection |
| `GET` | `/api/dashboard/summary` | Aggregate platform statistics and metrics |
| `GET` | `/api/studies` | List all river basin study areas |
| `POST` | `/api/studies` | Create a new study area record |
| `GET` | `/api/scenarios` | List scenarios for a given study |
| `GET` | `/api/scenarios/compare` | Multi-scenario hydraulic comparison |
| `POST` | `/api/simulations/{id}/validate` | Validate boundary conditions and breach parameters |
| `POST` | `/api/simulations/{id}/run` | Execute hydrodynamic simulation job |
| `GET` | `/api/maps/layers` | Fetch complete GeoJSON FeatureCollection for 2D map |
| `GET` | `/api/risk/exposure` | Perform real-time spatial vector exposure analysis |
| `GET` | `/api/infrastructure` | Filterable downstream infrastructure asset registry |
| `GET` | `/api/evacuation/routes` | Fetch vetted evacuation corridors and safe departure windows |
| `GET` | `/api/alerts` | Retrieve emergency warning advisories |
| `POST` | `/api/alerts` | Create draft alert bulletin |
| `POST` | `/api/alerts/{id}/review` | Submit alert for technical review |
| `POST` | `/api/alerts/{id}/approved` | Authorize emergency advisory |
| `POST` | `/api/alerts/{id}/sent` | Dispatch simulated warning broadcast |
| `GET` | `/api/reports/csv` | Download standardized CSV audit dossier |
| `POST` | `/api/datasets` | Ingest and validate uploaded geospatial datasets |

For interactive testing of all endpoints, visit `http://127.0.0.1:8000/docs`.

---

## 🔮 Future Enhancements
- Direct automated HDF5 parsing for HEC-RAS 2D unsteady meshes.
- Integration of CesiumJS 3D terrain and volumetric flood surface rendering.
- Real-time rainfall telemetry ingestion from IMD radar and automated hydrological runoff forecasting.
- Machine learning-driven dynamic population exposure estimation using nighttime satellite imagery.
- SMS Gateway and CAP (Common Alerting Protocol) live broadcast integration for district disaster authorities.

---

## ⚠️ Scientific Limitations & Disclaimer
> **DEMONSTRATION DATA — NOT A VERIFIED REAL-TIME FLOOD FORECAST.**  
> FLOODWISE AI is a decision-support prototype developed for Smart India Hackathon. While all hydraulic relationships, breach formulations, and spatial coordinates adhere to realistic principles, real-world deployment requires certified LiDAR digital elevation models, bathymetric cross-section surveys, and official authorization from the Central Water Commission (CWC) and State Disaster Management Authorities (SDMA).
