import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  Clock,
  Bike,
  Building2,
  MapPin,
  AlertTriangle,
  RotateCw,
  ShieldCheck,
  Phone,
  QrCode,
  ArrowRight,
  Share2,
} from 'lucide-react';

export default function FlipkartOrderTrackingModal({ deliveryId, isOpen, onClose, onOpenQR }) {
  const { deliveries, stepSimulatedMovement, completeDelivery, fulfillShelterRequirementAndReroute } = useApp();

  if (!isOpen) return null;

  const delivery = deliveries.find(d => d.id === deliveryId) || deliveries[0];
  if (!delivery) return null;

  // Amazon/Flipkart 5-step milestone state
  const isAssigned = ['assigned', 'accepted', 'picked_up', 'in_transit', 'arrived', 'delivered', 'diverted'].includes(delivery.status);
  const isPickedUp = ['picked_up', 'in_transit', 'arrived', 'delivered', 'diverted'].includes(delivery.status);
  const isInTransit = ['in_transit', 'diverted'].includes(delivery.status);
  const isDelivered = delivery.status === 'delivered';
  const isDiverted = delivery.status === 'diverted' || Boolean(delivery.rerouteReason);

  const steps = [
    {
      title: 'Surplus Food Verified & Screened',
      desc: `${delivery.quantity || 40} ${delivery.unit || 'portions'} • Safe Window: ${delivery.safeWindowHours || 1.25}h`,
      done: true,
      time: '12:15 PM',
      icon: ShieldCheck,
    },
    {
      title: 'Courier Assigned & Dispatched',
      desc: `${delivery.riderName || 'Rohit Kumar (Rider R-01)'} • Electric Cargo`,
      done: isAssigned,
      time: '12:22 PM',
      icon: Bike,
    },
    {
      title: 'Picked Up From Donor Kitchen',
      desc: `${delivery.donorName || 'GreenLeaf Banquet'} • Temperature Insulated`,
      done: isPickedUp,
      time: '12:35 PM',
      icon: CheckCircle2,
    },
    {
      title: isDiverted ? 'Rerouted En Route to New Shelter' : 'Out for Delivery (Live Telemetry)',
      desc: isDiverted
        ? `Original Shelter Fulfilled → Auto-redirected to ${delivery.assignedShelterName}`
        : `Heading to ${delivery.assignedShelterName} • ~${delivery.estimatedMinutesRemaining || 12} mins left`,
      done: isDelivered || isInTransit || isDiverted,
      active: (isInTransit || isDiverted) && !isDelivered,
      isAlert: isDiverted,
      time: '12:45 PM',
      icon: isDiverted ? AlertTriangle : Bike,
    },
    {
      title: 'Delivered & Shelter Receipt Confirmed',
      desc: isDelivered
        ? `Successfully delivered to ${delivery.assignedShelterName}`
        : `Awaiting arrival at ${delivery.shelterAddress || 'Destination Shelter'}`,
      done: isDelivered,
      time: isDelivered ? '01:05 PM' : 'Expected 01:10 PM',
      icon: Building2,
    },
  ];

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 to-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded">
                TRACKING ID: {delivery.id}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isDelivered
                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600/60'
                  : isDiverted
                  ? 'bg-amber-950 text-amber-300 border border-amber-600/60 animate-pulse'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
              }`}>
                {isDelivered ? 'DELIVERED' : isDiverted ? 'REROUTED MID-WAY' : 'LIVE IN-TRANSIT'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {delivery.donationItemName || 'Fresh Cooked Meals (Surplus Batch)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mid-Route Reroute Banner if applicable */}
        {isDiverted && (
          <div className="bg-amber-950/90 border-b border-amber-600/50 p-4 text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold uppercase tracking-wider text-amber-300">
                ⚡ Dynamic Mid-Route Auto-Redirection Activated:
              </span>
              <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                {delivery.rerouteReason ||
                  `Original shelter fulfilled demand in transit. System instantly rerouted rider to nearest compatible shelter ${delivery.assignedShelterName} (+1.2 km).`}
              </p>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Estimated Arrival Card */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
                ⏱️
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Arrival</p>
                <p className="text-xl font-bold text-white">
                  {isDelivered ? 'Delivered & Completed' : `Arriving in ~${delivery.estimatedMinutesRemaining || 12} mins`}
                </p>
                <p className="text-xs text-slate-400">
                  Destination: <span className="text-emerald-300 font-medium">{delivery.assignedShelterName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenQR && (
                <button
                  onClick={() => onOpenQR(delivery)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 transition"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  Handoff QR
                </button>
              )}
              {!isDelivered && (
                <button
                  onClick={() => stepSimulatedMovement(delivery.id)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 transition"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Advance GPS Step
                </button>
              )}
            </div>
          </div>

          {/* Flipkart / Amazon Style Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Consignment Journey (Self-Healing Audit Trail)
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
              {steps.map((st, i) => {
                const IconComponent = st.icon;
                return (
                  <div key={i} className="relative flex items-start justify-between gap-4">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        st.done
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50 ring-4 ring-slate-900'
                          : st.active
                          ? 'bg-cyan-500 text-white ring-4 ring-cyan-950 animate-pulse'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 ring-4 ring-slate-900'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    <div className="pl-3 flex-1">
                      <p className={`text-sm font-semibold ${st.done ? 'text-white' : 'text-slate-400'}`}>
                        {st.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{st.desc}</p>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 shrink-0">{st.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Telemetry Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Bike className="w-4 h-4 text-cyan-400" />
                <span>Assigned Courier</span>
              </div>
              <p className="text-white font-bold">{delivery.riderName || 'Rohit Kumar (Rider R-01)'}</p>
              <p className="text-slate-400">{delivery.riderVehicle || 'Electric Cargo Scooter'} • {delivery.riderPhone || '+91 98765 43210'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Destination Shelter</span>
              </div>
              <p className="text-white font-bold">{delivery.assignedShelterName || 'Hope Shelter'}</p>
              <p className="text-slate-400 truncate">{delivery.shelterAddress || 'Santacruz West, Mumbai'}</p>
            </div>
          </div>

          {/* Mid-Route Reroute Test Trigger for Judges */}
          {!isDelivered && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-emerald-300">Judge Demonstration: Mid-Route Reroute</p>
                <p className="text-slate-400 text-[11px]">
                  Simulate destination shelter fulfilling its demand right now while courier is on the road.
                </p>
              </div>
              <button
                onClick={() => fulfillShelterRequirementAndReroute(delivery.assignedShelterId || 'shelter-1')}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shrink-0 shadow-lg shadow-amber-950/50 transition flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Simulate Mid-Route Fulfill
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            GPS: {delivery.currentRiderLocation?.lat?.toFixed(4)}, {delivery.currentRiderLocation?.lng?.toFixed(4)}
          </span>
          <div className="flex items-center gap-2">
            {!isDelivered ? (
              <button
                onClick={() => {
                  completeDelivery(delivery.id);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/50 transition"
              >
                Confirm Verified Delivery
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition"
              >
                Close Tracking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
