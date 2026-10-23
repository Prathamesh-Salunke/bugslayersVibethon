import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SHELTERS,
  INITIAL_RIDERS,
  INITIAL_DONATIONS,
  INITIAL_DELIVERIES,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';
import { evaluateFoodSafetyEligibility } from '../engines/shelfLifeEngine';
import { calculateMultiRiderSplit } from '../engines/splittingEngine';
import { evaluateMidRouteRescue } from '../engines/midRouteRecoveryEngine';
import { soundFx } from '../utils/audio';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & UI preferences
  const [activeRole, setActiveRole] = useState('landing');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('resqroute_theme') || 'light';
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 19.06, lng: 72.84, address: 'Metro Operations Center' });

  // Core entities
  const [shelters, setShelters] = useState(() => {
    const saved = localStorage.getItem('resqroute_shelters');
    return saved ? JSON.parse(saved) : INITIAL_SHELTERS;
  });

  const [riders, setRiders] = useState(() => {
    const saved = localStorage.getItem('resqroute_riders');
    return saved ? JSON.parse(saved) : INITIAL_RIDERS;
  });

  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('resqroute_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem('resqroute_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('resqroute_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [reservations, setReservations] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Theme synchronization
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('resqroute_theme', theme);
  }, [theme]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('resqroute_shelters', JSON.stringify(shelters));
    localStorage.setItem('resqroute_riders', JSON.stringify(riders));
    localStorage.setItem('resqroute_donations', JSON.stringify(donations));
    localStorage.setItem('resqroute_deliveries', JSON.stringify(deliveries));
    localStorage.setItem('resqroute_audit', JSON.stringify(auditLogs));
  }, [shelters, riders, donations, deliveries, auditLogs]);

  // Sync sound manager
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Toast notification helper
  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    if (type === 'success') soundFx.playSuccess();
    else if (type === 'error' || type === 'warning') soundFx.playAlert();
    else soundFx.playClick();

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Audit Logger
  const logAudit = (actionType, actor, target, description, severity = 'INFO') => {
    const entry = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString(),
      actionType,
      actor,
      target,
      description,
      severity,
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  // Request browser geolocation
  const requestBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Detected Live Browser GPS Location',
          };
          setUserLocation(coords);
          setIsDemoMode(false);
          addToast('GPS Synced', 'Live location updated successfully.', 'success');
        },
        error => {
          addToast(
            'GPS Notice',
            'Location permission denied or unavailable. Falling back to Metro Center demo coords.',
            'info'
          );
        }
      );
    }
  };

  // Create new donation
  const createDonation = donationInput => {
    // Run safety evaluation engine
    const safetyResult = evaluateFoodSafetyEligibility(donationInput);
    const newId = `DON-${100 + donations.length + 1}`;

    const newDonation = {
      ...donationInput,
      id: newId,
      createdAt: new Date().toISOString(),
      safetyStatus: safetyResult.status,
      safetyRule: `${safetyResult.ruleId}: ${safetyResult.title}`,
      safetyReason: safetyResult.reason,
      safeWindowHours: safetyResult.safeWindowHours,
      status: safetyResult.status === 'ELIGIBLE' ? 'ready_for_matching' : 'review_required',
    };

    setDonations(prev => [newDonation, ...prev]);

    logAudit(
      'DONATION_CREATED',
      newDonation.donorName || 'Authorized Donor',
      `${newId} (${newDonation.quantity} ${newDonation.unit})`,
      `Safety evaluation: ${safetyResult.status} (${safetyResult.ruleId}). ${safetyResult.reason}`,
      safetyResult.status === 'ELIGIBLE' ? 'SUCCESS' : 'WARNING'
    );

    addToast(
      'Donation Registered',
      `${newDonation.itemName} recorded. Safety Status: ${safetyResult.status}.`,
      safetyResult.status === 'ELIGIBLE' ? 'success' : 'warning'
    );

    // If eligible, automatically dispatch courier and match destination shelter!
    if (safetyResult.status === 'ELIGIBLE') {
      setTimeout(() => {
        autoDispatchDonation(newId, newDonation);
      }, 400);
    }

    return newDonation;
  };

  // Auto-dispatch donation immediately to top rider and top shelter
  const autoDispatchDonation = (donationId, donationData = null) => {
    const donation = donationData || donations.find(d => d.id === donationId);
    if (!donation) return null;

    // Check if delivery already exists for this donation
    const existing = deliveries.find(d => d.donationId === donationId);
    if (existing) return existing;

    // Pick top available rider or first available
    const availableRider = riders.find(r => r.status === 'available') || riders[0];
    // Pick compatible open shelter with demand
    const targetShelter = shelters.find(s => s.status === 'open' && s.openDemand > 0) || shelters[0];

    const deliveryId = `DEL-${Date.now().toString().slice(-4)}`;
    const newDelivery = {
      id: deliveryId,
      donationId: donation.id,
      donationItemName: donation.itemName,
      quantity: donation.quantity,
      unit: donation.unit || 'meals',
      donorName: donation.donorName || 'Donor',
      donorAddress: donation.location?.address || 'Pickup Hub',
      pickupLocation: donation.location || { lat: 19.055, lng: 72.83 },
      assignedShelterId: targetShelter.id,
      assignedShelterName: targetShelter.name,
      shelterAddress: targetShelter.address,
      destinationLocation: targetShelter.location || { lat: 19.0833, lng: 72.8397 },
      riderId: availableRider.id,
      riderName: availableRider.name,
      riderPhone: availableRider.phone,
      riderVehicle: availableRider.vehicle,
      currentRiderLocation: { ...(availableRider.currentLocation || { lat: 19.06, lng: 72.835 }) },
      status: 'in_transit',
      distanceKm: 3.6,
      estimatedMinutesRemaining: 14,
      assignedAt: new Date().toISOString(),
      pickedUpAt: new Date().toISOString(),
      isVegetarian: donation.isVegetarian,
      foodCategory: donation.category,
      storageMethod: donation.storageMethod,
      needsCooking: donation.needsCooking,
      safeWindowHours: donation.safeWindowHours || 3,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: 'AUTO_DISPATCHED',
          actor: 'Smart Allocation Engine',
          details: `Allocated to Rider ${availableRider.name} heading for ${targetShelter.name}.`,
        },
      ],
    };

    setDeliveries(prev => [newDelivery, ...prev]);

    // Update rider
    setRiders(prev =>
      prev.map(r => (r.id === availableRider.id ? { ...r, status: 'in_transit', activeDeliveryId: deliveryId } : r))
    );

    // Update donation
    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? {
              ...d,
              status: 'in_transit',
              assignedRiderId: availableRider.id,
              assignedRiderName: availableRider.name,
              assignedShelterId: targetShelter.id,
              assignedShelterName: targetShelter.name,
            }
          : d
      )
    );

    logAudit(
      'AUTO_DISPATCHED',
      'Smart Allocation Engine',
      deliveryId,
      `Donation ${donationId} paired with Courier ${availableRider.name} en route to ${targetShelter.name}.`,
      'SUCCESS'
    );

    addToast(
      'Courier Dispatched! 🚴',
      `${availableRider.name} is on the way to pick up and deliver to ${targetShelter.name}.`,
      'success'
    );

    return newDelivery;
  };

  // Smart split allocation
  const executeSplitPlan = (donationId, overrideRiders = null) => {
    const donation = donations.find(d => d.id === donationId);
    if (!donation) return null;

    const availableRiders = overrideRiders || riders.filter(r => r.status === 'available');
    const splitResult = calculateMultiRiderSplit(donation.quantity, availableRiders);

    if (!splitResult.feasible && splitResult.plan.length === 0) {
      addToast('Split Allocation Failed', splitResult.reason || 'Insufficient riders', 'error');
      return null;
    }

    logAudit(
      'MULTI_RIDER_SPLIT',
      'Smart Splitting Engine',
      donation.id,
      splitResult.explanation,
      'SUCCESS'
    );

    addToast(
      'Multi-Rider Split Optimized',
      `Partitioned ${donation.quantity} units across ${splitResult.plan.length} riders!`,
      'success'
    );

    return splitResult;
  };

  // Reserve a delivery to a rider
  const createReservation = (donationId, riderId, shelterId, quantityOverride = null) => {
    const donation = donations.find(d => d.id === donationId);
    const rider = riders.find(r => r.id === riderId);
    const shelter = shelters.find(s => s.id === shelterId);

    if (!donation || !rider || !shelter) return null;

    const assignedQty = quantityOverride || donation.quantity;
    const resId = `RES-${Date.now().toString().slice(-4)}`;

    const newReservation = {
      id: resId,
      donationId,
      riderId,
      shelterId,
      quantity: assignedQty,
      reservedAt: new Date().toISOString(),
      timeoutSeconds: 60, // 60s for demo responsiveness
      status: 'pending_confirmation',
    };

    setReservations(prev => [...prev, newReservation]);

    // Update rider status to reserved
    setRiders(prev =>
      prev.map(r => (r.id === riderId ? { ...r, status: 'reserved', activeReservationId: resId } : r))
    );

    // Update donation status
    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? {
              ...d,
              status: 'reserved',
              assignedRiderId: rider.id,
              assignedRiderName: rider.name,
              assignedShelterId: shelter.id,
              assignedShelterName: shelter.name,
            }
          : d
      )
    );

    logAudit(
      'RESERVATION_OFFERED',
      'Coordination Dispatch',
      `Rider ${rider.name}`,
      `Reservation ${resId} offered for ${assignedQty} units. Confirmation timeout: 60s.`,
      'INFO'
    );

    addToast(
      'Reservation Offered',
      `Task dispatched to ${rider.name}. Awaiting confirmation (60s timer).`,
      'info'
    );

    return newReservation;
  };

  // Confirm rider reservation
  const confirmReservation = reservationId => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    const donation = donations.find(d => d.id === reservation.donationId);
    const rider = riders.find(r => r.id === reservation.riderId);
    const shelter = shelters.find(s => s.id === reservation.shelterId);

    const deliveryId = `DEL-${Date.now().toString().slice(-4)}`;

    const newDelivery = {
      id: deliveryId,
      donationId: reservation.donationId,
      donationItemName: donation?.itemName || 'Aid Package',
      quantity: reservation.quantity,
      unit: donation?.unit || 'meals',
      donorName: donation?.donorName || 'Donor',
      donorAddress: donation?.location?.address || 'Pickup Hub',
      pickupLocation: donation?.location || { lat: 19.055, lng: 72.83 },
      assignedShelterId: shelter?.id,
      assignedShelterName: shelter?.name,
      shelterAddress: shelter?.address,
      destinationLocation: shelter?.location || { lat: 19.08, lng: 72.84 },
      riderId: rider?.id,
      riderName: rider?.name,
      riderPhone: rider?.phone,
      riderVehicle: rider?.vehicle,
      currentRiderLocation: { ...(rider?.currentLocation || { lat: 19.055, lng: 72.83 }) },
      status: 'assigned',
      distanceKm: 4.2,
      estimatedMinutesRemaining: 18,
      assignedAt: new Date().toISOString(),
      pickedUpAt: null,
      isVegetarian: donation?.isVegetarian,
      foodCategory: donation?.category,
      storageMethod: donation?.storageMethod,
      needsCooking: donation?.needsCooking,
      safeWindowHours: donation?.safeWindowHours || 3,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: 'CONFIRMED',
          actor: rider?.name || 'Rider',
          details: 'Rider confirmed delivery reservation within active time window.',
        },
      ],
    };

    setDeliveries(prev => [newDelivery, ...prev]);

    // Update reservation status
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'confirmed' } : r))
    );

    // Update rider
    setRiders(prev =>
      prev.map(r =>
        r.id === reservation.riderId
          ? { ...r, status: 'in_transit', activeDeliveryId: deliveryId }
          : r
      )
    );

    // Update donation
    setDonations(prev =>
      prev.map(d =>
        d.id === reservation.donationId ? { ...d, status: 'in_transit' } : d
      )
    );

    logAudit(
      'RESERVATION_CONFIRMED',
      rider?.name || 'Rider',
      deliveryId,
      `Delivery confirmed. Active transit scheduled to ${shelter?.name}.`,
      'SUCCESS'
    );

    addToast('Reservation Confirmed', `Rider ${rider?.name} accepted delivery ${deliveryId}!`, 'success');
  };

  // Ghost reservation timeout: rider failed to respond
  const triggerGhostTimeout = reservationId => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    const oldRider = riders.find(r => r.id === reservation.riderId);
    const donation = donations.find(d => d.id === reservation.donationId);

    // Release old rider
    setRiders(prev =>
      prev.map(r =>
        r.id === reservation.riderId
          ? {
              ...r,
              status: 'available',
              activeReservationId: null,
              reliability: Math.max(70, r.reliability - 3), // slight reliability adjustment
            }
          : r
      )
    );

    // Mark reservation expired
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'expired' } : r))
    );

    // Find backup rider
    const backupRider = riders.find(
      r => r.id !== reservation.riderId && r.status === 'available' && r.capacity >= reservation.quantity
    );

    if (backupRider) {
      // Reassign to backup rider
      createReservation(reservation.donationId, backupRider.id, reservation.shelterId, reservation.quantity);

      logAudit(
        'GHOST_TIMEOUT_REASSIGNED',
        'Ghost Prevention Engine',
        `Original: ${oldRider?.name} -> Backup: ${backupRider.name}`,
        `Reservation ${reservationId} expired after 60s timeout without confirmation. Automatically reallocated to ${backupRider.name}.`,
        'WARNING'
      );

      addToast(
        'Ghost Reservation Expired',
        `Unresponsive reservation timeout! Reallocated automatically to backup rider ${backupRider.name}.`,
        'warning'
      );
    } else {
      // Return donation to pool
      setDonations(prev =>
        prev.map(d =>
          d.id === reservation.donationId
            ? { ...d, status: 'ready_for_matching', assignedRiderId: null, assignedRiderName: null }
            : d
        )
      );

      logAudit(
        'GHOST_TIMEOUT_UNASSIGNED',
        'Ghost Prevention Engine',
        reservation.donationId,
        `Reservation ${reservationId} expired. No immediate backup rider available; returned to active queue.`,
        'WARNING'
      );

      addToast(
        'Reservation Expired',
        'No backup rider immediate; donation returned to active rescue pool.',
        'warning'
      );
    }
  };

  // Confirm pickup
  const confirmPickup = deliveryId => {
    setDeliveries(prev =>
      prev.map(del => {
        if (del.id === deliveryId) {
          const updated = {
            ...del,
            status: 'in_transit',
            pickedUpAt: new Date().toISOString(),
            auditTrail: [
              ...del.auditTrail,
              {
                timestamp: new Date().toISOString(),
                action: 'PICKUP_COMPLETED',
                actor: del.riderName,
                details: 'Food inspected at donor premises and loaded into insulated carrier.',
              },
            ],
          };
          return updated;
        }
        return del;
      })
    );

    logAudit(
      'PICKUP_COMPLETED',
      'Rider Mobile Terminal',
      deliveryId,
      'Package picked up from donor facility and en route to destination shelter.',
      'INFO'
    );

    addToast('Pickup Confirmed', `Delivery ${deliveryId} is now en route!`, 'success');
  };

  // Step simulated movement
  const stepSimulatedMovement = deliveryId => {
    setDeliveries(prev =>
      prev.map(del => {
        if (del.id === deliveryId) {
          const dest = del.destinationLocation;
          const curr = del.currentRiderLocation;
          // Step 30% closer to destination
          const newLat = curr.lat + (dest.lat - curr.lat) * 0.35;
          const newLng = curr.lng + (dest.lng - curr.lng) * 0.35;
          const newMinutes = Math.max(2, Math.round(del.estimatedMinutesRemaining * 0.65));

          return {
            ...del,
            currentRiderLocation: { lat: newLat, lng: newLng },
            estimatedMinutesRemaining: newMinutes,
          };
        }
        return del;
      })
    );
    addToast('GPS Simulated', 'Rider vehicle updated along route.', 'info');
  };

  // Complete delivery
  const completeDelivery = (deliveryId, receivedQuantity = null, discrepancyReport = '') => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    const actualQty = receivedQuantity !== null ? receivedQuantity : delivery.quantity;

    // Update delivery
    setDeliveries(prev =>
      prev.map(del =>
        del.id === deliveryId
          ? {
              ...del,
              status: 'delivered',
              completedAt: new Date().toISOString(),
              receivedQuantity: actualQty,
              discrepancyReport,
              auditTrail: [
                ...del.auditTrail,
                {
                  timestamp: new Date().toISOString(),
                  action: 'DELIVERY_COMPLETED',
                  actor: delivery.assignedShelterName,
                  details: `Delivery confirmed. ${actualQty} ${delivery.unit} verified received.${
                    discrepancyReport ? ` Note: ${discrepancyReport}` : ''
                  }`,
                },
              ],
            }
          : del
      )
    );

    // Update donation status
    setDonations(prev =>
      prev.map(d => (d.id === delivery.donationId ? { ...d, status: 'delivered' } : d))
    );

    // Update rider
    setRiders(prev =>
      prev.map(r =>
        r.id === delivery.riderId
          ? {
              ...r,
              status: 'available',
              completedDeliveries: r.completedDeliveries + 1,
              activeDeliveryId: null,
            }
          : r
      )
    );

    // Update shelter received counts & open demand
    setShelters(prev =>
      prev.map(s =>
        s.id === delivery.assignedShelterId
          ? {
              ...s,
              receivedToday: s.receivedToday + actualQty,
              openDemand: Math.max(0, s.openDemand - actualQty),
              currentOccupancy: Math.min(s.capacity, s.currentOccupancy + actualQty),
            }
          : s
      )
    );

    logAudit(
      'DELIVERY_DELIVERED',
      delivery.assignedShelterName,
      deliveryId,
      `Rescue completed! ${actualQty} ${delivery.unit} safely received and distributed to shelter residents.`,
      'SUCCESS'
    );

    // Trigger celebration confetti
    if (typeof window !== 'undefined' && window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    addToast(
      'Mission Accomplished! 🌟',
      `${actualQty} ${delivery.unit} successfully delivered to ${delivery.assignedShelterName}.`,
      'success'
    );
  };

  // Shelter emergency close / mid-route rescue trigger
  const triggerShelterEmergencyClose = (shelterId, reason = 'Power failure & cooling outage') => {
    // 1. Mark shelter closed
    setShelters(prev =>
      prev.map(s =>
        s.id === shelterId
          ? { ...s, status: 'closed_emergency', closeReason: reason, openDemand: 0 }
          : s
      )
    );

    // 2. Identify active deliveries heading to this shelter
    const affectedDeliveries = deliveries.filter(
      d => d.assignedShelterId === shelterId && (d.status === 'in_transit' || d.status === 'assigned')
    );

    logAudit(
      'SHELTER_EMERGENCY_SHUTDOWN',
      'Shelter Coordinator',
      shelterId,
      `Shelter emergency declared: ${reason}. Affected in-transit deliveries: ${affectedDeliveries.length}.`,
      'WARNING'
    );

    if (affectedDeliveries.length === 0) {
      addToast(
        'Shelter Closed',
        `Shelter marked closed (${reason}). No active deliveries were in transit.`,
        'warning'
      );
      return null;
    }

    // 3. Run Mid-Route Rescue Engine on each affected delivery
    const recoveryPlans = [];
    affectedDeliveries.forEach(del => {
      const rescueEval = evaluateMidRouteRescue(del, shelters, reason);
      recoveryPlans.push({ delivery: del, rescueEval });

      if (rescueEval.success && rescueEval.recommendedShelter) {
        logAudit(
          'MID_ROUTE_DIVERSION_RECOMMENDED',
          'Mid-Route Rescue Engine',
          del.id,
          rescueEval.rationale,
          'WARNING'
        );
      }
    });

    addToast(
      '⚠️ Mid-Route Disruption Detected!',
      `${affectedDeliveries.length} delivery disrupted. Mid-Route Rescue Engine generated reroute alternatives.`,
      'error'
    );

    return recoveryPlans;
  };

  // Confirm mid-route diversion
  const confirmMidRouteDiversion = (deliveryId, newShelterId) => {
    const newShelter = shelters.find(s => s.id === newShelterId);
    if (!newShelter) return;

    setDeliveries(prev =>
      prev.map(del => {
        if (del.id === deliveryId) {
          const updated = {
            ...del,
            assignedShelterId: newShelter.id,
            assignedShelterName: newShelter.name,
            shelterAddress: newShelter.address,
            destinationLocation: newShelter.location,
            status: 'diverted',
            auditTrail: [
              ...del.auditTrail,
              {
                timestamp: new Date().toISOString(),
                action: 'MID_ROUTE_DIVERTED',
                actor: 'Mid-Route Rescue Engine',
                details: `Original destination closed. Safely rerouted to ${newShelter.name}.`,
              },
            ],
          };
          return updated;
        }
        return del;
      })
    );

    logAudit(
      'MID_ROUTE_DIVERTED',
      'Emergency Dispatcher',
      deliveryId,
      `Delivery diverted to backup shelter: ${newShelter.name}.`,
      'SUCCESS'
    );

    addToast(
      'Reroute Dispatched',
      `Delivery ${deliveryId} safely redirected to ${newShelter.name}!`,
      'success'
    );
  };

  // Reset to initial clean state
  const resetToInitialData = () => {
    setShelters(INITIAL_SHELTERS);
    setRiders(INITIAL_RIDERS);
    setDonations(INITIAL_DONATIONS);
    setDeliveries(INITIAL_DELIVERIES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setReservations([]);
    localStorage.removeItem('resqroute_shelters');
    localStorage.removeItem('resqroute_riders');
    localStorage.removeItem('resqroute_donations');
    localStorage.removeItem('resqroute_deliveries');
    localStorage.removeItem('resqroute_audit');

    logAudit(
      'SIMULATION_RESET',
      'Judge Demo Controller',
      'System State',
      'All live records, allocations, and coordinates restored to default test scenario.',
      'INFO'
    );

    addToast('Demo State Reset', 'Initial operational scenario restored successfully.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        theme,
        toggleTheme: () => setTheme(prev => (prev === 'light' ? 'dark' : 'light')),
        soundEnabled,
        toggleSound: () => setSoundEnabled(prev => !prev),
        isDemoMode,
        setIsDemoMode,
        userLocation,
        requestBrowserLocation,
        shelters,
        setShelters,
        riders,
        setRiders,
        donations,
        setDonations,
        deliveries,
        setDeliveries,
        auditLogs,
        reservations,
        toasts,
        addToast,
        removeToast,
        logAudit,
        createDonation,
        autoDispatchDonation,
        executeSplitPlan,
        createReservation,
        confirmReservation,
        triggerGhostTimeout,
        confirmPickup,
        stepSimulatedMovement,
        completeDelivery,
        triggerShelterEmergencyClose,
        confirmMidRouteDiversion,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
