from typing import List, Dict, Any, Tuple
from shapely.geometry import shape, Point, Polygon
import json

class SpatialAnalyzer:
    """
    Performs GIS spatial analysis between hydrodynamic flood zones and geographic features
    using Shapely geometries.
    """

    @staticmethod
    def load_geojson_features(geojson_path: str) -> List[Dict[str, Any]]:
        with open(geojson_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get("features", [])

    @staticmethod
    def analyze_exposure(
        features: List[Dict[str, Any]],
        scenario_id: str = "SCEN-001",
        min_depth_threshold: float = 0.0
    ) -> Dict[str, Any]:
        """
        Overlay inundation polygons with settlements, infrastructure, and roads.
        """
        inundation_polys = []
        for feat in features:
            props = feat.get("properties", {})
            if props.get("feature_type") == "inundation_zone":
                if props.get("scenario_id") == scenario_id or not props.get("scenario_id"):
                    geom = shape(feat["geometry"])
                    inundation_polys.append((geom, props))

        exposed_features = []
        safe_features = []

        for feat in features:
            props = feat.get("properties", {})
            f_type = props.get("feature_type")
            if f_type in ["settlement", "infrastructure"]:
                geom = shape(feat["geometry"])
                point = Point(geom.x, geom.y) if geom.geom_type == "Point" else None

                is_intersecting = False
                zone_hazard = "None"
                
                if point:
                    for poly, poly_props in inundation_polys:
                        if poly.contains(point) or poly.touches(point):
                            is_intersecting = True
                            zone_hazard = poly_props.get("depth_class", "Exposed")
                            break

                feature_record = {
                    "id": props.get("id"),
                    "name": props.get("name"),
                    "category": props.get("category", f_type),
                    "coordinates": [geom.y, geom.x] if geom.geom_type == "Point" else [],
                    "modelled_depth_m": props.get("modelled_depth_m", 0.0),
                    "is_intersecting": is_intersecting,
                    "hazard_class": zone_hazard if is_intersecting else "Safe",
                    "population": props.get("population", 0)
                }

                if is_intersecting and feature_record["modelled_depth_m"] >= min_depth_threshold:
                    exposed_features.append(feature_record)
                else:
                    safe_features.append(feature_record)

        return {
            "scenario_id": scenario_id,
            "min_depth_threshold_m": min_depth_threshold,
            "total_evaluated": len(exposed_features) + len(safe_features),
            "exposed_count": len(exposed_features),
            "safe_count": len(safe_features),
            "exposed_features": exposed_features,
            "safe_features": safe_features
        }

spatial_analyzer = SpatialAnalyzer()
