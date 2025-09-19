from pydantic import BaseModel
from typing import List

class CalculationRequest(BaseModel):
    x: float
    y: float

class CalculationResponse(BaseModel):
    id: str
    result: float
    operation: str
    x: float
    y: float

class CalculationExport(BaseModel):
    id: str
    x: float
    y: float
    result: float
    operation: str
    timestamp: str

class ExportResponse(BaseModel):
    total_count: int
    calculations: List[CalculationExport]