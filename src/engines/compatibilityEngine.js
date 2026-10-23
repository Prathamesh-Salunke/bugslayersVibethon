/**
 * Innovation 5: Destination Compatibility Engine
 * Evaluates whether a shelter can safely receive and process a donation based on facilities and policies.
 */

export function checkShelterCompatibility(donation, shelter) {
  const rejectedReasons = [];

  // Check 1: Operating status
  if (shelter.status === 'closed' || shelter.status === 'closed_emergency') {
    rejectedReasons.push(`Shelter status is marked as CLOSED (${shelter.closeReason || 'Not currently accepting intake'}).`);
  }

  // Check 2: Remaining capacity
  const remainingCapacity = (shelter.capacity || 0) - (shelter.currentOccupancy || 0);
  if (remainingCapacity < (donation.quantity || 1)) {
    rejectedReasons.push(
      `Shelter remaining intake capacity (${remainingCapacity} units) is less than donation batch (${donation.quantity} units).`
    );
  }

  // Check 3: Clean water facility (for uncooked raw produce or dry grains needing cooking)
  if (donation.needsCooking && !shelter.facilities?.clean_water) {
    rejectedReasons.push(
      'Shelter lacks potable clean water required for food preparation.'
    );
  }

  // Check 4: Cooking fuel facility (for raw grains/pulses)
  if (donation.needsCooking && !shelter.facilities?.cooking_fuel) {
    rejectedReasons.push(
      'Shelter lacks active cooking fuel/gas facility to prepare raw ingredients.'
    );
  }

  // Check 5: Refrigeration / Cold Storage requirement
  if (
    (donation.storageMethod === 'Refrigerated (Below 4°C)' ||
      donation.requiresColdStorageShelter ||
      donation.category === 'Dairy Products') &&
    !shelter.facilities?.refrigeration
  ) {
    rejectedReasons.push(
      'Donation requires chilled cold storage (4°C), but shelter lacks refrigeration facilities.'
    );
  }

  // Check 6: Dietary constraints (e.g. Pure Vegetarian shelter)
  if (
    shelter.dietaryRestriction === 'Vegetarian Only' &&
    donation.isVegetarian === false
  ) {
    rejectedReasons.push(
      'Shelter strictly accepts vegetarian food only; donation contains non-vegetarian ingredients.'
    );
  }

  const isCompatible = rejectedReasons.length === 0;

  return {
    isCompatible,
    shelterId: shelter.id,
    shelterName: shelter.name,
    rejectedReasons,
    compatibilityScore: isCompatible ? 100 : Math.max(0, 100 - rejectedReasons.length * 35),
    facilityAudit: {
      hasRefrigeration: !!shelter.facilities?.refrigeration,
      hasCleanWater: !!shelter.facilities?.clean_water,
      hasCookingFuel: !!shelter.facilities?.cooking_fuel,
      hasDryStorage: !!shelter.facilities?.storage,
    },
  };
}
