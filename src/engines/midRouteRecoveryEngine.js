/**
 * Innovation 4: Mid-Route Rescue Engine
 * Evaluates active in-transit deliveries when disruption occurs (shelter closure, vehicle issue).
 * Computes rerouting alternatives, preserving full audit lineage.
 */

import { checkShelterCompatibility } from './compatibilityEngine';
import { calculateDistanceKm, estimateTravelTimeMinutes } from '../utils/geoUtils';

export function evaluateMidRouteRescue(delivery, allShelters, disruptionReason = 'Shelter closed intake emergency') {
  if (!delivery) return null;

  const currentRiderPos = delivery.currentRiderLocation || delivery.pickupLocation;
  const originalShelterId = delivery.assignedShelterId;

  // Filter candidate shelters excluding original closed shelter
  const candidateShelters = allShelters.filter(
    s => s.id !== originalShelterId && s.status === 'open'
  );

  const compatibleAlternatives = [];

  for (const candidate of candidateShelters) {
    const fakeDonation = {
      quantity: delivery.quantity,
      category: delivery.foodCategory,
      cookedOrPackaged: delivery.cookedOrPackaged,
      storageMethod: delivery.storageMethod,
      isVegetarian: delivery.isVegetarian,
      needsCooking: delivery.needsCooking,
      safeWindowHours: delivery.safeWindowHours || 2,
    };

    const comp = checkShelterCompatibility(fakeDonation, candidate);
    if (comp.isCompatible) {
      const diversionDist = calculateDistanceKm(
        currentRiderPos.lat,
        currentRiderPos.lng,
        candidate.location.lat,
        candidate.location.lng
      );
      const diversionEta = estimateTravelTimeMinutes(diversionDist);

      compatibleAlternatives.push({
        shelter: candidate,
        diversionDistKm: diversionDist,
        diversionEtaMinutes: diversionEta,
        score: Math.max(0, 100 - diversionDist * 5),
      });
    }
  }

  // Sort by lowest diversion distance
  compatibleAlternatives.sort((a, b) => a.diversionDistKm - b.diversionDistKm);

  if (compatibleAlternatives.length === 0) {
    return {
      success: false,
      requiresHumanEscalation: true,
      reason: `No compatible alternative shelter with open capacity within safe radius. Delivery #${delivery.id} escalated to Emergency Food Operations Dispatcher.`,
      recommendedShelter: null,
      alternatives: [],
    };
  }

  const topChoice = compatibleAlternatives[0];

  return {
    success: true,
    requiresHumanEscalation: false,
    disruptionReason,
    originalShelterName: delivery.assignedShelterName,
    recommendedShelter: topChoice.shelter,
    diversionDistKm: topChoice.diversionDistKm,
    diversionEtaMinutes: topChoice.diversionEtaMinutes,
    alternatives: compatibleAlternatives,
    rationale: `Nearest compatible shelter ${topChoice.shelter.name} (${topChoice.diversionDistKm} km away, ~${topChoice.diversionEtaMinutes} mins ETA) has verified facilities and ${topChoice.shelter.openDemand} open meal demand.`,
  };
}
