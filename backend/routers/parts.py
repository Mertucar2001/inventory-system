from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Part
from pydantic import BaseModel
from typing import Optional, Literal

router = APIRouter()

PartCondition = Literal["Yeni", "Yenilenmiş"]
VehicleType = Literal["Otomobil", "Kamyon", "Motosiklet", "Otobüs", "Tarım/İş Makinesi"]

class PartCreate(BaseModel):
    name: str
    brand: Optional[str] = None
    car_brand: Optional[str] = None
    car_model: Optional[str] = None
    vehicle_type: Optional[VehicleType] = "Otomobil"
    part_number: Optional[str] = None
    condition: Optional[PartCondition] = "Yeni"
    chassis_code: Optional[str] = None
    is_remanufactured: Optional[bool] = False
    core_charge: Optional[float] = None
    stock: Optional[int] = 0
    buy_price: Optional[float] = None
    sell_price: Optional[float] = None

class PartUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    car_brand: Optional[str] = None
    car_model: Optional[str] = None
    vehicle_type: Optional[VehicleType] = None
    part_number: Optional[str] = None
    condition: Optional[PartCondition] = None
    chassis_code: Optional[str] = None
    is_remanufactured: Optional[bool] = None
    core_charge: Optional[float] = None
    stock: Optional[int] = None
    buy_price: Optional[float] = None
    sell_price: Optional[float] = None

@router.get("/")
def get_parts(search: Optional[str] = None, vehicle_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Part)
    if search:
        query = query.filter(
            Part.name.contains(search) |
            Part.car_brand.contains(search) |
            Part.car_model.contains(search) |
            Part.brand.contains(search) |
            Part.part_number.contains(search) |
            Part.vehicle_type.contains(search)
        )
    if vehicle_type:
        query = query.filter(Part.vehicle_type == vehicle_type)
    return query.all()

@router.get("/{part_id}")
def get_part(part_id: int, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Parça bulunamadı")
    return part

@router.post("/")
def create_part(part: PartCreate, db: Session = Depends(get_db)):
    db_part = Part(**part.dict())
    db.add(db_part)
    db.commit()
    db.refresh(db_part)
    return db_part

@router.put("/{part_id}")
def update_part(part_id: int, part: PartUpdate, db: Session = Depends(get_db)):
    db_part = db.query(Part).filter(Part.id == part_id).first()
    if not db_part:
        raise HTTPException(status_code=404, detail="Parça bulunamadı")
    for key, value in part.dict(exclude_unset=True).items():
        setattr(db_part, key, value)
    db.commit()
    db.refresh(db_part)
    return db_part

@router.delete("/{part_id}")
def delete_part(part_id: int, db: Session = Depends(get_db)):
    db_part = db.query(Part).filter(Part.id == part_id).first()
    if not db_part:
        raise HTTPException(status_code=404, detail="Parça bulunamadı")
    db.delete(db_part)
    db.commit()
    return {"message": "Parça silindi"}
