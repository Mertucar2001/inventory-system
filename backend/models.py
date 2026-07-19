from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    sales = relationship("Sale", back_populates="customer")


class Part(Base):
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String)
    car_brand = Column(String)
    car_model = Column(String)
    vehicle_type = Column(String, default="Otomobil")
    part_number = Column(String)
    condition = Column(String, default="Yeni")
    chassis_code = Column(String)
    is_remanufactured = Column(Boolean, default=False)
    core_charge = Column(Float)
    stock = Column(Integer, default=0)
    buy_price = Column(Float)
    sell_price = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    sales = relationship("Sale", back_populates="part")


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    quantity = Column(Integer, default=1)
    sold_price = Column(Float)
    note = Column(String)
    core_returned = Column(Boolean, default=False)
    core_value = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    part = relationship("Part", back_populates="sales")
    customer = relationship("Customer", back_populates="sales")