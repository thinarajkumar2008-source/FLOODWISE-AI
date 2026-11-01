import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "hydrodynamic_engine" in data

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_studies" in data
    assert "completed_simulations" in data
    assert "exposed_infrastructure" in data
    assert "disclaimer" in data

def test_studies_list_and_create():
    # List
    response = client.get("/api/studies")
    assert response.status_code == 200
    studies = response.json()
    assert len(studies) >= 1

    # Create
    new_study = {
        "name": "Narmada Valley Test Study",
        "river_name": "Narmada River",
        "study_area": "Madhya Pradesh Basin",
        "dam_name": "Bargi Dam",
        "dam_lat": 22.937,
        "dam_lng": 79.914,
        "downstream_boundary_km": 50.0,
        "description": "Integration test study record",
        "data_source": "Pytest Suite",
        "status": "Active"
    }
    create_res = client.post("/api/studies", json=new_study)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == new_study["name"]
    assert "id" in created_data

def test_scenarios_compare():
    response = client.get("/api/scenarios/compare")
    assert response.status_code == 200
    data = response.json()
    assert "compared_count" in data
    assert len(data["scenarios"]) >= 1

def test_simulation_validation_and_run():
    # Test validation
    val_res = client.post("/api/simulations/SCEN-001/validate")
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["valid"] is True

    # Test run
    run_res = client.post("/api/simulations/SCEN-001/run")
    assert run_res.status_code == 200
    job_data = run_res.json()
    assert job_data["status"] == "COMPLETED"
    assert job_data["max_depth_m"] > 0
    assert job_data["flooded_area_sqkm"] > 0

    # Test logs
    logs_res = client.get(f"/api/simulations/{job_data['id']}/logs")
    assert logs_res.status_code == 200
    logs = logs_res.json()
    assert len(logs) >= 1

def test_spatial_exposure_analysis():
    response = client.get("/api/risk/exposure?scenario_id=SCEN-001&depth_threshold=1.0")
    assert response.status_code == 200
    data = response.json()
    assert "exposed_count" in data
    assert "safe_count" in data
    assert "exposed_features" in data

def test_alerts_lifecycle():
    # Create draft
    new_alert = {
        "title": "Severe Tailrace Water Surge Notice",
        "severity": "WARNING",
        "study_area": "Tawa River Basin",
        "scenario_name": "Scenario A",
        "message": "Immediate surge expected. Downstream riverbank lowlands must evacuate to high ground.",
        "affected_villages": ["Rampur Khurd", "Pipariya"],
        "status": "DRAFT",
        "delivery_status": "Pending Dispatch"
    }
    create_res = client.post("/api/alerts", json=new_alert)
    assert create_res.status_code == 201
    alert_id = create_res.json()["id"]

    # Submit for review
    review_res = client.post(f"/api/alerts/{alert_id}/review")
    assert review_res.status_code == 200
    assert review_res.json()["status"] == "REVIEW"

    # Approve
    approve_res = client.post(f"/api/alerts/{alert_id}/approved")
    assert approve_res.status_code == 200
    assert approve_res.json()["status"] == "APPROVED"
    assert approve_res.json()["approved_by"] is not None

    # Sent
    send_res = client.post(f"/api/alerts/{alert_id}/sent")
    assert send_res.status_code == 200
    assert send_res.json()["status"] == "SENT"

def test_reports_csv_download():
    response = client.get("/api/reports/csv?study_id=STUDY-DEMO-001")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "METRIC,VALUE,UNITS,PROVENANCE" in response.text
