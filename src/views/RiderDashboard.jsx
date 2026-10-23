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
  Zap,
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

  const [selectedRiderId, setSelectedRiderId] = useState('rider-1');
  const [ghostSecondsLeft, setGhostSecondsLeft] = useState(60);

  const activeRider = riders.find(r => r.id === selectedRiderId) || riders[0];

  const pendingReservation = reservations.find(
    r => r.riderId === activeRider.id && r.status === 'pending_confirmation'
  );

  const activeDelivery = deliveries.find(
    d =>
      d.riderId === activeRider.id &&
      (d.status === 'assigned' || d.status === 'in_transit' || d.status === 'diverted')
  );

  const completedHistory = deliveries.filter(
    d => d.riderId === activeRider.id && d.status === 'delivered'
  );

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
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Volunteer Courier Terminal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Active Dispatch Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Accept dispatches, navigate to pickup & shelters, and update live transit telemetry.
          </p>
        </div>

        {/* Switch Active Rider View */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Active Courier:</span>
          <select
            value={selectedRiderId}
            onChange={e => setSelectedRiderId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white font-bold"
          >
            {riders.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.vehicle} - {r.capacity} cap)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courier Performance Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-forest-950 via-obsidian-900 to-forest-900 text-white shadow-xl space-y-4 border border-forest-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-500/20 border border-forest-400/30 flex items-center justify-center text-forest-300">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white font-display">{activeRider.name}</h3>
              <p className="text-xs text-forest-200/80">
                {activeRider.vehicle} • {activeRider.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] text-forest-300 uppercase tracking-widest block font-bold font-mono">
                Reliability Score
              </span>
              <span className="text-2xl font-black text-forest-300 font-display">
                {activeRider.reliability}%
              </span>
            </div>
            <div className="text-right border-l border-white/10 pl-6">
              <span className="text-[10px] text-forest-300 uppercase tracking-widest block font-bold font-mono">
                Max Capacity
              </span>
              <span className="text-2xl font-black text-white font-display">
                {activeRider.capacity} units
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ghost Reservation Alert Banner (Innovation 3) */}
      {pendingReservation && (
        <div className="lux-card p-6 bg-gold-50/70 dark:bg-gold-950/40 border-2 border-gold-400 dark:border-gold-600 text-slate-900 dark:text-white shadow-xl space-y-4 animate-pulse-fast">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-600 animate-spin" />
              <h3 className="font-extrabold text-sm text-gold-950 dark:text-gold-200 font-display">
                Pending Dispatch Confirmation Required!
              </h3>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-gold-500 text-slate-950 font-black text-xs font-mono shadow-sm">
              {ghostSecondsLeft}s Left Before Timeout
            </span>
          </div>

          <p className="text-xs text-gold-900 dark:text-gold-200 leading-relaxed">
            A food rescue task has been reserved for you. If not confirmed within {ghostSecondsLeft} seconds,
            the Ghost Reservation Prevention Engine will automatically reallocate this delivery to a backup rider.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => confirmReservation(pendingReservation.id)}
              className="flex-1 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Task & Confirm Reservation</span>
            </button>
            <button
              onClick={() => triggerGhostTimeout(pendingReservation.id)}
              className="px-4 py-3 rounded-xl bg-stonebg-200 hover:bg-stonebg-300 dark:bg-obsidian-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
            >
              Pass to Backup
            </button>
          </div>
        </div>
      )}

      {/* Active Delivery Control Center */}
      {activeDelivery ? (
        <div className="lux-card p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stonebg-200 dark:border-obsidian-700 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                DELIVERY ORDER #{activeDelivery.id}
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                {activeDelivery.donationItemName}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider self-start sm:self-center ${
                activeDelivery.status === 'diverted'
                  ? 'bg-gold-100 text-gold-900 dark:bg-gold-950 dark:text-gold-300'
                  : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
              }`}
            >
              {activeDelivery.status}
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div
              className={`p-2.5 rounded-xl border font-bold ${
                activeDelivery.status === 'assigned'
                  ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-800 dark:text-blue-200'
                  : 'bg-stonebg-50 dark:bg-obsidian-900 border-stonebg-200 dark:border-obsidian-800 text-slate-400'
              }`}
            >
              1. Dispatched
            </div>
            <div
              className={`p-2.5 rounded-xl border font-bold ${
                activeDelivery.status === 'in_transit' || activeDelivery.status === 'diverted'
                  ? 'bg-forest-50 dark:bg-forest-950 border-forest-500 text-forest-800 dark:text-forest-200'
                  : 'bg-stonebg-50 dark:bg-obsidian-900 border-stonebg-200 dark:border-obsidian-800 text-slate-400'
              }`}
            >
              2. En Route
            </div>
            <div
              className={`p-2.5 rounded-xl border font-bold ${
                activeDelivery.status === 'delivered'
                  ? 'bg-forest-50 dark:bg-forest-950 border-forest-500 text-forest-800'
                  : 'bg-stonebg-50 dark:bg-obsidian-900 border-stonebg-200 dark:border-obsidian-800 text-slate-400'
              }`}
            >
              3. Delivered
            </div>
          </div>

          {/* Route Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stonebg-50 dark:bg-obsidian-900/60 border border-stonebg-200 dark:border-obsidian-700/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                Pickup Facility
              </span>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
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

            <div className="p-4 rounded-2xl bg-stonebg-50 dark:bg-obsidian-900/60 border border-stonebg-200 dark:border-obsidian-700/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                Destination Shelter
              </span>
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-forest-600 dark:text-forest-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-forest-700 dark:text-forest-400">
                    {activeDelivery.assignedShelterName}
                  </h4>
                  <p className="text-xs text-slate-500">{activeDelivery.shelterAddress}</p>
                </div>
              </div>
              <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
                <span>ETA Buffer:</span>
                <span className="font-black text-blue-600">~{activeDelivery.estimatedMinutesRemaining} mins</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            {activeDelivery.status === 'assigned' && (
              <button
                onClick={() => confirmPickup(activeDelivery.id)}
                className="w-full py-3.5 rounded-2xl bg-forest-950 dark:bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 border border-forest-800"
              >
                <CheckCircle2 className="w-4 h-4 text-forest-300" />
                <span>Confirm Pickup from Donor & Start Route</span>
              </button>
            )}

            {(activeDelivery.status === 'in_transit' || activeDelivery.status === 'diverted') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => stepSimulatedMovement(activeDelivery.id)}
                  className="py-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-800 dark:text-blue-200 font-bold text-xs border border-blue-300 dark:border-blue-800 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                  <span>Simulate GPS Step (+35% Closer)</span>
                </button>
                <button
                  onClick={() => completeDelivery(activeDelivery.id)}
                  className="py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Shelter Handover & Complete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="lux-card p-10 text-center text-slate-500 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-forest-600 dark:text-forest-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
            Online and Ready for Dispatches
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You are currently available on the active grid. When a donor registers food in your sector, an allocation request will appear with a 60-second acceptance timer.
          </p>
        </div>
      )}
    </div>
  );
}
