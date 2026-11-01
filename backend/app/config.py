import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "FLOODWISE AI — Dam-Break Hydrodynamic Intelligence"
    VERSION: str = "1.0.0-SIH26161"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/floodwise.db")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]
    DEMO_DATA_FILE: Path = BASE_DIR.parent / "data" / "demo" / "narmada_tawa_demo.geojson"
    HEC_RAS_PATH: str = os.getenv("HEC_RAS_EXECUTABLE_PATH", "")

settings = Settings()
