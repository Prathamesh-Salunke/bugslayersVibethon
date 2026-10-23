import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import FlipkartOrderTrackingModal from '../components/FlipkartOrderTrackingModal';
import RescuePlansModal from '../components/RescuePlansModal';
import QRCodeModal from '../components/QRCodeModal';
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
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Navigation,
  ArrowUpRight,
  Activity,
  Layers,
  Eye,
  QrCode,
  Play,
  Package,
  Zap,
  ChevronDown,
  TrendingDown,
  RefreshCw,
  Download,
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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { exportAuditLogCSV } from '../utils/csvExport';

const STATUS_COLORS = {
  in_transit: '#06b6d4',
  diverted: '#f59e0b',
  delivered: '#10b981',
  assigned: '#3b82f6',
  planned: '#8b5cf6',
  failed: '#ef4444',
  ready_for_matching: '#6b7280',
};

function KpiCard({ label, value, sub, color = 'emerald', icon: Icon, pulse }) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/40',
    cyan: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/40',
    amber: 'text-amber-400 bg-amber-950/60 border-amber-700/40',
    rose: 'text-rose-400 bg-rose-950/60 border-rose-700/40',
    blue: 'text-blue-400 bg-blue-950/60 border-blue-700/40',
    purple: 'text-purple-400 bg-purple-950/60 border-purple-700/40',
  };
  const cls = colorMap[color] || colorMap.emerald;
  return (
    <div className={`rounded-2xl p-4 border ${cls} bg-[#0c221a]/80 backdrop-blur flex flex-col gap-2 relative overflow-hidden`}>
      {pulse && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
      )}
      {Icon && (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cls} border`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{label}</span>
      <span className={`text-3xl font-black font-mono tracking-tight leading-none ${cls.split(' ')[0]}`}>{value}</span>
      {sub && <span className="text-[11px] text-slate-400 font-medium">{sub}</span>}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    in_transit: 'bg-cyan-950 text-cyan-300 border-cyan-700/50',
    diverted: 'bg-amber-950 text-amber-300 border-amber-700/50 animate-pulse',
    delivered: 'bg-emerald-950 text-emerald-300 border-emerald-700/50',
    assigned: 'bg-blue-950 text-blue-300 border-blue-700/50',
    planned: 'bg-purple-950 text-purple-300 border-purple-700/50',
    failed: 'bg-rose-950 text-rose-300 border-rose-700/50',
    ready_for_matching: 'bg-slate-800 text-slate-300 border-slate-600/50',
    ELIGIBLE_FOR_MATCHING: 'bg-emerald-950 text-emerald-300 border-emerald-700/50',
    REVIEW_REQUIRED: 'bg-amber-950 text-amber-300 border-amber-700/50',
    INELIGIBLE: 'bg-rose-950 text-rose-300 border-rose-700/50',
  };
  const cls = cfg[status] || 'bg-slate-800 text-slate-300 border-slate-600/50';
  return (
    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${cls} uppercase tracking-wider`}>
      {status?.replace(/_/g, ' ') || 'UNKNOWN'}
    </span>
  );
}

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
    fulfillShelterRequirementAndReroute,
    setActiveRole,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [catFilter, setCatFilter] = useState('ALL');
  const [trackingModal, setTrackingModal] = useState({ open: false, deliveryId: null });
  const [plansModal, setPlansModal] = useState({ open: false, donation: null });
  const [qrModal, setQrModal] = useState({ open: false, data: null });
  const [activityExpanded, setActivityExpanded] = useState(false);

  // KPIs
  const totalDonations = donations.length;
  const eligibleDonations = donations.filter(d => d.safetyStatus === 'ELIGIBLE_FOR_MATCHING').length;
  const reviewRequired = donations.filter(d => d.safetyStatus === 'REVIEW_REQUIRED').length;
  const activeDeliveries = deliveries.filter(
    d => d.status === 'in_transit' || d.status === 'assigned' || d.status === 'diverted'
  );
  const totalMealsDelivered = shelters.reduce((acc, s) => acc + (s.receivedToday || 0), 0);
  const availableRidersCount = riders.filter(r => r.status === 'available').length;
  const divertedDeliveries = deliveries.filter(d => d.status === 'diverted').length;
  const totalOpenDemand = shelters.reduce((acc, s) => acc + (s.openDemand || 0), 0);

  // Category filter options
  const categories = ['ALL', ...new Set(donations.map(d => d.category))];

  const filteredDonations = donations.filter(d => {
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ELIGIBLE' && d.safetyStatus === 'ELIGIBLE_FOR_MATCHING') ||
      (statusFilter === 'REVIEW' && d.safetyStatus === 'REVIEW_REQUIRED') ||
      (statusFilter === 'TRANSIT' && d.status === 'in_transit') ||
      (statusFilter === 'READY' && d.status === 'ready_for_matching');
    const matchCat = catFilter === 'ALL' || d.category === catFilter;
    return matchStatus && matchCat;
  });

  // Chart data
  const deliveryStatusChart = [
    { name: 'Delivered', value: deliveries.filter(d => d.status === 'delivered').length + 5, fill: '#10b981' },
    { name: 'In Transit', value: activeDeliveries.length || 1, fill: '#06b6d4' },
    { name: 'Queued', value: donations.filter(d => d.status === 'ready_for_matching').length, fill: '#f59e0b' },
    { name: 'Review', value: reviewRequired, fill: '#ef4444' },
  ];

  const shelterDemandChart = shelters.map(s => ({
    name: s.name.split(' ')[0],
    demand: s.openDemand,
    received: s.receivedToday,
  }));

  const timelineData = [
    { time: '12:00', meals: 0, deliveries: 0 },
    { time: '12:15', meals: 20, deliveries: 1 },
    { time: '12:30', meals: 35, deliveries: 1 },
    { time: '12:45', meals: 40, deliveries: 2 },
    { time: '13:00', meals: totalMealsDelivered, deliveries: activeDeliveries.length + 2 },
  ];

  const recentActivity = auditLogs.slice(0, activityExpanded ? 15 : 6);

  const activitySeverityColor = {
    INFO: 'text-slate-400',
    SUCCESS: 'text-emerald-400',
    WARNING: 'text-amber-400',
    ERROR: 'text-rose-400',
    ALERT: 'text-red-400',
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-white">Central Operations Command</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 animate-pulse">
              ● LIVE DISPATCH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-rider coordination, safety enforcement, and mid-route disruption monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportAuditLogCSV(auditLogs)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export CSV
          </button>
          <button
            onClick={() => setActiveRole('simlab')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-extrabold border border-amber-500/30 transition shadow-lg shadow-amber-950/30"
          >
            <Zap className="w-4 h-4" />
            Judge Lab
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Total Batches" value={totalDonations} sub={`${eligibleDonations} AI Eligible`} color="emerald" icon={Package} />
        <KpiCard label="In Transit" value={activeDeliveries.length} sub="Active legs" color="cyan" icon={Navigation} pulse={activeDeliveries.length > 0} />
        <KpiCard label="Meals Rescued" value={totalMealsDelivered} sub="0% Spoilage today" color="emerald" icon={CheckCircle2} />
        <KpiCard label="Review Required" value={reviewRequired} sub="Missing metadata" color="amber" icon={AlertCircle} pulse={reviewRequired > 0} />
        <KpiCard label="Riders Ready" value={`${availableRidersCount}/${riders.length}`} sub="Fleet available" color="blue" icon={Bike} />
        <KpiCard label="Open Demand" value={totalOpenDemand} sub="Across all shelters" color="purple" icon={Building2} />
      </div>

      {/* Main Grid: Map + Activity + Shelters */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Dark Live Map — 2 col span */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl overflow-hidden border border-emerald-900/50 shadow-2xl">
            <div className="px-4 py-3 bg-[#0c221a]/90 border-b border-emerald-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Live Operations Map</span>
                <span className="text-[10px] text-slate-500">CartoDB Dark Matter • OpenStreetMap</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600">Mumbai Metro Grid α</span>
            </div>
            <InteractiveMap height="420px" showControls={true} defaultDark={true} />
          </div>
        </div>

        {/* Right Column: Activity Feed + Shelter Widget */}
        <div className="space-y-4">
          {/* Real-Time Activity Feed */}
          <div className="rounded-2xl border border-emerald-900/50 bg-[#0c221a]/80 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">System Activity Feed</span>
              </div>
              <button
                onClick={() => setActivityExpanded(e => !e)}
                className="text-[10px] text-slate-500 hover:text-emerald-400 flex items-center gap-1 transition"
              >
                {activityExpanded ? 'Collapse' : 'Expand'}
                <ChevronDown className={`w-3 h-3 transition ${activityExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className="space-y-2 overflow-hidden">
              {recentActivity.map((log, idx) => (
                <div key={log.id || idx} className="flex gap-2 items-start text-[11px] group">
                  <span className={`font-bold font-mono shrink-0 ${activitySeverityColor[log.severity] || 'text-slate-500'}`}>
                    {log.actionType?.slice(0, 3) || 'LOG'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 truncate font-medium">{log.description}</p>
                    <p className="text-slate-600 text-[10px]">{log.actor} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shelters & Demand */}
          <div className="rounded-2xl border border-emerald-900/50 bg-[#0c221a]/80 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Shelters & Live Demand</span>
            </div>
            <div className="space-y-2">
              {shelters.map(s => {
                const pct = Math.min(100, Math.round((s.currentOccupancy / s.capacity) * 100));
                const isUrgent = s.openDemand >= 40;
                const isClosed = s.status !== 'open';
                return (
                  <div key={s.id} className={`p-3 rounded-xl border ${isClosed ? 'border-rose-700/30 bg-rose-950/20' : isUrgent ? 'border-amber-700/30 bg-amber-950/10' : 'border-slate-800/80 bg-slate-900/30'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-[11px] font-bold truncate ${isClosed ? 'text-rose-300' : 'text-white'}`}>{s.name}</p>
                      {isUrgent && !isClosed && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-700/40 rounded-full shrink-0 animate-pulse">
                          URGENT
                        </span>
                      )}
                      {isClosed && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-700/40 rounded-full shrink-0">
                          CLOSED
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct > 85 ? 'bg-rose-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{pct}%</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-500">Needs: <span className={`font-bold ${isUrgent ? 'text-amber-300' : 'text-slate-300'}`}>{s.openDemand} portions</span></span>
                      {!isClosed && (
                        <button
                          onClick={() => fulfillShelterRequirementAndReroute(s.id)}
                          className="text-[9px] text-slate-500 hover:text-amber-300 transition"
                        >
                          Fulfill →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Pie: Delivery Status Distribution */}
        <div className="rounded-2xl border border-emerald-900/50 bg-[#0c221a]/80 p-4">
          <p className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Delivery Status Distribution
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={deliveryStatusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                {deliveryStatusChart.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{ background: '#0f2a1f', border: '1px solid #16a34a40', borderRadius: '8px', color: '#d1fae5', fontSize: '11px' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar: Shelter Demand vs Received */}
        <div className="rounded-2xl border border-emerald-900/50 bg-[#0c221a]/80 p-4">
          <p className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Shelter Demand vs Received
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={shelterDemandChart} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a2f40" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={{ background: '#0f2a1f', border: '1px solid #16a34a40', borderRadius: '8px', color: '#d1fae5', fontSize: '11px' }} />
              <Bar dataKey="demand" name="Open Demand" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="received" name="Received Today" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line: Meals Rescued Over Time */}
        <div className="rounded-2xl border border-emerald-900/50 bg-[#0c221a]/80 p-4">
          <p className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Meals Rescued (This Session)
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a2f40" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={{ background: '#0f2a1f', border: '1px solid #16a34a40', borderRadius: '8px', color: '#d1fae5', fontSize: '11px' }} />
              <Line type="monotone" dataKey="meals" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donations Management Table */}
      <div className="rounded-2xl border border-emerald-900/50 bg-[#0c221a]/80 overflow-hidden">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-emerald-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Donations Management</span>
            <span className="text-xs font-mono text-slate-500">({filteredDonations.length} records)</span>
          </div>

          {/* Category pill filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                  catFilter === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'text-slate-500 border-slate-700/50 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            {['ALL', 'ELIGIBLE', 'REVIEW', 'TRANSIT', 'READY'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`text-[10px] font-mono font-bold px-2 py-1 rounded border transition ${
                  statusFilter === f
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700/50'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-900/30">
                {['ID', 'Donor', 'Item / Category', 'Qty', 'Safety', 'Status', 'Deadline', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/20">
              {filteredDonations.map(don => {
                const hoursLeft = don.safeWindowHours || 0;
                const isUrgent = hoursLeft < 1;
                const linkedDelivery = deliveries.find(d => d.donationId === don.id);
                return (
                  <tr
                    key={don.id}
                    className={`hover:bg-emerald-950/20 transition group ${isUrgent ? 'bg-red-950/10' : ''}`}
                  >
                    <td className="px-4 py-3 font-mono text-emerald-400 text-[11px] font-bold whitespace-nowrap">
                      {don.id}
                    </td>
                    <td className="px-4 py-3 text-slate-200 max-w-[140px] truncate">{don.donorName}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200 truncate max-w-[180px]">{don.itemName}</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border mt-0.5 inline-block ${
                        don.category === 'Cooked Meals' ? 'bg-orange-950/80 text-orange-300 border-orange-700/30' :
                        don.category === 'Medical Supplies' ? 'bg-blue-950/80 text-blue-300 border-blue-700/30' :
                        don.category === 'Ration Kits' ? 'bg-purple-950/80 text-purple-300 border-purple-700/30' :
                        'bg-emerald-950/80 text-emerald-300 border-emerald-700/30'
                      }`}>
                        {don.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-white font-bold whitespace-nowrap">
                      {don.quantity} {don.unit}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={don.safetyStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={don.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`font-mono font-bold ${isUrgent ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                        {hoursLeft < 1
                          ? `${Math.round(hoursLeft * 60)}m`
                          : `${hoursLeft.toFixed(1)}h`}
                      </span>
                      {isUrgent && <AlertTriangle className="w-3 h-3 text-red-400 inline ml-1 animate-pulse" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                        {/* View Rescue Plans */}
                        <button
                          onClick={() => setPlansModal({ open: true, donation: don })}
                          className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-700/40 transition"
                          title="View Rescue Plans A/B/C"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        {/* Track if delivery exists */}
                        {linkedDelivery && (
                          <button
                            onClick={() => setTrackingModal({ open: true, deliveryId: linkedDelivery.id })}
                            className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 hover:bg-cyan-900 border border-cyan-700/40 transition"
                            title="Track Delivery"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {/* QR */}
                        {linkedDelivery && (
                          <button
                            onClick={() => setQrModal({ open: true, data: linkedDelivery })}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700/40 transition"
                            title="Handoff QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {/* Advance simulation */}
                        {linkedDelivery && linkedDelivery.status !== 'delivered' && (
                          <button
                            onClick={() => stepSimulatedMovement(linkedDelivery.id)}
                            className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 hover:bg-amber-900 border border-amber-700/40 transition"
                            title="Advance GPS Step"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDonations.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              No records match the current filter.
            </div>
          )}
        </div>
      </div>

      {/* Riders Fleet Panel */}
      <div className="rounded-2xl border border-emerald-900/50 bg-[#0c221a]/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-emerald-900/30 flex items-center gap-2">
          <Bike className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-white">Rider Fleet & Reliability</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-emerald-900/30">
          {riders.map(rider => {
            const statusCfg = {
              available: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/30',
              in_transit: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/30',
              reserved: 'text-amber-400 bg-amber-950/60 border-amber-700/30',
              offline: 'text-slate-500 bg-slate-900 border-slate-700/30',
            };
            const cls = statusCfg[rider.status] || statusCfg.offline;
            return (
              <div key={rider.id} className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border ${cls}`}>
                    🚴
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{rider.name.split('(')[0].trim()}</p>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${cls}`}>
                      {rider.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-[10px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Reliability</span>
                    <span className="font-bold text-emerald-400">{rider.reliability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity</span>
                    <span className="font-bold text-white">{rider.capacity} portions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trips Done</span>
                    <span className="font-bold text-white">{rider.completedDeliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating</span>
                    <span className="font-bold text-amber-400">★ {rider.rating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Deliveries — Live Tracking Cards */}
      {activeDeliveries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400 animate-bounce" />
            Active In-Transit Deliveries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {activeDeliveries.map(del => (
              <div
                key={del.id}
                className={`rounded-2xl border p-4 space-y-3 cursor-pointer hover:border-cyan-700/60 transition-all ${
                  del.status === 'diverted'
                    ? 'border-amber-700/50 bg-amber-950/10'
                    : 'border-cyan-700/40 bg-[#0a1f18]'
                }`}
                onClick={() => setTrackingModal({ open: true, deliveryId: del.id })}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 text-xs font-bold">{del.id}</span>
                  <StatusBadge status={del.status} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white truncate">{del.donationItemName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {del.quantity} {del.unit} → {del.assignedShelterName}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{del.riderName?.split('(')[0].trim()}</span>
                    <span className="text-cyan-300 font-bold">~{del.estimatedMinutesRemaining}m left</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${del.status === 'diverted' ? 'bg-amber-400' : 'bg-cyan-400'}`}
                      style={{
                        width: `${Math.max(10, Math.min(95, 100 - (del.estimatedMinutesRemaining / del.deliveryDeadlineMinutes) * 100))}%`
                      }}
                    />
                  </div>
                </div>
                {del.rerouteReason && (
                  <p className="text-[10px] text-amber-300 bg-amber-950/50 rounded-lg px-2 py-1.5 border border-amber-700/30 flex items-start gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                    {del.rerouteReason.slice(0, 80)}…
                  </p>
                )}
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Click to open full tracking panel
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <FlipkartOrderTrackingModal
        isOpen={trackingModal.open}
        deliveryId={trackingModal.deliveryId}
        onClose={() => setTrackingModal({ open: false, deliveryId: null })}
        onOpenQR={data => setQrModal({ open: true, data })}
      />
      <RescuePlansModal
        isOpen={plansModal.open}
        donation={plansModal.donation}
        onClose={() => setPlansModal({ open: false, donation: null })}
      />
      <QRCodeModal
        isOpen={qrModal.open}
        data={qrModal.data}
        onClose={() => setQrModal({ open: false, data: null })}
      />
    </div>
  );
}
