import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Droplets,
  Flame,
  Snowflake,
  Box,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  FileCheck,
} from 'lucide-react';

export default function ShelterDashboard() {
  const {
    shelters,
    setShelters,
    deliveries,
    completeDelivery,
    triggerShelterEmergencyClose,
    addToast,
  } = useApp();

  const [selectedShelterId, setSelectedShelterId] = useState('shelter-1');
  const [demandAdjustment, setDemandAdjustment] = useState('');
  const [discrepancyNote, setDiscrepancyNote] = useState('');
  const [receivedCount, setReceivedCount] = useState('');

  const currentShelter = shelters.find(s => s.id === selectedShelterId) || shelters[0];

  // Incoming deliveries to this shelter
  const incomingDeliveries = deliveries.filter(
    d =>
      d.assignedShelterId === currentShelter.id &&
      (d.status === 'in_transit' || d.status === 'assigned' || d.status === 'diverted')
  );

  // Delivered history
  const deliveredBatches = deliveries.filter(
    d => d.assignedShelterId === currentShelter.id && d.status === 'delivered'
  );

  const handleUpdateDemand = () => {
    const qty = parseInt(demandAdjustment);
    if (isNaN(qty) || qty < 0) return;
    setShelters(prev =>
      prev.map(s => (s.id === currentShelter.id ? { ...s, openDemand: qty } : s))
    );
    setDemandAdjustment('');
    addToast('Demand Updated', `Open meal demand updated to ${qty} units.`, 'success');
  };

  const handleEmergencyClose = () => {
    triggerShelterEmergencyClose(
      currentShelter.id,
      'Power failure & refrigeration breakdown'
    );
  };

  const handleReopen = () => {
    setShelters(prev =>
      prev.map(s =>
        s.id === currentShelter.id ? { ...s, status: 'open', closeReason: '', openDemand: 45 } : s
      )
    );
    addToast('Shelter Re-opened', `${currentShelter.name} is now accepting food intake.`, 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Shelter Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Shelter & Intake Center Terminal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              Receiving Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage receiving capacity, facility compliance declarations, and incoming consignment intake.
          </p>
        </div>

        {/* Shelter Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Viewing Shelter:</span>
          <select
            value={selectedShelterId}
            onChange={e => setSelectedShelterId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
          >
            {shelters.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shelter Profile & Capacity Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warm-200 dark:border-slate-700 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {currentShelter.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentShelter.address} • Contact: {currentShelter.contact}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                currentShelter.status === 'open'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {currentShelter.status}
            </span>

            {currentShelter.status === 'open' ? (
              <button
                onClick={handleEmergencyClose}
                className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-300 dark:border-rose-800 transition"
                title="Simulate shelter closure to test mid-route diversion engine"
              >
                Trigger Emergency Intake Close
              </button>
            ) : (
              <button
                onClick={handleReopen}
                className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs transition"
              >
                Re-open Intake
              </button>
            )}
          </div>
        </div>

        {/* Capacity & Facility Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-warm-50 dark:bg-slate-900/40 border border-warm-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 font-medium block">Occupancy Load</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {currentShelter.currentOccupancy} / {currentShelter.capacity}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (currentShelter.currentOccupancy / currentShelter.capacity) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-warm-50 dark:bg-slate-900/40 border border-warm-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 font-medium block">Open Meal Demand</span>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {currentShelter.openDemand} meals
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Accepting active batches</span>
          </div>

          <div className="p-4 rounded-xl bg-warm-50 dark:bg-slate-900/40 border border-warm-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 font-medium block">Received Today</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {currentShelter.receivedToday} meals
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              Verified intake
            </span>
          </div>

          <div className="p-4 rounded-xl bg-warm-50 dark:bg-slate-900/40 border border-warm-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 font-medium block">Dietary Rule</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              {currentShelter.dietaryRestriction}
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Strict matching constraint</span>
          </div>
        </div>

        {/* Facility Checklist (Destination Compatibility) */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
            Verified On-Site Processing Facilities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                currentShelter.facilities.clean_water
                  ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 text-blue-900 dark:text-blue-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-dashed'
              }`}
            >
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">
                {currentShelter.facilities.clean_water ? 'Potable Clean Water' : 'No Clean Water'}
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                currentShelter.facilities.refrigeration
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 text-indigo-900 dark:text-indigo-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-dashed'
              }`}
            >
              <Snowflake className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold">
                {currentShelter.facilities.refrigeration ? 'Refrigeration (4°C)' : 'No Cold Storage'}
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                currentShelter.facilities.cooking_fuel
                  ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-dashed'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">
                {currentShelter.facilities.cooking_fuel ? 'Active Cooking Fuel' : 'No Cooking Gas'}
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                currentShelter.facilities.storage
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-dashed'
              }`}
            >
              <Box className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold">
                {currentShelter.facilities.storage ? 'Dry Pantry Storage' : 'No Pantry'}
              </span>
            </div>
          </div>
        </div>

        {/* SOS Demand Update Box */}
        <div className="p-4 rounded-xl bg-warm-50 dark:bg-slate-900/60 border border-warm-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              Dynamic Demand Adjustment (In-Transit Resilient)
            </h4>
            <p className="text-slate-500 text-[11px]">
              Update required meals based on unexpected arrivals or weather spikes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="e.g. 80"
              value={demandAdjustment}
              onChange={e => setDemandAdjustment(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-lg border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-bold"
            />
            <button
              onClick={handleUpdateDemand}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
            >
              Update Demand
            </button>
          </div>
        </div>
      </div>

      {/* Incoming Deliveries & Handover Confirmation */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Incoming Food Shipments ({incomingDeliveries.length})</span>
          </h3>
          <span className="text-[11px] text-slate-500">Live Intake Verification</span>
        </div>

        {incomingDeliveries.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-warm-50 dark:bg-slate-900/30 border border-dashed border-warm-200 dark:border-slate-700 text-slate-400 text-xs">
            No incoming deliveries currently scheduled for this shelter.
          </div>
        ) : (
          <div className="space-y-3">
            {incomingDeliveries.map(del => (
              <div
                key={del.id}
                className="p-4 rounded-xl bg-warm-50 dark:bg-slate-900/50 border border-warm-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold block">{del.id}</span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                    {del.donationItemName}
                  </h4>
                  <p className="text-slate-500">
                    Donor: {del.donorName} • Rider: <span className="font-semibold text-slate-700 dark:text-slate-300">{del.riderName}</span>
                  </p>
                  <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                    Expected Quantity: {del.quantity} {del.unit} (~{del.estimatedMinutesRemaining}m ETA)
                  </span>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <button
                    onClick={() => completeDelivery(del.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Verified Intake</span>
                  </button>
                  <span className="text-[10px] text-slate-400">
                    Auto-updates inventory & logs audit entry
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
