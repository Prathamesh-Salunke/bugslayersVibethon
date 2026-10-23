import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FOOD_CATEGORIES,
  STORAGE_METHODS,
  evaluateFoodSafetyEligibility,
} from '../engines/shelfLifeEngine';
import InteractiveMap from '../components/InteractiveMap';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  UtensilsCrossed,
  Award,
  CheckCircle2,
  FileText,
  Share2,
  X,
  PackageCheck,
  Info,
  Zap,
  ArrowRight,
  Sliders,
  Bike,
  Navigation,
  Compass,
  Phone,
  Building2,
  Check,
  FileCheck,
  Truck,
  RotateCw,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

export default function DonorDashboard() {
  const {
    createDonation,
    donations,
    deliveries,
    riders,
    shelters,
    userLocation,
    stepSimulatedMovement,
    completeDelivery,
    autoDispatchDonation,
    fulfillShelterRequirementAndReroute,
    setActiveRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'custom'
  const [selectedTrackingDonationId, setSelectedTrackingDonationId] = useState('DON-102');
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    donorName: 'Grand Hyatt Catering',
    donorContact: '+91 98200 99887',
    itemName: 'Excess Banquet Biryani & Dal Makhani',
    category: FOOD_CATEGORIES.COOKED_MEAL,
    cookedOrPackaged: 'Cooked',
    quantity: 75,
    unit: 'meals',
    isVegetarian: true,
    prepTimeHoursAgo: 2,
    storageMethod: STORAGE_METHODS.HOT_HOLD,
    packagingType: 'Thermal Sealed Catering Boxes',
    hasStorageHistory: true,
    needsCooking: false,
    address: 'Grand Hyatt, Bandra Kurla Complex',
    pickupReadiness: 'Packaged & Ready in Kitchen Loading Bay',
    notes: 'Kept above 65°C hot hold. Clean stainless containers.',
  });

  // Tracked delivery
  const trackedDelivery =
    deliveries.find(d => d.donationId === selectedTrackingDonationId) ||
    deliveries.find(d => d.status === 'in_transit' || d.status === 'assigned' || d.status === 'diverted') ||
    deliveries[0];

  const trackedDonation =
    donations.find(d => d.id === selectedTrackingDonationId) ||
    donations.find(d => d.id === trackedDelivery?.donationId) ||
    donations[0];

  // Presets
  const presets = [
    {
      id: 'wedding',
      badge: 'BANQUET',
      title: 'Wedding Feast & Catering Surplus',
      desc: 'Cooked rice, vegetable curry & paneer in thermal chafing dishes.',
      qty: 140,
      unit: 'meals',
      prepAgo: 1.5,
      storage: STORAGE_METHODS.HOT_HOLD,
      donor: 'Grand Palace Ballroom',
      category: FOOD_CATEGORIES.COOKED_MEAL,
    },
    {
      id: 'bakery',
      badge: 'BAKERY',
      title: 'Artisan Bakery Day Surplus',
      desc: 'Freshly baked sourdough, baguettes, and croissants in paper bags.',
      qty: 40,
      unit: 'loaves',
      prepAgo: 3.0,
      storage: STORAGE_METHODS.ROOM_TEMP,
      donor: 'Golden Crust Bakehouse',
      category: FOOD_CATEGORIES.BAKERY,
    },
    {
      id: 'mess',
      badge: 'HOSTEL MESS',
      title: 'University Mess Lunch Trays',
      desc: 'Nutritious lunch trays (rice, lentils, seasonal greens), chilled.',
      qty: 60,
      unit: 'meals',
      prepAgo: 2.0,
      storage: STORAGE_METHODS.REFRIGERATED,
      donor: 'Metro Campus Dining Hall',
      category: FOOD_CATEGORIES.COOKED_MEAL,
    },
  ];

  const applyAndSelectPreset = preset => {
    setFormData({
      donorName: preset.donor,
      donorContact: '+91 98200 44321',
      itemName: preset.title,
      category: preset.category,
      cookedOrPackaged: preset.category === FOOD_CATEGORIES.BAKERY ? 'Packaged' : 'Cooked',
      quantity: preset.qty,
      unit: preset.unit,
      isVegetarian: true,
      prepTimeHoursAgo: preset.prepAgo,
      storageMethod: preset.storage,
      packagingType: 'Sanitary Food-Grade Containers',
      hasStorageHistory: true,
      needsCooking: false,
      address: `${preset.donor}, Metro West Sector`,
      pickupReadiness: 'Ready for Immediate Dispatch',
      notes: preset.desc,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newDonation = createDonation({
      ...formData,
      quantity: Number(formData.quantity),
      location: {
        address: formData.address,
        lat: userLocation.lat + (Math.random() - 0.5) * 0.02,
        lng: userLocation.lng + (Math.random() - 0.5) * 0.02,
      },
    });

    if (newDonation) {
      setSelectedTrackingDonationId(newDonation.id);
      setActiveReceipt(newDonation);
    }
  };

  const handleSimulateFulfillAndReroute = () => {
    if (!trackedDelivery) return;
    fulfillShelterRequirementAndReroute(trackedDelivery.assignedShelterId, trackedDelivery.id);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Food Donor Hub & Live Order Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
              Flipkart / Amazon-Style Logistics Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time step-by-step courier telemetry, live route mapping, and mid-route automatic redirection if shelter requirements get fulfilled.
          </p>
        </div>

        {/* Switch tracked donation */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Active Order:</span>
          <select
            value={selectedTrackingDonationId}
            onChange={e => setSelectedTrackingDonationId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-800 text-slate-900 dark:text-white font-bold"
          >
            {donations.map(d => (
              <option key={d.id} value={d.id}>
                {d.id}: {d.itemName.slice(0, 22)}... ({d.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📦 FLIPKART / AMAZON STYLE LIVE ORDER & COURIER TRACKER */}
      {/* ========================================================================= */}
      {trackedDelivery && (
        <div className="lux-card overflow-hidden border-2 border-forest-500/50 shadow-2xl bg-white dark:bg-obsidian-900 space-y-6">
          {/* Top E-Commerce Header Bar */}
          <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-obsidian-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-widest uppercase bg-forest-500/20 text-forest-300 px-2.5 py-0.5 rounded-full border border-forest-500/30 font-bold">
                  TRACKING #{trackedDelivery.id}
                </span>
                {trackedDelivery.status === 'diverted' && (
                  <span className="text-[11px] font-bold bg-gold-500 text-slate-950 px-2.5 py-0.5 rounded-full animate-pulse">
                    ⚡ REROUTED MID-WAY
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold font-display">
                {trackedDelivery.donationItemName}
              </h2>
              <p className="text-xs text-forest-100/70">
                Batch Size: <span className="font-bold text-white">{trackedDelivery.quantity} {trackedDelivery.unit}</span> • Donor Facility: {trackedDelivery.donorName}
              </p>
            </div>

            <div className="text-left sm:text-right bg-white/5 p-3 rounded-2xl border border-white/10 shrink-0">
              <span className="text-[10px] text-forest-300 uppercase tracking-widest font-mono block">
                Estimated Delivery
              </span>
              <div className="text-lg font-black text-white font-display">
                {trackedDelivery.status === 'delivered' ? (
                  <span className="text-emerald-400">Delivered & Signed ✅</span>
                ) : (
                  <span>Today in ~{trackedDelivery.estimatedMinutesRemaining} mins</span>
                )}
              </div>
              <span className="text-[11px] text-forest-200/80 block mt-0.5">
                {trackedDelivery.status === 'delivered' ? 'Intake verified at destination' : `${trackedDelivery.distanceKm} km from destination`}
              </span>
            </div>
          </div>

          {/* Flipkart / Amazon Style Horizontal Stepper */}
          <div className="px-6 sm:px-8 pt-2 pb-4">
            <div className="relative">
              {/* Stepper Connecting Bar */}
              <div className="absolute top-4 left-6 right-6 h-1 bg-stonebg-200 dark:bg-obsidian-800 -z-0">
                <div
                  className="bg-forest-600 h-full transition-all duration-500"
                  style={{
                    width:
                      trackedDelivery.status === 'delivered'
                        ? '100%'
                        : trackedDelivery.status === 'in_transit' || trackedDelivery.status === 'diverted'
                        ? '66%'
                        : '33%',
                  }}
                />
              </div>

              {/* 4 Steps */}
              <div className="relative z-10 grid grid-cols-4 gap-2 text-center text-xs">
                {/* Step 1: Placed */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Donation Verified</span>
                    <span className="text-[10px] text-slate-400">10:15 PM</span>
                  </div>
                </div>

                {/* Step 2: Picked Up */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shadow-md ${
                      trackedDelivery.pickedUpAt
                        ? 'bg-forest-600 text-white'
                        : 'bg-stonebg-200 dark:bg-obsidian-800 text-slate-400'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Picked Up</span>
                    <span className="text-[10px] text-slate-400">Inspected at Kitchen</span>
                  </div>
                </div>

                {/* Step 3: Out for Delivery */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shadow-md ${
                      trackedDelivery.status === 'in_transit' || trackedDelivery.status === 'diverted'
                        ? 'bg-blue-600 text-white animate-pulse ring-4 ring-blue-500/20'
                        : trackedDelivery.status === 'delivered'
                        ? 'bg-forest-600 text-white'
                        : 'bg-stonebg-200 dark:bg-obsidian-800 text-slate-400'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {trackedDelivery.status === 'diverted' ? 'Rerouted Mid-Way' : 'Out for Delivery'}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold font-mono">
                      {trackedDelivery.status === 'delivered' ? 'Completed' : 'Live GPS Moving'}
                    </span>
                  </div>
                </div>

                {/* Step 4: Reached Shelter */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shadow-md ${
                      trackedDelivery.status === 'delivered'
                        ? 'bg-forest-600 text-white ring-4 ring-forest-500/20'
                        : 'bg-stonebg-200 dark:bg-obsidian-800 text-slate-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Destination Reached</span>
                    <span className="text-[10px] text-slate-400">
                      {trackedDelivery.status === 'delivered' ? 'Signed & Distributed' : 'Pending Arrival'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courier Card & Dynamic Destination Card */}
          <div className="px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Courier Profile (Amazon Style) */}
            <div className="lux-card p-4 space-y-3 bg-stonebg-50/70 dark:bg-obsidian-900/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Delivery Courier Partner
                </span>
                <span className="text-[10px] font-bold text-forest-700 bg-forest-100 dark:bg-forest-950 px-2 py-0.5 rounded-full">
                  ★ 4.9 (62 rescues)
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                    {trackedDelivery.riderName}
                  </h4>
                  <p className="text-xs text-slate-500">{trackedDelivery.riderVehicle}</p>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    Plate: MH-02-CX-4821
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => alert(`Calling volunteer courier ${trackedDelivery.riderName} at ${trackedDelivery.riderPhone}...`)}
                    className="p-2 rounded-xl bg-white dark:bg-obsidian-800 border border-stonebg-200 dark:border-obsidian-700 text-slate-700 dark:text-slate-200 hover:border-forest-500 transition"
                    title="Call Courier"
                  >
                    <Phone className="w-4 h-4 text-forest-600" />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-obsidian-800 p-2.5 rounded-xl border border-stonebg-200 dark:border-obsidian-700 text-xs flex justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">Live Status:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {trackedDelivery.status === 'delivered' ? 'Completed Handover' : 'Driving on Route'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Remaining Distance:</span>
                  <span className="font-black text-blue-600">
                    {trackedDelivery.status === 'delivered' ? '0.0 km' : `${trackedDelivery.distanceKm} km`}
                  </span>
                </div>
              </div>
            </div>

            {/* Destination Shelter with Dynamic Reroute Alert */}
            <div className="lux-card p-4 space-y-3 bg-stonebg-50/70 dark:bg-obsidian-900/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Delivery Destination
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    trackedDelivery.status === 'diverted'
                      ? 'bg-gold-100 text-gold-900 dark:bg-gold-950 dark:text-gold-300'
                      : 'bg-forest-100 text-forest-900 dark:bg-forest-950 dark:text-forest-300'
                  }`}
                >
                  {trackedDelivery.status === 'diverted' ? 'REDIRECTED SHELTER' : 'VERIFIED INTAKE'}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    trackedDelivery.status === 'diverted'
                      ? 'bg-gold-500/10 border border-gold-500/30 text-gold-600'
                      : 'bg-forest-500/10 border border-forest-500/30 text-forest-600'
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                    {trackedDelivery.assignedShelterName}
                  </h4>
                  <p className="text-xs text-slate-500">{trackedDelivery.shelterAddress}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-forest-700 dark:text-forest-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Clean Potable Water & Chilled Storage Verified</span>
                  </div>
                </div>
              </div>

              {/* Reroute explanation if diverted */}
              {trackedDelivery.status === 'diverted' ? (
                <div className="p-2.5 rounded-xl bg-gold-50 dark:bg-gold-950/60 border border-gold-300 dark:border-gold-800 text-[11px] text-gold-950 dark:text-gold-200">
                  <span className="font-bold flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 animate-spin" /> Mid-Route Auto-Redirection
                  </span>
                  <p className="mt-0.5 opacity-90 leading-tight">
                    {trackedDelivery.rerouteReason ||
                      'Original shelter requirement was fulfilled mid-route. The algorithm redirected this consignment to the nearest open shelter with zero food waste.'}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white dark:bg-obsidian-800 border border-stonebg-200 dark:border-obsidian-700 text-[11px] text-slate-600 dark:text-slate-300 flex justify-between">
                  <span>Destination Shelter Status:</span>
                  <span className="font-bold text-forest-700 dark:text-forest-400">Open & Ready for Handover</span>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ⚡ THE HIGHLIGHT INNOVATION: SHELTER DEMAND FULFILLED AUTO-REROUTE BUTTON */}
          {/* ========================================================================= */}
          <div className="mx-6 sm:mx-8 p-4 rounded-2xl bg-gradient-to-r from-gold-50 via-amber-50 to-orange-50 dark:from-obsidian-900 dark:via-obsidian-800 dark:to-obsidian-900 border-2 border-gold-400/80 dark:border-gold-600/60 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-gold-600" />
                  <span className="font-black text-xs uppercase tracking-wider text-gold-900 dark:text-gold-300 font-mono">
                    Mid-Route Disruption Feature
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                  What if this shelter's food requirement is fulfilled right now?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  If another donor fulfills this shelter's capacity while the rider is on the road, ResQRoute's algorithm automatically reroutes the courier to the next nearest shelter.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateFulfillAndReroute}
                className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition flex items-center gap-2 shrink-0"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Simulate Demand Fulfilled (Auto-Reroute)</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Movement Controls & Map View */}
          <div className="mx-6 sm:mx-8 mb-6 p-4 rounded-2xl bg-stonebg-100 dark:bg-obsidian-800 border border-stonebg-200 dark:border-obsidian-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-forest-600 animate-spin" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Simulate Live Courier Navigation
                </span>
                <span className="text-slate-500 text-[11px]">
                  Advance the courier closer or verify immediate delivery handover at destination.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {trackedDelivery.status !== 'delivered' ? (
                <>
                  <button
                    onClick={() => stepSimulatedMovement(trackedDelivery.id)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-800 dark:text-blue-200 font-bold border border-blue-300 dark:border-blue-800 transition shadow-sm"
                  >
                    🚴 Move Courier Closer (+35%)
                  </button>
                  <button
                    onClick={() => completeDelivery(trackedDelivery.id)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold transition shadow-sm"
                  >
                    🏁 Confirm Shelter Arrival & Handover
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-200 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-forest-600" />
                    Delivery Verified at Shelter!
                  </span>
                  <button
                    onClick={() => setActiveReceipt(trackedDonation)}
                    className="px-3 py-1.5 rounded-xl bg-forest-800 text-white font-bold transition shadow-sm"
                  >
                    View Official Certificate 📜
                  </button>
                </div>
              )}

              <button
                onClick={() => setActiveRole('admin')}
                className="px-3 py-2 rounded-xl bg-white dark:bg-obsidian-700 text-slate-700 dark:text-slate-200 font-semibold border border-stonebg-200 dark:border-obsidian-600"
              >
                View Operations Map ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset Cards Selector */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
            New Surplus Item? Choose a 1-click preset or declare custom batch:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presets.map(p => {
              const isSelected = formData.itemName === p.title;
              return (
                <div
                  key={p.id}
                  onClick={() => applyAndSelectPreset(p)}
                  className={`lux-card p-5 cursor-pointer relative group transition-all ${
                    isSelected
                      ? 'border-forest-500 ring-2 ring-forest-500/20 bg-forest-50/40 dark:bg-forest-950/20'
                      : 'hover:border-stonebg-300 dark:hover:border-obsidian-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-forest-100 dark:bg-forest-950 text-forest-900 dark:text-forest-300">
                      {p.badge}
                    </span>
                    <span className="text-sm font-black text-forest-700 dark:text-forest-400 font-display">
                      {p.qty} {p.unit}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                  <div className="pt-3 flex items-center justify-between text-xs font-semibold text-forest-700 dark:text-forest-400">
                    <span>{isSelected ? '✓ Selected' : 'Click to Load'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Donation Form + Safety Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="lux-card p-6 sm:p-7 space-y-6"
          >
            <div className="border-b border-stonebg-200 dark:border-obsidian-700 pb-3 flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                <span>Donation Batch Declaration</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">* Safety Certified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Donor / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.donorName}
                  onChange={e => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone / Coordinator *
                </label>
                <input
                  type="text"
                  required
                  value={formData.donorContact}
                  onChange={e => setFormData({ ...formData, donorContact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  {Object.values(FOOD_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Batch Quantity *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-2/3 px-3 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500 font-bold"
                  />
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-1/3 px-2 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900"
                  >
                    <option value="meals">meals</option>
                    <option value="kg">kg</option>
                    <option value="boxes">boxes</option>
                    <option value="loaves">loaves</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prepared (Hours Ago) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="48"
                  required
                  value={formData.prepTimeHoursAgo}
                  onChange={e => setFormData({ ...formData, prepTimeHoursAgo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Holding Temperature *
                </label>
                <select
                  value={formData.storageMethod}
                  onChange={e => setFormData({ ...formData, storageMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  {Object.values(STORAGE_METHODS).map(sm => (
                    <option key={sm} value={sm}>
                      {sm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pickup Facility Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stonebg-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.hasStorageHistory}
                    onChange={e => setFormData({ ...formData, hasStorageHistory: e.target.checked })}
                    className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500"
                  />
                  <span>I certify food was prepared in sanitary conditions and temperature logged.</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-forest-950 dark:bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-sm shadow-xl shadow-forest-950/20 transition-all flex items-center justify-center gap-2 border border-forest-800"
            >
              <PackageCheck className="w-4 h-4 text-forest-300" />
              <span>Submit & Dispatch Courier Live</span>
            </button>
          </form>
        </div>

        {/* Right 1 Col: Real-Time Safety Engine Evaluation Preview */}
        <div className="space-y-4">
          <div className="lux-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stonebg-200 dark:border-obsidian-700 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Live Safety Evaluation Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-stonebg-100 dark:bg-obsidian-800 px-1.5 py-0.5 rounded text-slate-500">
                Rule R-0
              </span>
            </div>

            <div className="p-4 rounded-xl border text-xs space-y-2 bg-forest-50 dark:bg-forest-950/60 border-forest-300 dark:border-forest-800 text-forest-950 dark:text-forest-200">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 dark:text-forest-400" />
                  {liveSafetyResult.status}
                </span>
                <span className="font-mono text-[10px] font-bold opacity-80">
                  {liveSafetyResult.ruleId}
                </span>
              </div>
              <p className="leading-relaxed opacity-90">{liveSafetyResult.reason}</p>
              {liveSafetyResult.safeWindowHours > 0 && (
                <div className="pt-2 border-t border-black/10 flex items-center justify-between font-semibold">
                  <span>Safe Viable Dispatch Window:</span>
                  <span className="font-bold text-sm">~{liveSafetyResult.safeWindowHours.toFixed(1)} hrs</span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-stonebg-100 dark:bg-obsidian-900 border border-stonebg-200 dark:border-obsidian-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" /> Transparent Food Safety Policy
              </span>
              <p className="leading-relaxed">
                ResQRoute uses transparent microbial holding thresholds. We never certify consumption safety based on arbitrary image guesses. Physical verification is required upon rider pickup.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Certificate Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-white dark:bg-obsidian-900 rounded-3xl p-6 border border-stonebg-200 dark:border-obsidian-800 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-forest-900 to-forest-600 flex items-center justify-center text-white shadow-xl shadow-forest-900/20">
                <Award className="w-8 h-8 text-forest-200" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-forest-700 bg-forest-50 dark:bg-forest-950 px-2.5 py-0.5 rounded-full">
                Verified Food Rescue Certificate
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                {activeReceipt.itemName}
              </h3>
              <p className="text-xs text-slate-500">
                Logged & allocated through ResQRoute Automated Logistics Grid.
              </p>
            </div>

            <div className="bg-stonebg-50 dark:bg-obsidian-800 p-4 rounded-2xl border border-stonebg-200 dark:border-obsidian-700 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Batch Identifier:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {activeReceipt.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Donor Facility:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeReceipt.donorName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity Saved:</span>
                <span className="font-extrabold text-forest-600 dark:text-forest-400">
                  {activeReceipt.quantity} {activeReceipt.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated CO2 Prevented:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ~{(activeReceipt.quantity * 2.5).toFixed(1)} kg CO2e
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('Certificate copied to clipboard! (Shareable link created)');
                }}
                className="flex-1 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Impact</span>
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2.5 rounded-xl bg-stonebg-100 hover:bg-stonebg-200 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
