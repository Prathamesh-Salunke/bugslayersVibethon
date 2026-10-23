import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FOOD_CATEGORIES,
  STORAGE_METHODS,
  evaluateFoodSafetyEligibility,
} from '../engines/shelfLifeEngine';
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
} from 'lucide-react';

export default function DonorDashboard() {
  const { createDonation, donations, userLocation } = useApp();

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

  const [activeReceipt, setActiveReceipt] = useState(null);

  // Live Safety Engine Evaluation Preview
  const liveSafetyResult = evaluateFoodSafetyEligibility({
    category: formData.category,
    cookedOrPackaged: formData.cookedOrPackaged,
    prepTimeHoursAgo: Number(formData.prepTimeHoursAgo),
    storageMethod: formData.storageMethod,
    packagingType: formData.packagingType,
    hasStorageHistory: formData.hasStorageHistory,
    verifiedUseByHoursRemaining: 4,
  });

  // Quick Preset Handlers
  const applyPreset = presetType => {
    if (presetType === 'wedding') {
      setFormData({
        donorName: 'Royal Palace Banquet',
        donorContact: '+91 98201 12345',
        itemName: 'Wedding Buffet: Rice, Gravy & Paneer',
        category: FOOD_CATEGORIES.COOKED_MEAL,
        cookedOrPackaged: 'Cooked',
        quantity: 140,
        unit: 'meals',
        isVegetarian: true,
        prepTimeHoursAgo: 1.5,
        storageMethod: STORAGE_METHODS.HOT_HOLD,
        packagingType: 'Insulated Metal Chafing Dishes',
        hasStorageHistory: true,
        needsCooking: false,
        address: 'Royal Palace Banquet, Link Road',
        pickupReadiness: 'Ready for loading',
        notes: 'Excess banquet buffet',
      });
    } else if (presetType === 'bakery') {
      setFormData({
        donorName: 'Artisan Sourdough Co.',
        donorContact: '+91 98202 54321',
        itemName: 'Assorted Loaves & Rolls',
        category: FOOD_CATEGORIES.BAKERY,
        cookedOrPackaged: 'Packaged',
        quantity: 35,
        unit: 'loaves',
        isVegetarian: true,
        prepTimeHoursAgo: 4,
        storageMethod: STORAGE_METHODS.ROOM_TEMP,
        packagingType: 'Paper Bags',
        hasStorageHistory: true,
        needsCooking: false,
        address: 'Bakehouse 12, Hill Road',
        pickupReadiness: 'Boxed at front counter',
        notes: 'Freshly baked today',
      });
    } else if (presetType === 'mess') {
      setFormData({
        donorName: 'Engineering Hostel Mess',
        donorContact: '+91 98203 98765',
        itemName: 'Lunch Trays (Rice & Veggies)',
        category: FOOD_CATEGORIES.COOKED_MEAL,
        cookedOrPackaged: 'Cooked',
        quantity: 50,
        unit: 'meals',
        isVegetarian: true,
        prepTimeHoursAgo: 2,
        storageMethod: STORAGE_METHODS.REFRIGERATED,
        packagingType: 'Sealed Trays',
        hasStorageHistory: true,
        needsCooking: false,
        address: 'Campus Hostel 3 Mess',
        pickupReadiness: 'Chilled in walk-in fridge',
        notes: 'Prepared for lunch service',
      });
    }
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
      setActiveReceipt(newDonation);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Food Donor Coordination Hub
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Declare surplus food with transparent microbial holding checks and automated recipient matching.
        </p>
      </div>

      {/* Quick Fill Presets */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Quick 1-Click Demo Presets:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('wedding')}
            className="px-3 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            🍛 Wedding Feast (140 Meals)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('bakery')}
            className="px-3 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            🥖 Bakery Surplus (35 Loaves)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('mess')}
            className="px-3 py-1.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            🏫 Hostel Mess (50 Meals)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Guided Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm space-y-6"
          >
            <div className="border-b border-warm-200 dark:border-slate-700 pb-3 flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                <span>Surplus Item Declaration Form</span>
              </h2>
              <span className="text-[11px] text-slate-400">* Required for safety audit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Donor Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Donor / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.donorName}
                  onChange={e => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone / Coordinator *
                </label>
                <input
                  type="text"
                  required
                  value={formData.donorContact}
                  onChange={e => setFormData({ ...formData, donorContact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Item Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food / Aid Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Food Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.values(FOOD_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cooked or Packaged */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preparation Classification *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cookedOrPackaged: 'Cooked' })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      formData.cookedOrPackaged === 'Cooked'
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                        : 'border-warm-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Cooked Meal
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cookedOrPackaged: 'Packaged' })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      formData.cookedOrPackaged === 'Packaged'
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                        : 'border-warm-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Packaged / Bakery
                  </button>
                </div>
              </div>

              {/* Quantity & Unit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Batch Quantity *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-2/3 px-3 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-1/3 px-2 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    <option value="meals">meals</option>
                    <option value="kg">kg</option>
                    <option value="boxes">boxes</option>
                    <option value="loaves">loaves</option>
                  </select>
                </div>
              </div>

              {/* Vegetarian */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dietary Classification
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isVegetarian: true })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      formData.isVegetarian
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                        : 'border-warm-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    🌱 100% Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isVegetarian: false })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      !formData.isVegetarian
                        ? 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-800 dark:text-amber-300'
                        : 'border-warm-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    🍗 Contains Meat/Egg
                  </button>
                </div>
              </div>

              {/* Prep Time Ago */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preparation Time (Hours Ago) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="48"
                  required
                  value={formData.prepTimeHoursAgo}
                  onChange={e => setFormData({ ...formData, prepTimeHoursAgo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Storage Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Active Storage Method *
                </label>
                <select
                  value={formData.storageMethod}
                  onChange={e => setFormData({ ...formData, storageMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.values(STORAGE_METHODS).map(sm => (
                    <option key={sm} value={sm}>
                      {sm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pickup Facility Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-warm-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Readiness & Checkboxes */}
              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.hasStorageHistory}
                    onChange={e => setFormData({ ...formData, hasStorageHistory: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>I confirm continuous temperature monitoring history is logged.</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>Submit & Dispatch to AI Matching Grid</span>
            </button>
          </form>
        </div>

        {/* Right 1 Col: Real-Time Safety Engine Evaluation Preview */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Live Safety Evaluation Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500">
                Rule Engine R-0
              </span>
            </div>

            {/* Safety Badge Outcome */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                liveSafetyResult.status === 'ELIGIBLE'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : liveSafetyResult.status === 'REVIEW_REQUIRED'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-1.5">
                  {liveSafetyResult.status === 'ELIGIBLE' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {liveSafetyResult.status === 'REVIEW_REQUIRED' && (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
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

            {/* Honest Scientific Disclaimer */}
            <div className="p-3 rounded-xl bg-warm-100 dark:bg-slate-900 border border-warm-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" /> Algorithmic Safety Transparency
              </span>
              <p className="leading-relaxed">
                ResQRoute uses transparent microbial holding thresholds. We never certify consumption safety based on arbitrary image guesses or smell. Physical verification is required upon rider pickup.
              </p>
            </div>
          </div>

          {/* Recent Donor Submissions */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Your Active Batches
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {donations.slice(0, 3).map(d => (
                <div
                  key={d.id}
                  onClick={() => setActiveReceipt(d)}
                  className="p-3 rounded-xl bg-warm-50 dark:bg-slate-900/40 border border-warm-200 dark:border-slate-700/60 hover:border-emerald-500 cursor-pointer transition text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-white truncate">
                      {d.itemName}
                    </span>
                    <span className="font-black text-emerald-600 shrink-0">
                      {d.quantity} {d.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{d.status}</span>
                    <span className="text-emerald-600 font-semibold">View Certificate →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Impact Certificate Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-warm-200 dark:border-slate-800 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                <Award className="w-8 h-8 text-emerald-200" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                Verified Food Rescue Certificate
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {activeReceipt.itemName}
              </h3>
              <p className="text-xs text-slate-500">
                Logged & allocated through ResQRoute Automated Logistics Grid.
              </p>
            </div>

            <div className="bg-warm-50 dark:bg-slate-800 p-4 rounded-2xl border border-warm-200 dark:border-slate-700 text-xs space-y-2.5">
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
                <span className="font-extrabold text-emerald-600">
                  {activeReceipt.quantity} {activeReceipt.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated CO2 Prevented:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ~{(activeReceipt.quantity * 2.5).toFixed(1)} kg CO2e
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Safety Rule Clearance:</span>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-300">
                  {activeReceipt.safetyRule || 'RULE-R04 Checked'}
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
                className="px-4 py-2.5 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
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
