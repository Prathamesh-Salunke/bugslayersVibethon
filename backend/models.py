from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None

class Facilities(BaseModel):
    clean_water: bool = True
    cooking_fuel: bool = True
    refrigeration: bool = True
    storage: bool = True

class Shelter(BaseModel):
    id: str
    name: str
    address: str
    contact: str
    status: str = "open"  # open, closed, closed_emergency, full
    closeReason: Optional[str] = None
    capacity: int
    currentOccupancy: int
    openDemand: int
    receivedToday: int = 0
    dietaryRestriction: str = "None"
    facilities: Facilities
    location: Location

class Rider(BaseModel):
    id: str
    name: str
    phone: str
    vehicle: str
    capacity: int
    reliability: int
    status: str = "available"  # available, reserved, in_transit, offline
    currentLocation: Location
    completedDeliveries: int = 0
    rating: float = 4.9

class DonationCreate(BaseModel):
    donorName: str
    donorContact: str
    itemName: str
    category: str
    cookedOrPackaged: str  # Cooked, Packaged
    quantity: int
    unit: str = "meals"
    isVegetarian: bool = True
    prepTimeHoursAgo: float
    storageMethod: str
    packagingType: str
    hasStorageHistory: bool = True
    needsCooking: bool = False
    requiresColdStorageShelter: bool = False
    location: Location
    notes: Optional[str] = None

class SafetyEvaluationResult(BaseModel):
    status: str  # ELIGIBLE, REVIEW_REQUIRED, BLOCKED
    ruleId: str
    title: str
    reason: str
    safeWindowHours: float
    disclaimer: str
    timestamp: str

class SplitPlanItem(BaseModel):
    riderId: str
    riderName: str
    allocatedQuantity: int
    percentageOfCapacity: int

class SplitPlanResponse(BaseModel):
    feasible: bool
    donationQuantity: int
    totalAllocated: int
    riderCount: int
    plan: List[SplitPlanItem]
    explanation: str

class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    actionType: str
    actor: str
    target: str
    description: str
    severity: str = "INFO"
