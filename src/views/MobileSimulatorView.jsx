import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  ShieldCheck,
  Bike,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Navigation,
  ArrowLeft,
  QrCode,
  RotateCw,
  Package,
  Heart,
  Star,
  Zap,
} from 'lucide-react';

function PhoneFrame({ children, label, color = '#061a14' }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div
        className="relative rounded-[44px] overflow-hidden shadow-2xl shadow-black/70 border-4 border-slate-700"
        style={{
          width: '320px',
          height: '640px',
          background: color,
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />
        {/* Screen */}
        <div className="absolute inset-0 overflow-y-auto scrollbar-hide pt-8">
          {children}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}

/* ---------- DONOR MOBILE SCREEN ---------- */
function DonorMobileScreen() {
  const { donations } = useApp();
  const myDonation = donations[0];
  const [screen, setScreen] = useState('home'); // home | tracking

  if (screen === 'tracking' && myDonation) {
    const steps = [
      { label: 'Donation Submitted & Verified', done: true, time: '12:15 PM', icon: CheckCircle2 },
      { label: 'Safety Screened — ELIGIBLE', done: true, time: '12:16 PM', icon: ShieldCheck },
      { label: 'Matched to Hope Shelter', done: true, time: '12:20 PM', icon: Building2 },
      { label: 'Rider Dispatched (Rohit Kumar)', done: true, time: '12:25 PM', icon: Bike },
      { label: 'Picked Up from Kitchen', done: true, time: '12:35 PM', icon: Package },
      { label: 'Out for Delivery — Live', done: myDonation.status === 'in_transit' || myDonation.status === 'delivered', active: myDonation.status === 'in_transit', time: '12:42 PM', icon: Navigation },
      { label: 'Delivered & Receipt Confirmed', done: myDonation.status === 'delivered', time: 'Expected 1:05 PM', icon: Heart },
    ];
    return (
      <div className="min-h-full bg-[#071a10] text-white pb-6">
        {/* Header */}
        <div className="p-4 pt-6 flex items-center gap-3 bg-[#0a2118]">
          <button onClick={() => setScreen('home')} className="p-1.5 rounded-lg bg-white/10 text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs font-bold text-white">Live Order Tracking</p>
            <p className="text-[10px] text-emerald-400">{myDonation.id}</p>
          </div>
        </div>

        {/* ETA Card */}
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-700/50">
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Estimated Delivery</p>
          <p className="text-2xl font-black text-white mt-0.5">~14 Minutes</p>
          <p className="text-xs text-slate-300 mt-0.5">To Hope Shelter, Santacruz West</p>
          <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[68%] bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" />
          </div>
        </div>

        {/* Tracking Steps */}
        <div className="px-4 mt-5 space-y-4 relative before:absolute before:left-[29px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  st.done ? 'bg-emerald-600' : st.active ? 'bg-cyan-500 animate-pulse' : 'bg-slate-800 border border-slate-700'
                }`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="pt-1 flex-1">
                  <p className={`text-xs font-semibold ${st.done ? 'text-white' : 'text-slate-500'}`}>{st.label}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{st.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Courier Info */}
        <div className="mx-4 mt-5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-700/50 flex items-center justify-center text-xl">🚴</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white">Rohit Kumar (Rider R-01)</p>
            <p className="text-[10px] text-slate-400">Electric Cargo Scooter • ★ 4.9</p>
          </div>
          <button className="p-2 rounded-xl bg-emerald-700/30 border border-emerald-600/30 text-emerald-400">
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#071a10] text-white pb-6">
      {/* Top Nav */}
      <div className="p-4 pt-6 flex items-center justify-between bg-[#0a2118]">
        <div>
          <p className="text-xs font-bold text-white">Donor Portal</p>
          <p className="text-[10px] text-emerald-400">GreenLeaf Kitchen</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm">🍲</div>
      </div>

      {/* Hero */}
      <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-800/60 to-emerald-950 border border-emerald-700/50">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active Donation</p>
        <p className="text-sm font-black text-white mt-1">{myDonation?.itemName || 'Fresh Cooked Meals'}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-emerald-700/40 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-600/30">
            {myDonation?.quantity} portions
          </span>
          <span className="text-xs bg-cyan-900/40 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-700/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            In Transit
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Safe window: {myDonation?.safeWindowHours}h remaining
        </p>
        <button
          onClick={() => setScreen('tracking')}
          className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Navigation className="w-3.5 h-3.5" />
          Track Live Delivery
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2">
        {[
          { label: 'Total Donated', value: '210', unit: 'meals', color: 'text-emerald-400' },
          { label: 'Deliveries', value: '6', unit: 'completed', color: 'text-cyan-400' },
          { label: 'Safety Rating', value: '100%', unit: 'eligible', color: 'text-emerald-400' },
          { label: 'People Helped', value: '180+', unit: 'beneficiaries', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-[10px] text-slate-400">{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4 space-y-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions</p>
        {[
          { label: 'Donate More Food', icon: Heart, color: 'bg-emerald-700/30 border-emerald-700/50 text-emerald-400' },
          { label: 'View All My Donations', icon: Package, color: 'bg-slate-800 border-slate-700/50 text-slate-300' },
          { label: 'Contact Support', icon: Navigation, color: 'bg-slate-800 border-slate-700/50 text-slate-300' },
        ].map(a => (
          <button key={a.label} className={`w-full p-3 rounded-xl border ${a.color} flex items-center justify-between text-xs font-semibold transition hover:opacity-80`}>
            <div className="flex items-center gap-2">
              <a.icon className="w-4 h-4" />
              {a.label}
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- RIDER MOBILE SCREEN ---------- */
function RiderMobileScreen() {
  const { deliveries, stepSimulatedMovement, completeDelivery } = useApp();
  const activeDelivery = deliveries.find(d => d.status === 'in_transit') || deliveries[0];

  return (
    <div className="min-h-full bg-[#071a10] text-white pb-6">
      {/* Header */}
      <div className="p-4 pt-6 flex items-center justify-between bg-[#0a2118]">
        <div>
          <p className="text-xs font-bold text-white">Volunteer Courier</p>
          <p className="text-[10px] text-cyan-400">Rohit Kumar • ★ 4.9 • 48 trips</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/40">
            AVAILABLE
          </span>
          <div className="w-8 h-8 rounded-full bg-cyan-700 flex items-center justify-center text-sm">🚴</div>
        </div>
      </div>

      {/* Active Job Card */}
      {activeDelivery && (
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-cyan-900/30 border border-cyan-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400">{activeDelivery.id}</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/30 animate-pulse">
              IN TRANSIT
            </span>
          </div>
          <p className="text-sm font-bold text-white">{activeDelivery.donationItemName}</p>
          <p className="text-[10px] text-slate-300 mt-0.5">
            {activeDelivery.quantity} {activeDelivery.unit} • {activeDelivery.foodCategory}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
            <MapPin className="w-3 h-3 text-amber-400" />
            From: <span className="text-white font-medium">{activeDelivery.donorAddress?.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
            <Building2 className="w-3 h-3 text-emerald-400" />
            To: <span className="text-white font-medium">{activeDelivery.assignedShelterName}</span>
          </div>

          {/* Progress */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>En Route</span>
              <span className="text-cyan-300 font-bold">~{activeDelivery.estimatedMinutesRemaining}m left</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all"
                style={{ width: `${Math.max(15, Math.min(90, 100 - (activeDelivery.estimatedMinutesRemaining / activeDelivery.deliveryDeadlineMinutes) * 100))}%` }}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => stepSimulatedMovement(activeDelivery.id)}
              className="py-2.5 bg-cyan-700/30 border border-cyan-700/50 text-cyan-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition hover:bg-cyan-700/50"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Advance GPS
            </button>
            <button
              onClick={() => completeDelivery(activeDelivery.id)}
              className="py-2.5 bg-emerald-700/40 border border-emerald-600/50 text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition hover:bg-emerald-700/60"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm Delivery
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Trips Done', value: '48', color: 'text-cyan-400' },
          { label: 'Reliability', value: '98%', color: 'text-emerald-400' },
          { label: 'Capacity', value: '40', color: 'text-white' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center">
            <p className={`text-base font-black ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Ghost Reserve Guard Info */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-700/40 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-200">
          <span className="font-bold">Ghost Reservation Guard Active:</span> If unresponsive for 60s after assignment, delivery auto-transfers to backup rider.
        </p>
      </div>
    </div>
  );
}

/* ---------- SHELTER MOBILE SCREEN ---------- */
function ShelterMobileScreen() {
  const { shelters, deliveries } = useApp();
  const shelter = shelters[0];
  const inboundDelivery = deliveries.find(d => d.assignedShelterId === shelter?.id && d.status !== 'delivered');

  const pct = shelter ? Math.min(100, Math.round((shelter.currentOccupancy / shelter.capacity) * 100)) : 0;

  return (
    <div className="min-h-full bg-[#071a10] text-white pb-6">
      {/* Header */}
      <div className="p-4 pt-6 bg-[#0a2118]">
        <p className="text-xs font-bold text-white">Shelter Intake</p>
        <p className="text-[10px] text-emerald-400">{shelter?.name}</p>
      </div>

      {/* Capacity Ring Visualization */}
      <div className="mx-4 mt-4 p-5 rounded-2xl bg-[#0c221a] border border-emerald-900/50 flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e3a2f" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={pct > 85 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#10b981'}
              strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{pct}%</span>
            <span className="text-[9px] text-slate-400">Capacity</span>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-300 font-medium">{shelter?.currentOccupancy} / {shelter?.capacity} occupants</p>
          <p className="text-[10px] text-amber-400 font-bold mt-0.5 flex items-center gap-1 justify-center">
            <AlertTriangle className="w-3 h-3" />
            Needs {shelter?.openDemand} more portions
          </p>
        </div>
      </div>

      {/* Inbound Delivery */}
      {inboundDelivery && (
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-700/40">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-cyan-400 animate-bounce" />
            <p className="text-xs font-bold text-white">Inbound Delivery</p>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/30 animate-pulse">
              EN ROUTE
            </span>
          </div>
          <p className="text-sm font-bold text-white">{inboundDelivery.donationItemName}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Courier: <span className="text-white font-semibold">{inboundDelivery.riderName?.split('(')[0].trim()}</span>
          </p>
          <p className="text-[11px] text-slate-400">
            ETA: <span className="text-cyan-300 font-bold">~{inboundDelivery.estimatedMinutesRemaining} minutes</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button className="flex-1 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" />
              Show QR
            </button>
            <button className="flex-1 py-2 bg-emerald-700/40 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-600/40 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ready to Receive
            </button>
          </div>
        </div>
      )}

      {/* Facilities */}
      <div className="mx-4 mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Verified Facilities</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(shelter?.facilities || {}).map(([k, v]) => (
            <div key={k} className={`flex items-center gap-1.5 text-[10px] font-medium ${v ? 'text-emerald-400' : 'text-slate-600'}`}>
              {v ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3 text-slate-600" />}
              {k.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between">
        <p className="text-[10px] text-slate-400 font-medium">Dietary Restriction</p>
        <span className="text-[10px] font-bold text-white">{shelter?.dietaryRestriction || 'None'}</span>
      </div>
    </div>
  );
}

/* ---------- MAIN MOBILE SIMULATOR VIEW ---------- */
export default function MobileSimulatorView() {
  const [activePhone, setActivePhone] = useState('donor');

  const phoneOptions = [
    { id: 'donor', label: '🍲 Donor', desc: 'Submit & track donations' },
    { id: 'rider', label: '🚴 Rider', desc: 'Active delivery management' },
    { id: 'shelter', label: '🏠 Shelter', desc: 'Intake & demand tracking' },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-8 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-cyan-950 text-cyan-300 border border-cyan-700/40 rounded-full mb-3">
          <Smartphone className="w-3.5 h-3.5" />
          Mobile App Simulator
        </div>
        <h2 className="text-2xl font-black text-white">Role-Based Mobile Flows</h2>
        <p className="text-sm text-slate-400 mt-1">
          Switch between Donor, Rider, and Shelter perspectives — all synchronized with live app state.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-2 mb-8 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        {phoneOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => setActivePhone(opt.id)}
            className={`flex flex-col items-center px-5 py-2.5 rounded-xl transition-all text-xs font-bold ${
              activePhone === opt.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{opt.label}</span>
            <span className={`text-[9px] font-normal mt-0.5 ${activePhone === opt.id ? 'text-emerald-200' : 'text-slate-600'}`}>
              {opt.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Phone Frames */}
      <div className="flex flex-wrap justify-center gap-10">
        {activePhone === 'donor' && (
          <PhoneFrame label="Donor — GreenLeaf Kitchen">
            <DonorMobileScreen />
          </PhoneFrame>
        )}
        {activePhone === 'rider' && (
          <PhoneFrame label="Rider — Rohit Kumar (R-01)" color="#070d14">
            <RiderMobileScreen />
          </PhoneFrame>
        )}
        {activePhone === 'shelter' && (
          <PhoneFrame label="Shelter — Hope Shelter (Shelter A)" color="#07120a">
            <ShelterMobileScreen />
          </PhoneFrame>
        )}

        {/* Show all three side-by-side on wide screens */}
        <div className="hidden 2xl:flex gap-8">
          {activePhone !== 'donor' && (
            <PhoneFrame label="Donor — GreenLeaf Kitchen">
              <DonorMobileScreen />
            </PhoneFrame>
          )}
          {activePhone !== 'rider' && (
            <PhoneFrame label="Rider — Rohit Kumar (R-01)" color="#070d14">
              <RiderMobileScreen />
            </PhoneFrame>
          )}
          {activePhone !== 'shelter' && (
            <PhoneFrame label="Shelter — Hope Shelter" color="#07120a">
              <ShelterMobileScreen />
            </PhoneFrame>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-600 text-center max-w-md">
        All mobile views are connected to the same app state engine. Actions taken in the mobile simulator (GPS step, confirm delivery) reflect immediately in the desktop Operations Command view.
      </p>
    </div>
  );
}
