from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime, time
from typing import Optional
from database import get_db
from models import Sale, Part

router = APIRouter()

# Kept in sync with the frontend's LOW_STOCK_THRESHOLD (index.js / parts.js) —
# same "needs attention" cutoff used on the home page and parts list.
LOW_STOCK_THRESHOLD = 3


def _range_bounds(start: Optional[date], end: Optional[date]):
    start_dt = datetime.combine(start, time.min) if start else None
    end_dt = datetime.combine(end, time.max) if end else None
    return start_dt, end_dt


def _sales_in_range(db: Session, start_dt, end_dt):
    query = db.query(Sale)
    if start_dt:
        query = query.filter(Sale.created_at >= start_dt)
    if end_dt:
        query = query.filter(Sale.created_at <= end_dt)
    return query


@router.get("/summary")
def get_summary(start: Optional[date] = None, end: Optional[date] = None, db: Session = Depends(get_db)):
    start_dt, end_dt = _range_bounds(start, end)
    sales = _sales_in_range(db, start_dt, end_dt).all()

    revenue = sum((s.sold_price or 0) * s.quantity for s in sales)
    cost = sum((s.part.buy_price or 0) * s.quantity for s in sales if s.part is not None)

    top_query = (
        db.query(Part.id, Part.name, func.sum(Sale.quantity).label("qty"))
        .join(Sale, Sale.part_id == Part.id)
    )
    if start_dt:
        top_query = top_query.filter(Sale.created_at >= start_dt)
    if end_dt:
        top_query = top_query.filter(Sale.created_at <= end_dt)
    top_rows = (
        top_query.group_by(Part.id, Part.name)
        .order_by(func.sum(Sale.quantity).desc())
        .limit(5)
        .all()
    )

    low_stock_parts = (
        db.query(Part)
        .filter(Part.stock <= LOW_STOCK_THRESHOLD)
        .order_by(Part.stock.asc())
        .all()
    )

    pending_count, pending_value = (
        db.query(func.count(Sale.id), func.coalesce(func.sum(Part.core_charge), 0.0))
        .join(Part, Sale.part_id == Part.id)
        .filter(Part.is_remanufactured == True, Sale.core_returned == False)
        .one()
    )

    return {
        "sales_count": len(sales),
        "revenue": revenue,
        "cost": cost,
        "net_profit": revenue - cost,
        "top_parts": [{"id": r.id, "name": r.name, "quantity": int(r.qty)} for r in top_rows],
        "low_stock_parts": [{"id": p.id, "name": p.name, "stock": p.stock} for p in low_stock_parts],
        "pending_cores": {"count": pending_count, "total_value": float(pending_value)},
    }
