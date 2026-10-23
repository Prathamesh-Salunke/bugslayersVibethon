import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Zap,
  Split,
  Compass,
  AlertTriangle,
  Award,
  Users,
  UtensilsCrossed,
  CheckCircle,
} from 'lucide-react';

export default function LandingView() {
  const { setActiveRole, donations, shelters, riders, deliveries } = useApp();

  const totalMealsDelivered = shelters.reduce((acc, s) => acc + (s.receivedToday || 0), 140);
  const activeDonationsCount = donations.length;
  const activeRidersCount = riders.filter(r => r.status === 'available' || r.status === 'in_transit').length;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>AI-Driven Last-Mile Food Rescue Grid</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-[11px]">Zero Preventable Spoilage</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Rescue Food.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-forest-600 to-emerald-500 bg-clip-text text-transparent">
              Deliver Hope.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminating preventable food waste and delivery failure through real-time shelf-life intelligence, multi-rider capacity partitioning, ghost reservation prevention, and mid-route diversion.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveRole('donor')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-lg shadow-forest-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
              <span>Donate Food Now</span>
            </button>

            <button
              onClick={() => setActiveRole('admin')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-warm-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-warm-200 dark:border-slate-700 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Live Operations Grid</span>
            </button>

            <button
              onClick={() => setActiveRole('simlab')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>Judge Interactive Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Demo Metric Cards Banner */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-400 block font-medium">Meals Rescued</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalMealsDelivered}+
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Demo metrics tracked</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-400 block font-medium">Active Batch Feed</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest-900 dark:text-forest-200 mt-1">
                {activeDonationsCount} Batches
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Live donor registry</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-400 block font-medium">Riders Deployed</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {activeRidersCount} Active
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Volunteers & cargo</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-400 block font-medium">Preventable Loss</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                0%
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Automated recovery</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Food Wastage vs Last-Mile Coordination Crisis */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Why Traditional Food Donation Fails
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Good intentions are not enough. Last-mile aid logistics fail silently due to unmanaged real-world friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-300">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-rose-950 dark:text-rose-200">
              Spoilage Before Arrival
            </h3>
            <p className="text-xs text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
              Cooked buffet meals linger in temperature danger zones (5°C - 60°C). Without rapid algorithmic shelf-life evaluation, food expires in transit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
              <Split className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-amber-950 dark:text-amber-200">
              Oversized Batches vs Lone Riders
            </h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
              A 180-meal banquet excess exceeds a two-wheeler rider’s 40-meal capacity. ResQRoute automatically calculates smart multi-rider capacity splits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-blue-950 dark:text-blue-200">
              Ghost Volunteer Timeouts & Facility Mismatch
            </h3>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
              Unresponsive volunteers leave donations stranded. Meanwhile, sending chilled dairy to shelters lacking refrigeration leads to wasted aid.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow: Donate -> Match -> Deliver */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-emerald-950 text-white shadow-xl space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-300">
              Engine Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The 3-Step ResQ Workflow
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              From food surplus registration to verified recipient distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-emerald-400 text-forest-950 font-black flex items-center justify-center text-sm">
                  1
                </span>
                <span className="text-[11px] font-mono text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                  Safety Engine
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Smart Food Declaration</h4>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Donor submits quantity, prep timestamp, packaging, and storage history. The system immediately checks microbial holding rules without fake guesses.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-emerald-400 text-forest-950 font-black flex items-center justify-center text-sm">
                  2
                </span>
                <span className="text-[11px] font-mono text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                  Multi-Constraint
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Smart Match & Capacity Split</h4>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Matches with compatible shelters (clean water, refrigeration, open demand) and partitions large batches among nearest available riders.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-emerald-400 text-forest-950 font-black flex items-center justify-center text-sm">
                  3
                </span>
                <span className="text-[11px] font-mono text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                  Mid-Route Guard
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Track & Mid-Route Diversion</h4>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Real-time transit tracking. If a destination shelter suddenly loses power or closes, the Mid-Route Rescue Engine reroutes the rider instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Navigation Quick Launchers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Choose Your Role
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Switch between connected platform experiences to test the end-to-end operational flow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveRole('donor')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Food Donor</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Register surplus meals with instant safety clearance and batch tracking.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-3">
              Open Form <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => setActiveRole('rider')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 hover:border-blue-500 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Volunteer Rider</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Accept tasks, confirm reservations within timeout, and simulate transit navigation.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3">
              Open Rider View <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => setActiveRole('shelter')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 hover:border-indigo-500 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Shelter Intake</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Manage capacity, facility compliance, SOS demand boosts, and delivery receipts.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-3">
              Open Shelter View <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => setActiveRole('simlab')}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 border border-amber-300 dark:border-amber-600/40 hover:border-amber-500 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-300 mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Judge Lab</h3>
              <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded font-bold">
                7 Tests
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              1-click test simulation for hackathon evaluators to test edge-case recovery live!
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-3">
              Run Scenarios <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
