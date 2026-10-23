/**
 * Innovation 2: Multi-Rider Smart Splitting Engine
 * Handles oversized donations by partitioning quantity across multiple available riders.
 */

export function calculateMultiRiderSplit(donationQuantity, availableRiders, requiredDeadlineMinutes = 90) {
  if (!donationQuantity || donationQuantity <= 0) {
    return { feasible: false, error: 'Invalid donation quantity' };
  }

  // Filter riders who are available and have capacity > 0
  const eligibleRiders = availableRiders
    .filter(r => r.status === 'available' && r.capacity > 0)
    .sort((a, b) => {
      // Sort by reliability desc, then capacity desc
      if (b.reliability !== a.reliability) return b.reliability - a.reliability;
      return b.capacity - a.capacity;
    });

  if (eligibleRiders.length === 0) {
    return {
      feasible: false,
      allocatedQuantity: 0,
      shortfall: donationQuantity,
      plan: [],
      reason: 'No available riders currently active in the area.',
    };
  }

  let remaining = donationQuantity;
  const plan = [];

  for (const rider of eligibleRiders) {
    if (remaining <= 0) break;
    const allocation = Math.min(rider.capacity, remaining);
    plan.push({
      riderId: rider.id,
      riderName: rider.name,
      riderVehicle: rider.vehicle,
      riderCapacity: rider.capacity,
      allocatedQuantity: allocation,
      percentageOfRiderCapacity: Math.round((allocation / rider.capacity) * 100),
      reliabilityScore: rider.reliability,
    });
    remaining -= allocation;
  }

  const isComplete = remaining === 0;
  const totalAllocated = donationQuantity - remaining;

  const explanation = isComplete
    ? `Successfully split ${donationQuantity} units across ${plan.length} riders without exceeding individual carrying limits: ${plan
        .map(p => `${p.riderName} (${p.allocatedQuantity} units)`)
        .join(', ')}.`
    : `Partial allocation: assigned ${totalAllocated} / ${donationQuantity} units across ${plan.length} riders. Shortfall of ${remaining} units requires additional rider volunteers.`;

  return {
    feasible: isComplete,
    donationQuantity,
    totalAllocated,
    shortfall: remaining,
    riderCount: plan.length,
    plan,
    explanation,
  };
}
