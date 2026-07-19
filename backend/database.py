from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./atolye.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ensure_schema():
    """Add columns introduced after the table was first created.
    create_all() only creates missing tables, not missing columns on
    tables that already exist, so an older atolye.db needs this too."""
    with engine.connect() as conn:
        existing = {row[1] for row in conn.execute(text("PRAGMA table_info(parts)"))}
        if "part_number" not in existing:
            conn.execute(text("ALTER TABLE parts ADD COLUMN part_number VARCHAR"))
        if "condition" not in existing:
            conn.execute(text("ALTER TABLE parts ADD COLUMN condition VARCHAR DEFAULT 'Yeni'"))
        if "chassis_code" not in existing:
            conn.execute(text("ALTER TABLE parts ADD COLUMN chassis_code VARCHAR"))
        if "vehicle_type" not in existing:
            conn.execute(text("ALTER TABLE parts ADD COLUMN vehicle_type VARCHAR DEFAULT 'Otomobil'"))
        if "is_remanufactured" not in existing:
            conn.execute(text("ALTER TABLE parts ADD COLUMN is_remanufactured BOOLEAN DEFAULT 0"))
        if "core_charge" not in existing:
            conn.execute(text("ALTER TABLE parts ADD COLUMN core_charge FLOAT"))

        existing_sales = {row[1] for row in conn.execute(text("PRAGMA table_info(sales)"))}
        if "core_returned" not in existing_sales:
            conn.execute(text("ALTER TABLE sales ADD COLUMN core_returned BOOLEAN DEFAULT 0"))
        if "core_value" not in existing_sales:
            conn.execute(text("ALTER TABLE sales ADD COLUMN core_value FLOAT"))
        conn.commit()