/**
 * Innovation 3: Ghost Reservation Prevention Engine
 * Prevents volunteer no-shows by setting confirmation deadlines on allocated deliveries.
 */

export function checkReservationTimeout(reservation, currentTimestampMs = Date.now()) {
  if (!reservation || reservation.status !== 'pending_confirmation') {
    return { isTimedOut: false };
  }

  const reservedAt = new Date(reservation.reservedAt).getTime();
  const timeoutLimitMs = (reservation.timeoutSeconds || 60) * 1000;
  const elapsedMs = currentTimestampMs - reservedAt;
  const remainingSeconds = Math.max(0, Math.ceil((timeoutLimitMs - elapsedMs) / 1000));

  const isTimedOut = elapsedMs >= timeoutLimitMs;

  return {
    isTimedOut,
    remainingSeconds,
    elapsedMs,
    timeoutLimitMs,
    explanation: isTimedOut
      ? `Reservation exceeded the ${reservation.timeoutSeconds}s confirmation window without rider acknowledgement.`
      : `Rider has ${remainingSeconds}s remaining to confirm assignment before automated reassignment triggers.`,
  };
}
