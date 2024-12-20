# Inside models.py (create this if you don't have it)
from pydantic import BaseModel
from typing import Dict, Any, Optional

class ServingSize(BaseModel):
    quantity: float

class ProductInfo(BaseModel):
    nutritionalInformation: Dict[str, Any]
    servingSize: ServingSize
