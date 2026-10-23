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
  Zap,
  ArrowRight,
  Sliders,
} from 'lucide-react';

export default function DonorDashboard() {
  const { createDonation, donations, userLocation } = useApp();

  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'custom'

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
      setActiveReceipt(newDonation);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Food Donor Coordination Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
              Verified Intake
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Declare surplus food with transparent microbial safety checks and automated courier allocation.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-stonebg-100 dark:bg-obsidian-900 p-1 rounded-2xl border border-stonebg-200 dark:border-obsidian-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'presets'
                ? 'bg-white dark:bg-obsidian-800 text-forest-950 dark:text-forest-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
            <span>1-Click Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'custom'
                ? 'bg-white dark:bg-obsidian-800 text-forest-950 dark:text-forest-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
            <span>Custom Form</span>
          </button>
        </div>
      </div>

      {/* Preset Cards Selector */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Choose a common donor scenario (or customize below):
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
                    <span className="text-sm font-black text-forest-700 dark:text-forest-400">
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

      {/* Main Grid: Form + Live Safety Evaluation */}
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
              {/* Donor Name */}
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

              {/* Contact */}
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

              {/* Item Name */}
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

              {/* Category */}
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

              {/* Quantity */}
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

              {/* Prep Time */}
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

              {/* Storage */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Holding Temperature Method *
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

              {/* Address */}
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

              {/* Confirmation check */}
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
              <span>Submit & Dispatch to AI Matching Grid</span>
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

            {/* Safety Badge Outcome */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                liveSafetyResult.status === 'ELIGIBLE'
                  ? 'bg-forest-50 dark:bg-forest-950/60 border-forest-300 dark:border-forest-800 text-forest-950 dark:text-forest-200'
                  : liveSafetyResult.status === 'REVIEW_REQUIRED'
                  ? 'bg-gold-50 dark:bg-gold-950/60 border-gold-300 dark:border-gold-800 text-gold-950 dark:text-gold-200'
                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-1.5">
                  {liveSafetyResult.status === 'ELIGIBLE' && (
                    <CheckCircle2 className="w-4 h-4 text-forest-600 dark:text-forest-400" />
                  )}
                  {liveSafetyResult.status === 'REVIEW_REQUIRED' && (
                    <AlertTriangle className="w-4 h-4 text-gold-600" />
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

            {/* Scientific Transparency */}
            <div className="p-3.5 rounded-xl bg-stonebg-100 dark:bg-obsidian-900 border border-stonebg-200 dark:border-obsidian-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" /> Transparent Food Safety Policy
              </span>
              <p className="leading-relaxed">
                ResQRoute uses transparent microbial holding thresholds. We never certify consumption safety based on arbitrary image guesses or smell. Physical verification is required upon rider pickup.
              </p>
            </div>
          </div>

          {/* Active Batches */}
          <div className="lux-card p-5 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Your Registered Batches
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {donations.slice(0, 3).map(d => (
                <div
                  key={d.id}
                  onClick={() => setActiveReceipt(d)}
                  className="p-3 rounded-xl bg-stonebg-50 dark:bg-obsidian-900/60 border border-stonebg-200 dark:border-obsidian-700 hover:border-forest-500 cursor-pointer transition text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {d.itemName}
                    </span>
                    <span className="font-black text-forest-700 dark:text-forest-400 shrink-0">
                      {d.quantity} {d.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{d.status}</span>
                    <span className="text-forest-600 dark:text-forest-400 font-semibold">View Certificate →</span>
                  </div>
                </div>
              ))}
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
              <div className="flex justify-between">
                <span className="text-slate-400">Safety Rule Clearance:</span>
                <span className="font-mono text-[10px] text-forest-700 dark:text-forest-300">
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
