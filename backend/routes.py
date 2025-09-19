from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import json
import io
from datetime import datetime
from database import get_db, Calculation
from models import CalculationRequest, CalculationResponse, CalculationExport, ExportResponse

router = APIRouter()


def save_calculation(db: Session, x: float, y: float, result: float, operation: str) -> Calculation:
    """Helper function to save calculation to database"""
    calculation = Calculation(
        x=x,
        y=y,
        result=result,
        operation=operation
    )
    db.add(calculation)
    db.commit()
    db.refresh(calculation)
    return calculation


@router.get("/")
def read_root():
    return {"message": "Calculator API is running"}


@router.post("/add", response_model=CalculationResponse)
def add(request: CalculationRequest, db: Session = Depends(get_db)):
    result = request.x + request.y
    calculation = save_calculation(
        db, request.x, request.y, result, "addition")

    return CalculationResponse(
        id=calculation.id,
        result=result,
        operation="addition",
        x=request.x,
        y=request.y
    )


@router.post("/subtract", response_model=CalculationResponse)
def subtract(request: CalculationRequest, db: Session = Depends(get_db)):
    result = request.x - request.y
    calculation = save_calculation(
        db, request.x, request.y, result, "subtraction")

    return CalculationResponse(
        id=calculation.id,
        result=result,
        operation="subtraction",
        x=request.x,
        y=request.y
    )


@router.post("/multiply", response_model=CalculationResponse)
def multiply(request: CalculationRequest, db: Session = Depends(get_db)):
    result = request.x * request.y
    calculation = save_calculation(
        db, request.x, request.y, result, "multiplication")

    return CalculationResponse(
        id=calculation.id,
        result=result,
        operation="multiplication",
        x=request.x,
        y=request.y
    )


@router.post("/divide", response_model=CalculationResponse)
def divide(request: CalculationRequest, db: Session = Depends(get_db)):
    if request.y == 0:
        raise HTTPException(status_code=400, detail="Cannot divide by zero")

    result = request.x / request.y
    calculation = save_calculation(
        db, request.x, request.y, result, "division")

    return CalculationResponse(
        id=calculation.id,
        result=result,
        operation="division",
        x=request.x,
        y=request.y
    )


@router.get("/history", response_model=ExportResponse)
def export_calculations(db: Session = Depends(get_db)):
    """Export all calculations as JSON response"""
    calculations = db.query(Calculation).order_by(
        Calculation.timestamp.desc()).all()

    return ExportResponse(
        total_count=len(calculations),
        calculations=[
            CalculationExport(
                id=calc.id,
                x=calc.x,
                y=calc.y,
                result=calc.result,
                operation=calc.operation,
                timestamp=calc.timestamp.isoformat()
            )
            for calc in calculations
        ]
    )


@router.get("/export-file")
def export_calculations_file(db: Session = Depends(get_db)):
    """Export all calculations as a downloadable JSON file"""
    calculations = db.query(Calculation).order_by(
        Calculation.timestamp.desc()).all()

    export_data = {
        "export_timestamp": datetime.utcnow().isoformat(),
        "total_count": len(calculations),
        "calculations": [
            {
                "id": calc.id,
                "x": calc.x,
                "y": calc.y,
                "result": calc.result,
                "operation": calc.operation,
                "timestamp": calc.timestamp.isoformat()
            }
            for calc in calculations
        ]
    }

    # Convert to JSON string
    json_str = json.dumps(export_data, indent=2)

    # Generate filename with timestamp
    filename = f"calculator_export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

    # Return as downloadable file
    return StreamingResponse(
        io.BytesIO(json_str.encode("utf-8")),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
