# FLOODWISE AI — Supported Data Formats & Standards

## Supported Formats
FLOODWISE AI enforces standardized, open geospatial and hydraulic file standards:

| Format | Category | Usage | Enforced CRS |
| :--- | :--- | :--- | :--- |
| **GeoJSON (`.geojson`, `.json`)** | Vector Spatial | Rivers, Inundation Polygons, Settlements, Infrastructure | `EPSG:4326` (WGS 84) |
| **CSV (`.csv`)** | Tabular Spatial | Observation Point Hydrographs, Cross-Sections | Coordinates in Lat/Lng |
| **GeoTIFF (`.tif`, `.tiff`)** | Raster Elevation | Digital Elevation Models (DEMs), Terrain Grids | `EPSG:32643` / `EPSG:4326` |
| **HEC-RAS HDF5 (`.hdf`, `.h5`)** | Numerical Mesh | Native unsteady 2D simulation mesh outputs | Documented HEC-RAS format |

---

## 1. GeoJSON Structure Specification
Features must contain typed `properties` with explicit attributes:

```json
{
  "type": "Feature",
  "properties": {
    "id": "OBS-01",
    "feature_type": "observation_point",
    "name": "Gauge Station G-1 (Tawa Dam Tailrace)",
    "chainage_km": 1.2,
    "scenario_id": "SCEN-001",
    "peak_water_depth_m": 7.8,
    "peak_velocity_mps": 4.6,
    "flood_arrival_hrs": 0.2,
    "data_source": "HEC-RAS 2D Simulated Cross Section",
    "validation_status": "Demo Scenario - Synthetically Modelled"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [77.8105, 22.5645]
  }
}
```

---

## 2. Inundation Zone Hazard Classes
Polygons must define depth classes for proper cartographic rendering:
- `> 4.0 meters`: Critical Danger (`#EF4444`)
- `1.5 - 4.0 meters`: Moderate Inundation (`#F59E0B`)
- `< 1.5 meters`: Low-lying Floodplain (`#38BDF8`)
