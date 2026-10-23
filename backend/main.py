"""
ResQRoute — Backend API Services
FastAPI implementation of core smart coordination endpoints.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Optional
import math

from models import (
    DonationCreate,
    SafetyEvaluationResult,
    SplitPlanResponse,
    SplitPlanItem,
    Shelter,
    Rider,
    AuditLogEntry,
)

app = FastAPI(
    title="ResQRoute API",
    description="Smart Food Rescue & Last-Mile Aid Coordination Engine",
    version="1.0.0",
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Seed Data Store (mirrors SQLite schema)
DONATIONS_DB = []
AUDIT_DB = []

@app.get("/")
def read_root():
    return {
        "service": "ResQRoute Operations Grid",
        "tagline": "Rescue Food. Deliver Hope.",
        "status": "HEALTHY",
        "timestamp": datetime.utcnow().isoformat(),
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}

@app.post("/api/safety-eval", response_model=SafetyEvaluationResult)
def evaluate_food_safety(donation: DonationCreate):
    """
    Innovation 1: Smart Shelf-Life Eligibility Engine
    """
    now_iso = datetime.utcnow().isoformat()
    
    # Rule R-01: Critical safety parameters missing
    if not donation.category or not donation.storageMethod or donation.prepTimeHoursAgo is None:
        return SafetyEvaluationResult(
            status="REVIEW_REQUIRED",
            ruleId="RULE-R01",
            title="Review Required: Missing Critical Metadata",
            reason="Thermal holding history or preparation timestamps omitted.",
            safeWindowHours=0.0,
            disclaimer="Algorithmic check. Human food safety review required.",
            timestamp=now_iso,
        )

    # Rule R-02: Cooked food held at ambient room temp > 4 hours
    if donation.cookedOrPackaged == "Cooked" and "Room" in donation.storageMethod and donation.prepTimeHoursAgo > 4.0:
        return SafetyEvaluationResult(
            status="BLOCKED",
            ruleId="RULE-R02",
            title="Safety Block: Microbial Danger Zone (>4 hrs ambient)",
            reason=f"Held at ambient temperature for {donation.prepTimeHoursAgo} hrs; exceeds 4-hour microbial threshold.",
            safeWindowHours=0.0,
            disclaimer="Exceeds permissible limits. Preventative block enforced.",
            timestamp=now_iso,
        )

    # Rule R-04: Cooked food hot-held (>60°C)
    if donation.cookedOrPackaged == "Cooked" and "Hot" in donation.storageMethod:
        safe_left = max(0.0, 4.5 - donation.prepTimeHoursAgo)
        return SafetyEvaluationResult(
            status="ELIGIBLE",
            ruleId="RULE-R04",
            title="Eligible for Rapid Dispatch (Hot Held)",
            reason=f"Maintained at >60°C standard. Estimated safe window: {safe_left:.1f} hours.",
            safeWindowHours=safe_left,
            disclaimer="Hot holding temperature to be verified upon courier pickup.",
            timestamp=now_iso,
        )

    # Rule R-03: Refrigerated Cooked Food
    if donation.cookedOrPackaged == "Cooked" and "Refrigerated" in donation.storageMethod:
        safe_left = max(0.0, 24.0 - donation.prepTimeHoursAgo)
        return SafetyEvaluationResult(
            status="ELIGIBLE",
            ruleId="RULE-R03",
            title="Eligible for Matching (Chilled Chain)",
            reason=f"Chilled storage compliant. Viable window: {safe_left:.1f} hours. Destination requires cold storage.",
            safeWindowHours=safe_left,
            disclaimer="Requires verified cold chain.",
            timestamp=now_iso,
        )

    # Default eligible
    safe_left = max(0.0, 4.0 - donation.prepTimeHoursAgo)
    return SafetyEvaluationResult(
        status="ELIGIBLE",
        ruleId="RULE-R09",
        title="Eligible for Matching",
        reason=f"Meets freshness guidelines. Safe viable dispatch window: ~{safe_left:.1f} hours.",
        safeWindowHours=safe_left,
        disclaimer="Clearance is heuristic based on donor declaration.",
        timestamp=now_iso,
    )

@app.post("/api/split-allocation", response_model=SplitPlanResponse)
def calculate_split_allocation(quantity: int, rider_capacities: List[int]):
    """
    Innovation 2: Multi-Rider Smart Splitting
    """
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Invalid quantity")

    capacities = sorted([c for c in rider_capacities if c > 0], reverse=True)
    remaining = quantity
    plan = []

    for idx, cap in enumerate(capacities):
        if remaining <= 0:
            break
        alloc = min(cap, remaining)
        plan.append(
            SplitPlanItem(
                riderId=f"rider-{idx+1}",
                riderName=f"Courier Volunteer #{idx+1}",
                allocatedQuantity=alloc,
                percentageOfCapacity=int((alloc / cap) * 100),
            )
        )
        remaining -= alloc

    feasible = remaining == 0
    total_allocated = quantity - remaining

    return SplitPlanResponse(
        feasible=feasible,
        donationQuantity=quantity,
        totalAllocated=total_allocated,
        riderCount=len(plan),
        plan=plan,
        explanation=f"Allocated {total_allocated}/{quantity} units across {len(plan)} riders without exceeding capacities.",
    )
