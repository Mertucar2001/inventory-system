from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, ensure_schema
from routers import parts, sales, customers, reports, backups

Base.metadata.create_all(bind=engine)
ensure_schema()

app = FastAPI(title="Atölye CRM")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(parts.router, prefix="/parts", tags=["parts"])
app.include_router(sales.router, prefix="/sales", tags=["sales"])
app.include_router(customers.router, prefix="/customers", tags=["customers"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(backups.router, prefix="/backups", tags=["backups"])

@app.get("/")
def root():
    return {"message": "Atölye CRM API çalışıyor"}