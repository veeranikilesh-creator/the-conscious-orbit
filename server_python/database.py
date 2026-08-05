import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger("conscious_orbit.db")

# PostgreSQL Database Connection URL with environment variable override
POSTGRES_URI = os.getenv(
    "DATABASE_URL",
    os.getenv("POSTGRES_URI", "postgresql://postgres:postgres@127.0.0.1:5432/conscious_orbit")
)

# SQLite Fallback DB File. v2: the schema gained the full pipeline columns
# (transitions, module_results, clients) — a fresh filename avoids crashing
# on stale v1 databases left over from the old shim.
SQLITE_FALLBACK_URI = "sqlite:///./conscious_orbit_local_v2.db"

Base = declarative_base()

try:
    # Attempt connecting to PostgreSQL
    engine = create_engine(POSTGRES_URI, pool_pre_ping=True)
    # Test connection
    with engine.connect() as conn:
        logger.info("[db] Connected to PostgreSQL Database successfully.")
    DB_TYPE = "PostgreSQL"
except Exception as e:
    logger.warning(f"[db] Could not connect to PostgreSQL ({e}). Falling back to SQLite local database.")
    engine = create_engine(SQLITE_FALLBACK_URI, connect_args={"check_same_thread": False})
    DB_TYPE = "SQLite (Local Fallback)"

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
