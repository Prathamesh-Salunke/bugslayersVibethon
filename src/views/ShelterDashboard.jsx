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

  const currentShelter = shelters.find(s => s.id === selectedShelterId) || shelters[0];

  const incomingDeliveries = deliveries.filter(
    d =>
      d.assignedShelterId === currentShelter.id &&
      (d.status === 'in_transit' || d.status === 'assigned' || d.status === 'diverted')
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
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Shelter & Intake Center Terminal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
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
            className="px-3 py-1.5 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white font-bold"
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
      <div className="lux-card p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stonebg-200 dark:border-obsidian-700 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                {currentShelter.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentShelter.address} • Contact: {currentShelter.contact}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono ${
                currentShelter.status === 'open'
                  ? 'bg-forest-100 text-forest-900 dark:bg-forest-950 dark:text-forest-300 border border-forest-200 dark:border-forest-800'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {currentShelter.status}
            </span>

            {currentShelter.status === 'open' ? (
              <button
                onClick={handleEmergencyClose}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-300 dark:border-rose-800 transition"
                title="Simulate shelter closure to test mid-route diversion engine"
              >
                Trigger Emergency Intake Close
              </button>
            ) : (
              <button
                onClick={handleReopen}
                className="px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition shadow-sm"
              >
                Re-open Intake
              </button>
            )}
          </div>
        </div>

        {/* Capacity & Facility Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="lux-card p-4 bg-stonebg-50/60 dark:bg-obsidian-900/40">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono block">
              Occupancy Load
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1 font-display">
              {currentShelter.currentOccupancy} / {currentShelter.capacity}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
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

          <div className="lux-card p-4 bg-stonebg-50/60 dark:bg-obsidian-900/40">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono block">
              Open Demand
            </span>
            <div className="text-xl font-black text-forest-700 dark:text-forest-400 mt-1 font-display">
              {currentShelter.openDemand} meals
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Accepting active batches</span>
          </div>

          <div className="lux-card p-4 bg-stonebg-50/60 dark:bg-obsidian-900/40">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono block">
              Received Today
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1 font-display">
              {currentShelter.receivedToday} meals
            </div>
            <span className="text-[10px] text-forest-600 font-bold block mt-1">
              Verified intake
            </span>
          </div>

          <div className="lux-card p-4 bg-stonebg-50/60 dark:bg-obsidian-900/40">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono block">
              Dietary Policy
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              {currentShelter.dietaryRestriction}
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Hard constraint</span>
          </div>
        </div>

        {/* Facility Checklist (Destination Compatibility) */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
            Verified On-Site Processing Facilities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div
              className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                currentShelter.facilities.clean_water
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 text-blue-900 dark:text-blue-200 font-semibold'
                  : 'bg-slate-100 dark:bg-obsidian-900 text-slate-400 border-dashed'
              }`}
            >
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>{currentShelter.facilities.clean_water ? 'Potable Clean Water' : 'No Clean Water'}</span>
            </div>

            <div
              className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                currentShelter.facilities.refrigeration
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 text-indigo-900 dark:text-indigo-200 font-semibold'
                  : 'bg-slate-100 dark:bg-obsidian-900 text-slate-400 border-dashed'
              }`}
            >
              <Snowflake className="w-4 h-4 text-indigo-500" />
              <span>{currentShelter.facilities.refrigeration ? 'Refrigeration (4°C)' : 'No Cold Storage'}</span>
            </div>

            <div
              className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                currentShelter.facilities.cooking_fuel
                  ? 'bg-gold-50/70 dark:bg-gold-950/40 border-gold-200 text-gold-900 dark:text-gold-200 font-semibold'
                  : 'bg-slate-100 dark:bg-obsidian-900 text-slate-400 border-dashed'
              }`}
            >
              <Flame className="w-4 h-4 text-gold-500" />
              <span>{currentShelter.facilities.cooking_fuel ? 'Active Cooking Fuel' : 'No Cooking Gas'}</span>
            </div>

            <div
              className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                currentShelter.facilities.storage
                  ? 'bg-forest-50/70 dark:bg-forest-950/40 border-forest-200 text-forest-900 dark:text-forest-200 font-semibold'
                  : 'bg-slate-100 dark:bg-obsidian-900 text-slate-400 border-dashed'
              }`}
            >
              <Box className="w-4 h-4 text-forest-600" />
              <span>{currentShelter.facilities.storage ? 'Dry Pantry Storage' : 'No Pantry'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Demand Adjustment Box */}
        <div className="p-4 rounded-2xl bg-stonebg-50 dark:bg-obsidian-900/60 border border-stonebg-200 dark:border-obsidian-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              Dynamic Demand Adjustment (In-Transit Resilient)
            </h4>
            <p className="text-slate-500 text-[11px]">
              Update required meals based on sudden arrivals or refugee camp intake surges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="e.g. 80"
              value={demandAdjustment}
              onChange={e => setDemandAdjustment(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-800 text-xs font-bold"
            />
            <button
              onClick={handleUpdateDemand}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
            >
              Update Demand
            </button>
          </div>
        </div>
      </div>

      {/* Incoming Deliveries & Handover Confirmation */}
      <div className="lux-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-forest-600 dark:text-forest-400" />
            <span>Incoming Shipments ({incomingDeliveries.length})</span>
          </h3>
          <span className="text-[11px] text-slate-500">Live Intake Verification</span>
        </div>

        {incomingDeliveries.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-stonebg-50 dark:bg-obsidian-900/40 border border-dashed border-stonebg-200 dark:border-obsidian-700 text-slate-400 text-xs">
            No incoming deliveries currently scheduled for this shelter.
          </div>
        ) : (
          <div className="space-y-3">
            {incomingDeliveries.map(del => (
              <div
                key={del.id}
                className="lux-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold block">{del.id}</span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                    {del.donationItemName}
                  </h4>
                  <p className="text-slate-500">
                    Donor: {del.donorName} • Courier: <span className="font-semibold text-slate-800 dark:text-slate-200">{del.riderName}</span>
                  </p>
                  <span className="text-[11px] font-bold text-forest-700 dark:text-forest-400 block mt-1">
                    Expected: {del.quantity} {del.unit} (~{del.estimatedMinutesRemaining}m ETA)
                  </span>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <button
                    onClick={() => completeDelivery(del.id)}
                    className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold transition shadow-sm flex items-center gap-1.5"
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
