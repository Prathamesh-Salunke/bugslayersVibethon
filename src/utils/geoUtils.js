// Geolocation and distance utilities
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;
  // Estimate road distance factor (roughly 1.25x straight-line in urban areas)
  return Math.round(straightLine * 1.25 * 10) / 10;
}

export function estimateTravelTimeMinutes(distanceKm, speedKmh = 28) {
  if (!distanceKm || distanceKm <= 0) return 5;
  const hours = distanceKm / speedKmh;
  const minutes = Math.round(hours * 60) + 5; // 5 mins pickup buffer
  return Math.max(minutes, 8);
}
