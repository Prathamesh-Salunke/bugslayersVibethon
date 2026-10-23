/**
 * Innovation 6: Explainable Smart Matching Engine
 * Applies hard safety and compatibility constraints first, then multi-criteria scoring.
 */

import { checkShelterCompatibility } from './compatibilityEngine';
import { calculateDistanceKm, estimateTravelTimeMinutes } from '../utils/geoUtils';

export function rankMatchingShelters(donation, shelters) {
  if (!donation || !shelters) return [];

  const results = shelters.map(shelter => {
    // Hard constraint: Compatibility Engine
    const compatibility = checkShelterCompatibility(donation, shelter);
    const distanceKm = calculateDistanceKm(
      donation.location?.lat,
      donation.location?.lng,
      shelter.location?.lat,
      shelter.location?.lng
    );
    const travelTimeMin = estimateTravelTimeMinutes(distanceKm);

    // Feasibility against food deadline
    const deadlineHours = donation.safeWindowHours || 3;
    const deadlineMinutes = deadlineHours * 60;
    const isDeadlineFeasible = travelTimeMin < deadlineMinutes - 20; // 20m safety buffer

    // Criteria weights (transparent scoring)
    let score = 0;
    const breakdown = [];

    if (!compatibility.isCompatible) {
      return {
        shelter,
        isCompatible: false,
        rejectedReasons: compatibility.rejectedReasons,
        score: 0,
        distanceKm,
        travelTimeMin,
        isDeadlineFeasible,
        recommendationLevel: 'INCOMPATIBLE',
        breakdown: ['Failed hard compatibility checks (see rejected reasons)'],
      };
    }

    // 1. Proximity Score (Max 35 pts)
    const proximityScore = Math.max(0, Math.round(35 - distanceKm * 2.5));
    score += proximityScore;
    breakdown.push(`Proximity: ${distanceKm} km (+${proximityScore} pts)`);

    // 2. Open Demand Match (Max 35 pts)
    const demand = shelter.openDemand || 0;
    let demandScore = 0;
    if (demand >= donation.quantity) {
      demandScore = 35;
      breakdown.push(`Full Demand Match (${demand} required vs ${donation.quantity} offered) (+35 pts)`);
    } else if (demand > 0) {
      demandScore = Math.round((demand / donation.quantity) * 35);
      breakdown.push(`Partial Demand Match (${demand} meals) (+${demandScore} pts)`);
    } else {
      demandScore = 10;
      breakdown.push('General Capacity Available (+10 pts)');
    }
    score += demandScore;

    // 3. Deadline Feasibility Buffer (Max 20 pts)
    if (isDeadlineFeasible) {
      const bufferMin = deadlineMinutes - travelTimeMin;
      const feasibilityScore = Math.min(20, Math.round(bufferMin / 4));
      score += feasibilityScore;
      breakdown.push(`Safe Delivery Window (+${feasibilityScore} pts, buffer ${bufferMin}m)`);
    } else {
      breakdown.push('Warning: Tight delivery deadline window (-15 pts)');
      score = Math.max(0, score - 15);
    }

    // 4. Facility Completeness (Max 10 pts)
    const facilityCount = Object.values(shelter.facilities || {}).filter(Boolean).length;
    const facilityScore = facilityCount * 2.5;
    score += facilityScore;
    breakdown.push(`Complete Facilities (${facilityCount}/4 verified) (+${facilityScore} pts)`);

    let recommendationLevel = 'MEDIUM';
    if (score >= 80) recommendationLevel = 'OPTIMAL MATCH';
    else if (score >= 60) recommendationLevel = 'FEASIBLE';
    else recommendationLevel = 'LOW PRIORITY';

    return {
      shelter,
      isCompatible: true,
      rejectedReasons: [],
      score: Math.min(100, Math.round(score)),
      distanceKm,
      travelTimeMin,
      isDeadlineFeasible,
      recommendationLevel,
      breakdown,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

export function rankFeasibleRiders(donation, destinationShelter, riders) {
  if (!donation || !riders) return [];

  return riders
    .filter(r => r.status === 'available')
    .map(rider => {
      const distToPickup = calculateDistanceKm(
        rider.currentLocation?.lat,
        rider.currentLocation?.lng,
        donation.location?.lat,
        donation.location?.lng
      );
      const pickupTimeMin = estimateTravelTimeMinutes(distToPickup);

      const capacityRatio = rider.capacity / donation.quantity;
      const canCarryEntireBatch = rider.capacity >= donation.quantity;

      let score = 0;
      const reasons = [];

      // Proximity to pickup (40 pts max)
      const proximityScore = Math.max(0, Math.round(40 - distToPickup * 3));
      score += proximityScore;
      reasons.push(`${distToPickup} km from pickup (+${proximityScore} pts)`);

      // Reliability Score (35 pts max)
      const reliabilityScore = Math.round((rider.reliability / 100) * 35);
      score += reliabilityScore;
      reasons.push(`${rider.reliability}% reliability rating (+${reliabilityScore} pts)`);

      // Capacity match (25 pts max)
      if (canCarryEntireBatch) {
        score += 25;
        reasons.push(`Single trip capacity (${rider.capacity} units >= ${donation.quantity}) (+25 pts)`);
      } else {
        const capScore = Math.round(capacityRatio * 20);
        score += capScore;
        reasons.push(`Partial capacity (${rider.capacity} units, requires split) (+${capScore} pts)`);
      }

      return {
        rider,
        score: Math.min(100, Math.round(score)),
        distToPickup,
        pickupTimeMin,
        canCarryEntireBatch,
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score);
}
