import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bike,
  Navigation,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award,
  Phone,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function RiderDashboard() {
  const {
    riders,
    deliveries,
    reservations,
    confirmReservation,
    triggerGhostTimeout,
    confirmPickup,
    stepSimulatedMovement,
    completeDelivery,
    addToast,
  } = useApp();

  // Currently viewing as Rider-1 (Alex Chen) by default, with option to switch
  const [selectedRiderId, setSelectedRiderId] = useState('rider-1');
  const [ghostSecondsLeft, setGhostSecondsLeft] = useState(60);

  const activeRider = riders.find(r => r.id === selectedRiderId) || riders[0];

  // Check active pending reservation for this rider
  const pendingReservation = reservations.find(
    r => r.riderId === activeRider.id && r.status === 'pending_confirmation'
  );

  // Check active delivery assigned to this rider
  const activeDelivery = deliveries.find(
    d =>
      d.riderId === activeRider.id &&
      (d.status === 'assigned' || d.status === 'in_transit' || d.status === 'diverted')
  );

  // Completed deliveries by this rider
  const completedHistory = deliveries.filter(
    d => d.riderId === activeRider.id && d.status === 'delivered'
  );

  // Ghost reservation countdown timer effect
  useEffect(() => {
    let interval = null;
    if (pendingReservation) {
      interval = setInterval(() => {
        setGhostSecondsLeft(prev => {
          if (prev <= 1) {
            triggerGhostTimeout(pendingReservation.id);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setGhostSecondsLeft(60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pendingReservation]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Profile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Volunteer Rider Terminal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Active Courier Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Accept dispatches, navigate to pickup & shelters, and update live transit telemetry.
          </p>
        </div>

        {/* Switch Active Rider View */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Logged as:</span>
          <select
            value={selectedRiderId}
            onChange={e => setSelectedRiderId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
          >
            {riders.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.vehicle} - {r.capacity} cap)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rider Performance Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{activeRider.name}</h3>
              <p className="text-xs text-blue-200">
                {activeRider.vehicle} • {activeRider.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-blue-300 uppercase tracking-widest block font-bold">
                Reliability Score
              </span>
              <span className="text-xl font-black text-emerald-400">
                {activeRider.reliability}%
              </span>
            </div>
            <div className="text-right border-l border-white/20 pl-4">
              <span className="text-[10px] text-blue-300 uppercase tracking-widest block font-bold">
                Max Capacity
              </span>
              <span className="text-xl font-black text-white">
                {activeRider.capacity} units
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ghost Reservation Alert Banner (Innovation 3) */}
      {pendingReservation && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-600 text-slate-900 dark:text-white shadow-lg space-y-3 animate-pulse-fast">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 animate-spin" />
              <h3 className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                Pending Dispatch Confirmation Required!
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
              {ghostSecondsLeft}s Left Before Timeout
            </span>
          </div>

          <p className="text-xs text-amber-800 dark:text-amber-300">
            A food rescue task has been reserved for you. If not confirmed within {ghostSecondsLeft} seconds,
            the Ghost Reservation Prevention Engine will automatically reallocate this delivery to a backup rider.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => confirmReservation(pendingReservation.id)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Task & Confirm Reservation</span>
            </button>
            <button
              onClick={() => triggerGhostTimeout(pendingReservation.id)}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
            >
              Pass to Backup
            </button>
          </div>
        </div>
      )}

      {/* Active Delivery Control Center */}
      {activeDelivery ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-200 dark:border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                DELIVERY ORDER #{activeDelivery.id}
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {activeDelivery.donationItemName}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider self-start sm:self-center ${
                activeDelivery.status === 'diverted'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              }`}
            >
              {activeDelivery.status}
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div
              className={`p-2.5 rounded-xl border ${
                activeDelivery.status === 'assigned'
                  ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 font-bold text-blue-800 dark:text-blue-200'
                  : 'bg-warm-50 dark:bg-slate-900 border-warm-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              1. Dispatched
            </div>
            <div
              className={`p-2.5 rounded-xl border ${
                activeDelivery.status === 'in_transit' || activeDelivery.status === 'diverted'
                  ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 font-bold text-emerald-800 dark:text-emerald-200'
                  : 'bg-warm-50 dark:bg-slate-900 border-warm-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              2. In Transit
            </div>
            <div
              className={`p-2.5 rounded-xl border ${
                activeDelivery.status === 'delivered'
                  ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 font-bold text-emerald-800'
                  : 'bg-warm-50 dark:bg-slate-900 border-warm-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              3. Delivered
            </div>
          </div>

          {/* Route Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-warm-50 dark:bg-slate-900/50 border border-warm-200 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Pickup Facility
              </span>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {activeDelivery.donorName}
                  </h4>
                  <p className="text-xs text-slate-500">{activeDelivery.donorAddress}</p>
                </div>
              </div>
              <div className="pt-2 text-xs text-slate-600 dark:text-slate-300">
                Package: <span className="font-bold text-slate-900 dark:text-white">{activeDelivery.quantity} {activeDelivery.unit}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-warm-50 dark:bg-slate-900/50 border border-warm-200 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Recipient Shelter
              </span>
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                    {activeDelivery.assignedShelterName}
                  </h4>
                  <p className="text-xs text-slate-500">{activeDelivery.shelterAddress}</p>
                </div>
              </div>
              <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
                <span>Estimated ETA:</span>
                <span className="font-black text-blue-600">~{activeDelivery.estimatedMinutesRemaining} mins</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            {activeDelivery.status === 'assigned' && (
              <button
                onClick={() => confirmPickup(activeDelivery.id)}
                className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirm Pickup from Donor & Start Transit</span>
              </button>
            )}

            {(activeDelivery.status === 'in_transit' || activeDelivery.status === 'diverted') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => stepSimulatedMovement(activeDelivery.id)}
                  className="py-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-800 dark:text-blue-200 font-bold text-xs border border-blue-300 dark:border-blue-800 transition flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Simulate GPS Move (+35% Closer)</span>
                </button>
                <button
                  onClick={() => completeDelivery(activeDelivery.id)}
                  className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Shelter Handover & Complete</span>
                </button>
              </div>
            )}

            <button
              onClick={() => {
                addToast(
                  'Traffic Alert Noted',
                  'Delay logged to coordination dispatch. Safe window reassessed.',
                  'info'
                );
              }}
              className="w-full py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 transition text-center"
            >
              Report Traffic Congestion / Minor Delay
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 text-slate-500 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Ready for Dispatches
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You are online and available. When a donor registers food in your sector, an allocation request will appear with a 60-second acceptance timer.
          </p>
        </div>
      )}

      {/* Rider Delivery History */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
          Your Rescue Track Record ({completedHistory.length + activeRider.completedDeliveries} Completed)
        </h3>

        <div className="divide-y divide-warm-100 dark:divide-slate-700/60 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Standard Catering Delivery (Historical)
              </span>
              <span className="text-[10px] text-slate-400">Delivered to Hope Haven Community Shelter</span>
            </div>
            <span className="font-extrabold text-emerald-600">35 meals</span>
          </div>
        </div>
      </div>
    </div>
  );
}
