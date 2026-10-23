import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Bike,
  Building2,
  UtensilsCrossed,
  Clock,
  Split,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Navigation,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Activity,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboard() {
  const {
    donations,
    shelters,
    riders,
    deliveries,
    auditLogs,
    executeSplitPlan,
    confirmPickup,
    stepSimulatedMovement,
    completeDelivery,
    triggerShelterEmergencyClose,
    confirmMidRouteDiversion,
    setActiveRole,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDonationForSplit, setSelectedDonationForSplit] = useState(null);
  const [activeSplitResult, setActiveSplitResult] = useState(null);

  // Derived KPIs
  const totalDonations = donations.length;
  const eligibleDonations = donations.filter(d => d.safetyStatus === 'ELIGIBLE').length;
  const reviewRequiredDonations = donations.filter(d => d.safetyStatus === 'REVIEW_REQUIRED').length;
  const activeDeliveries = deliveries.filter(
    d => d.status === 'in_transit' || d.status === 'assigned' || d.status === 'diverted'
  );
  const totalMealsDelivered = shelters.reduce((acc, s) => acc + (s.receivedToday || 0), 0);
  const availableRidersCount = riders.filter(r => r.status === 'available').length;

  // Filtered donations
  const filteredDonations = donations.filter(d => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ELIGIBLE') return d.safetyStatus === 'ELIGIBLE';
    if (statusFilter === 'REVIEW') return d.safetyStatus === 'REVIEW_REQUIRED';
    if (statusFilter === 'READY') return d.status === 'ready_for_matching';
    if (statusFilter === 'IN_TRANSIT') return d.status === 'in_transit';
    return true;
  });

  // Chart data
  const statusData = [
    { name: 'Delivered', value: deliveries.filter(d => d.status === 'delivered').length + 5, color: '#14684b' },
    { name: 'In Transit', value: activeDeliveries.length || 1, color: '#2563eb' },
    { name: 'Queued', value: donations.filter(d => d.status === 'ready_for_matching').length, color: '#d97706' },
    { name: 'Review Req.', value: reviewRequiredDonations, color: '#dc2626' },
  ];

  const shelterCapacityData = shelters.map(s => ({
    name: s.name.split(' ')[0],
    occupancy: s.currentOccupancy,
    openDemand: s.openDemand,
  }));

  const handleRunSplit = donation => {
    setSelectedDonationForSplit(donation);
    const result = executeSplitPlan(donation.id);
    setActiveSplitResult(result);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Central Operations Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
              Live Dispatch Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time multi-rider coordination, safety eligibility enforcement, and mid-route disruption monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveRole('simlab')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 text-xs font-extrabold transition shadow-md shadow-gold-500/20"
          >
            <Split className="w-4 h-4" />
            <span>Launch Hackathon Lab</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="lux-card p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
            Total Batches
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display">
            {totalDonations}
          </div>
          <span className="text-[10px] text-forest-600 dark:text-forest-400 font-bold block mt-0.5">
            {eligibleDonations} AI Eligible
          </span>
        </div>

        <div className="lux-card p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
            In Transit
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-display">
            {activeDeliveries.length}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Active legs</span>
        </div>

        <div className="lux-card p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
            Meals Rescued
          </span>
          <div className="text-2xl font-black text-forest-700 dark:text-forest-300 mt-1 font-display">
            {totalMealsDelivered}
          </div>
          <span className="text-[10px] text-forest-600 font-bold block mt-0.5">0% Spoilage</span>
        </div>

        <div className="lux-card p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
            Review Req.
          </span>
          <div className="text-2xl font-black text-gold-600 dark:text-gold-400 mt-1 font-display">
            {reviewRequiredDonations}
          </div>
          <span className="text-[10px] text-gold-600 font-bold block mt-0.5">Missing meta</span>
        </div>

        <div className="lux-card p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
            Riders Ready
          </span>
          <div className="text-2xl font-black text-forest-700 dark:text-forest-300 mt-1 font-display">
            {availableRidersCount}/{riders.length}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Available</span>
        </div>

        <div className="lux-card p-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
            Open Demand
          </span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-display">
            {shelters.reduce((acc, s) => acc + (s.openDemand || 0), 0)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Across 5 shelters</span>
        </div>
      </div>

      {/* Main Map & Live Transit Tracking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map - 2 cols on desktop */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-forest-600 dark:text-forest-400" />
              <span>Real-Time Geospatial Relief Map</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">OpenStreetMap Live Engine</span>
          </div>

          <InteractiveMap height="460px" />
        </div>

        {/* Live Active Deliveries Feed - 1 col */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>In-Transit Deliveries</span>
            </h2>
            <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {activeDeliveries.length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {activeDeliveries.length === 0 ? (
              <div className="lux-card p-8 text-center text-slate-400">
                <Bike className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No deliveries currently in transit.</p>
              </div>
            ) : (
              activeDeliveries.map(del => (
                <div
                  key={del.id}
                  className="lux-card p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{del.id}</span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                        {del.donationItemName}
                      </h4>
                      <p className="text-[11px] text-slate-500">{del.quantity} {del.unit}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        del.status === 'diverted'
                          ? 'bg-gold-100 text-gold-900 dark:bg-gold-950 dark:text-gold-300'
                          : 'bg-forest-100 text-forest-900 dark:bg-forest-950 dark:text-forest-300'
                      }`}
                    >
                      {del.status === 'diverted' ? 'DIVERTED REROUTE' : 'EN ROUTE'}
                    </span>
                  </div>

                  {/* Rider & Shelter Details */}
                  <div className="bg-stonebg-50 dark:bg-obsidian-900/60 p-2.5 rounded-xl border border-stonebg-200 dark:border-obsidian-700/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Courier:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{del.riderName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Destination:</span>
                      <span className="font-semibold text-forest-700 dark:text-forest-400">
                        {del.assignedShelterName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">ETA:</span>
                      <span className="font-bold text-blue-600">~{del.estimatedMinutesRemaining} mins</span>
                    </div>
                  </div>

                  {/* Quick Simulated Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => stepSimulatedMovement(del.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-bold transition border border-blue-200 dark:border-blue-800"
                    >
                      Simulate Step +35%
                    </button>
                    <button
                      onClick={() => completeDelivery(del.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-[11px] font-bold transition shadow-sm"
                    >
                      Confirm Delivery
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Analytics Charts & Shelter Capacity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Status Distribution */}
        <div className="lux-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Pipeline Status Distribution
            </h3>
            <PieChartIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {item.name}: <span className="font-bold">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shelter Open Demand vs Occupancy Bar Chart */}
        <div className="lg:col-span-2 lux-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Shelter Occupancy vs Open Demand Balance
            </h3>
            <Building2 className="w-4 h-4 text-forest-600 dark:text-forest-400" />
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shelterCapacityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Bar dataKey="occupancy" fill="#64748b" name="Current Residents" radius={[4, 4, 0, 0]} />
                <Bar dataKey="openDemand" fill="#14684b" name="Open Meal Demand" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Slate: Resident Occupancy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-forest-700" /> Forest: Open Meal Request
            </span>
          </div>
        </div>
      </div>

      {/* Donation Operations Table with Filters */}
      <div className="lux-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Food Surplus Batches & Allocation Controls
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate safety eligibility, partition oversized donations, and assign couriers.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'ELIGIBLE', 'REVIEW', 'READY'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  statusFilter === f
                    ? 'bg-forest-950 dark:bg-forest-800 text-white shadow-sm'
                    : 'bg-stonebg-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300 hover:bg-stonebg-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stonebg-100 dark:bg-obsidian-900/60 text-slate-500 dark:text-slate-400 font-semibold border-y border-stonebg-200 dark:border-obsidian-700">
              <tr>
                <th className="py-2.5 px-3">Batch ID & Food</th>
                <th className="py-2.5 px-3">Donor Facility</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Safety Status</th>
                <th className="py-2.5 px-3">Window</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stonebg-100 dark:divide-obsidian-700/60 text-slate-700 dark:text-slate-300">
              {filteredDonations.map(don => (
                <tr key={don.id} className="hover:bg-stonebg-50 dark:hover:bg-obsidian-800/40 transition">
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] text-slate-400 block font-bold">{don.id}</span>
                    <span className="font-bold text-slate-900 dark:text-white block">{don.itemName}</span>
                    <span className="text-[10px] text-slate-500">{don.category}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium block">{don.donorName}</span>
                    <span className="text-[10px] text-slate-400 block">{don.location?.address}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-black text-sm text-slate-900 dark:text-white font-display">
                      {don.quantity}
                    </span>{' '}
                    <span className="text-slate-500">{don.unit}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        don.safetyStatus === 'ELIGIBLE'
                          ? 'bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300'
                          : don.safetyStatus === 'REVIEW_REQUIRED'
                          ? 'bg-gold-100 text-gold-800 dark:bg-gold-950 dark:text-gold-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {don.safetyStatus === 'ELIGIBLE' ? (
                        <CheckCircle2 className="w-3 h-3 text-forest-600 dark:text-forest-400" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-gold-600" />
                      )}
                      {don.safetyStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[160px]" title={don.safetyRule}>
                      {don.safetyRule}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {don.safeWindowHours > 0 ? `~${don.safeWindowHours} hrs` : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {don.quantity > 50 && don.safetyStatus === 'ELIGIBLE' ? (
                      <button
                        onClick={() => handleRunSplit(don)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gold-50 dark:bg-gold-950/60 hover:bg-gold-100 text-gold-800 dark:text-gold-300 font-bold text-[11px] border border-gold-300 dark:border-gold-800 transition shadow-sm"
                      >
                        <Split className="w-3 h-3" />
                        <span>Run Multi-Split</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {don.status === 'in_transit' ? 'En route' : 'Standard batch'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Rider Split Modal Preview */}
      {selectedDonationForSplit && activeSplitResult && (
        <div className="lux-card p-5 bg-gold-50/60 dark:bg-gold-950/30 border-gold-300 dark:border-gold-800 shadow-md space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Split className="w-5 h-5 text-gold-600" />
              <h3 className="font-bold text-sm text-gold-950 dark:text-gold-200">
                Multi-Rider Smart Partitioning Plan Generated
              </h3>
            </div>
            <button
              onClick={() => setSelectedDonationForSplit(null)}
              className="text-xs text-gold-800 dark:text-gold-300 hover:underline font-semibold"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-gold-900 dark:text-gold-300">
            {activeSplitResult.explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {activeSplitResult.plan.map(p => (
              <div
                key={p.riderId}
                className="lux-card p-3 text-xs space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{p.riderName}</span>
                  <span className="text-[10px] text-forest-600 font-bold">{p.reliabilityScore}% Rel</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Assigned Load:</span>
                  <span className="font-extrabold text-gold-600">{p.allocatedQuantity} meals</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-gold-500 h-full rounded-full"
                    style={{ width: `${p.percentageOfRiderCapacity}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-right">
                  {p.percentageOfRiderCapacity}% of vehicle limit
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
