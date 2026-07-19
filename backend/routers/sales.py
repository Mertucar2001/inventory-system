from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Sale, Part
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SaleCreate(BaseModel):
    part_id: int
    customer_id: Optional[int] = None
    quantity: Optional[int] = 1
    sold_price: float
    note: Optional[str] = None
    core_returned: Optional[bool] = False
    core_value: Optional[float] = None

class SaleCoreUpdate(BaseModel):
    core_returned: bool
    core_value: Optional[float] = None

@router.get("/")
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).order_by(Sale.created_at.desc()).all()

@router.get("/{sale_id}")
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Satış bulunamadı")
    return sale

@router.post("/")
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == sale.part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Parça bulunamadı")
    if part.stock < sale.quantity:
        raise HTTPException(status_code=400, detail="Yeterli stok yok")

    db_sale = Sale(**sale.dict())
    part.stock -= sale.quantity

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.put("/{sale_id}/core")
def update_sale_core(sale_id: int, update: SaleCoreUpdate, db: Session = Depends(get_db)):
    """Narrow endpoint for resolving a pending core exchange after the
    sale — the customer brings the old part back days/weeks later.
    Deliberately scoped to only these two fields, not a general sale editor."""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Satış bulunamadı")
    sale.core_returned = update.core_returned
    sale.core_value = update.core_value
    db.commit()
    db.refresh(sale)
    return sale

@router.delete("/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Satış bulunamadı")
    part = db.query(Part).filter(Part.id == sale.part_id).first()
    if part:
        part.stock += sale.quantity
    db.delete(sale)
    db.commit()
    return {"message": "Satış silindi"}
