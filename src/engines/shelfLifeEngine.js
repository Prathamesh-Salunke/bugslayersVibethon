/**
 * Innovation 1: Smart Shelf-Life Eligibility Engine
 * Transparent, rule-based algorithmic heuristic.
 * Keeps food safety eligibility separate from delivery-time feasibility.
 */

export const FOOD_CATEGORIES = {
  COOKED_MEAL: 'Cooked Meal (Rice/Curry/Gravy)',
  BAKERY: 'Bakery & Breads',
  DAIRY: 'Dairy Products',
  PACKAGED_DRY: 'Packaged & Dry Groceries',
  PRODUCE_RAW: 'Raw Produce / Uncut Veggies',
  SALAD_CUT_FRUITS: 'Cut Fruits & Fresh Salads',
};

export const STORAGE_METHODS = {
  ROOM_TEMP: 'Room Temperature (Ambient)',
  REFRIGERATED: 'Refrigerated (Below 4°C)',
  HOT_HOLD: 'Hot Hold (Above 60°C)',
  FROZEN: 'Frozen (-18°C)',
};

export function evaluateFoodSafetyEligibility(donation) {
  const {
    category,
    cookedOrPackaged,
    prepTimeHoursAgo,
    storageMethod,
    packagingType,
    verifiedUseByHoursRemaining,
    hasStorageHistory,
  } = donation;

  const evaluationTimestamp = new Date().toISOString();

  // Rule R-01: Critical Safety Metadata Missing
  if (
    !category ||
    cookedOrPackaged === undefined ||
    !storageMethod ||
    prepTimeHoursAgo === undefined ||
    prepTimeHoursAgo === null
  ) {
    return {
      status: 'REVIEW_REQUIRED',
      badgeColor: 'amber',
      ruleId: 'RULE-R01',
      title: 'Review Required (Missing Metadata)',
      reason:
        'Critical safety parameters (storage method or preparation timestamp) were omitted. Requires food safety inspector review before allocation.',
      safeWindowHours: 0,
      disclaimer:
        'Algorithmic eligibility check only. Missing parameters prevent automated clearance.',
      timestamp: evaluationTimestamp,
    };
  }

  // Rule R-02: Packaged Dry Goods with Verified Expiry
  if (category === FOOD_CATEGORIES.PACKAGED_DRY || cookedOrPackaged === 'Packaged') {
    if (verifiedUseByHoursRemaining !== undefined && verifiedUseByHoursRemaining <= 1) {
      return {
        status: 'BLOCKED',
        badgeColor: 'rose',
        ruleId: 'RULE-R07',
        title: 'Safety Block: Expiry Deadline Passed',
        reason:
          'Manufacturer best-before window has passed or has less than 60 minutes remaining.',
        safeWindowHours: 0,
        disclaimer: 'Expired packaged donations cannot be routed.',
        timestamp: evaluationTimestamp,
      };
    }
    return {
      status: 'ELIGIBLE',
      badgeColor: 'emerald',
      ruleId: 'RULE-R06',
      title: 'Eligible for Matching (Packaged / Shelf-Stable)',
      reason:
        'Packaged dry goods with intact seal and valid manufacturer date satisfy non-perishable eligibility guidelines.',
      safeWindowHours: verifiedUseByHoursRemaining || 72,
      disclaimer:
        'Eligible for matching based on declarative metadata. Visual seal inspection required at pickup.',
      timestamp: evaluationTimestamp,
    };
  }

  // Rule R-03: Cut Fruits or Fresh Salads held at Room Temp > 2 hours
  if (
    category === FOOD_CATEGORIES.SALAD_CUT_FRUITS &&
    storageMethod === STORAGE_METHODS.ROOM_TEMP &&
    prepTimeHoursAgo > 2
  ) {
    return {
      status: 'BLOCKED',
      badgeColor: 'rose',
      ruleId: 'RULE-R05',
      title: 'Safety Block: Perishable Cut Produce Danger Zone',
      reason:
        'Cut fruits or fresh salads held at ambient room temperature beyond 2 hours present severe bacterial propagation risk.',
      safeWindowHours: 0,
      disclaimer: 'Exceeds ambient microbial threshold. Spoilage risk too high.',
      timestamp: evaluationTimestamp,
    };
  }

  // Rule R-04: Cooked food at ambient temperature > 4 hours
  if (
    cookedOrPackaged === 'Cooked' &&
    storageMethod === STORAGE_METHODS.ROOM_TEMP &&
    prepTimeHoursAgo > 4
  ) {
    return {
      status: 'BLOCKED',
      badgeColor: 'rose',
      ruleId: 'RULE-R02',
      title: 'Safety Block: Temperature Danger Zone (>4 hrs)',
      reason:
        `Cooked food held at room temperature for ${prepTimeHoursAgo}h exceeds the 4-hour critical limit (danger zone 5°C - 60°C).`,
      safeWindowHours: 0,
      disclaimer:
        'Exceeds permissible holding duration. Preventative spoilage guard triggered.',
      timestamp: evaluationTimestamp,
    };
  }

  // Rule R-05: Cooked food hot-held (>60°C)
  if (cookedOrPackaged === 'Cooked' && storageMethod === STORAGE_METHODS.HOT_HOLD) {
    const remainingSafe = Math.max(0, 4.5 - prepTimeHoursAgo);
    if (remainingSafe < 0.75) {
      return {
        status: 'BLOCKED',
        badgeColor: 'rose',
        ruleId: 'RULE-R04B',
        title: 'Safety Block: Hot Hold Limit Reached',
        reason: 'Hot-held food has reached the 4.5-hour maximum holding threshold.',
        safeWindowHours: 0,
        disclaimer: 'Hot holding quality threshold expired.',
        timestamp: evaluationTimestamp,
      };
    }
    return {
      status: 'ELIGIBLE',
      badgeColor: 'emerald',
      ruleId: 'RULE-R04',
      title: 'Eligible for Rapid Dispatch (Hot Held)',
      reason:
        `Maintained at >60°C hot-hold standard. Estimated safe dispatch window: ${remainingSafe.toFixed(1)} hours remaining.`,
      safeWindowHours: remainingSafe,
      disclaimer: 'Hot holding temperature must be verified upon rider arrival.',
      timestamp: evaluationTimestamp,
    };
  }

  // Rule R-06: Refrigerated Cooked Food
  if (cookedOrPackaged === 'Cooked' && storageMethod === STORAGE_METHODS.REFRIGERATED) {
    const remainingSafe = Math.max(0, 24 - prepTimeHoursAgo);
    if (remainingSafe < 1) {
      return {
        status: 'BLOCKED',
        badgeColor: 'rose',
        ruleId: 'RULE-R03B',
        title: 'Safety Block: Cold Storage Time Limit',
        reason: 'Refrigerated cooked meal exceeds the 24-hour safe donation threshold.',
        safeWindowHours: 0,
        disclaimer: 'Cold storage time expired.',
        timestamp: evaluationTimestamp,
      };
    }
    return {
      status: 'ELIGIBLE',
      badgeColor: 'emerald',
      ruleId: 'RULE-R03',
      title: 'Eligible for Matching (Chilled Chain)',
      reason:
        `Chilled storage compliant. Estimated viable window: ${remainingSafe.toFixed(1)} hours remaining. Shelter must have refrigeration.`,
      safeWindowHours: remainingSafe,
      requiresColdStorageShelter: true,
      disclaimer: 'Algorithmic heuristic. Destination must verify 4°C cold chain.',
      timestamp: evaluationTimestamp,
    };
  }

  // Rule R-07: Unchecked Storage History on Cooked Food
  if (!hasStorageHistory && cookedOrPackaged === 'Cooked') {
    return {
      status: 'REVIEW_REQUIRED',
      badgeColor: 'amber',
      ruleId: 'RULE-R08',
      title: 'Review Required: Unverified Storage History',
      reason:
        'Donation lacks logged storage temperature history. Manual safety coordinator sign-off is required.',
      safeWindowHours: 1.5,
      disclaimer: 'Pending human food safety coordinator clearance.',
      timestamp: evaluationTimestamp,
    };
  }

  // Standard Eligible Fallback
  const defaultRemaining = Math.max(0, 4 - (prepTimeHoursAgo || 1));
  return {
    status: 'ELIGIBLE',
    badgeColor: 'emerald',
    ruleId: 'RULE-R09',
    title: 'Eligible for Matching',
    reason:
      `Meets standard freshness criteria with approximately ${defaultRemaining.toFixed(1)} hours estimated dispatch window.`,
    safeWindowHours: defaultRemaining,
    disclaimer:
      'Clearance is algorithmic based on user-supplied metadata. Safe consumption requires physical inspection.',
    timestamp: evaluationTimestamp,
  };
}
