# HEC-RAS 2D Hydrodynamic Engine Integration Guide

## Introduction
FLOODWISE AI includes a modular adapter layer designed to interface with the U.S. Army Corps of Engineers **HEC-RAS (Hydrologic Engineering Center's River Analysis System)** software or compatible 2D hydrodynamic solvers.

---

## Adapter Interface: `HydrodynamicEngineAdapter`
Located in [`backend/app/simulation/engine_adapter.py`](file:///C:/Users/Thina%20rajkumar/.gemini/antigravity/scratch/FLOODWISE_AI/backend/app/simulation/engine_adapter.py):

```python
class HydrodynamicEngineAdapter:
    def is_engine_installed(self) -> bool:
        """Detects whether HEC-RAS binary is on PATH or HEC_RAS_EXECUTABLE_PATH."""
        ...
        
    def validate_simulation_parameters(self, params: Dict[str, Any]) -> List[str]:
        """Validates water level, breach geometry, and formation time."""
        ...

    def calculate_froehlich_peak_discharge(self, storage_volume_mcm, water_depth_m, breach_type) -> float:
        """Applies empirical breach formulations."""
        ...

    def run_demonstration_simulation(self, scenario_params) -> Dict[str, Any]:
        """Physics-based demonstration workflow with 2D attenuation."""
        ...
```

---

## How to Connect a Physical HEC-RAS Engine
1. **Install HEC-RAS 6.4+** on the server or workstation.
2. In `backend/.env`, set:
   ```env
   HEC_RAS_EXECUTABLE_PATH=C:\Program Files (x86)\HEC\HEC-RAS\6.4\Ras.exe
   ```
3. Prepare the HEC-RAS project plan (`.p01`, `.g01`, `.u01`).
4. FLOODWISE AI will trigger the command-line execution:
   ```cmd
   Ras.exe "project.prj" /c /p01
   ```
5. When HEC-RAS output HDF5 binary (`.p01.hdf`) is generated, the parser converts depth and velocity cell meshes into WGS 84 GeoJSON contours.

---

## When Engine is Not Installed (Demonstration Mode)
- The system automatically detects the absence of the binary.
- It displays the prominent banner:
  > **DEMONSTRATION DATA — NOT A REAL-TIME FLOOD FORECAST**
- It executes the benchmark Froehlich breach equations and outputs validated synthetic hydrographs.
