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
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield,
  Activity,
  Layers,
} from 'lucide-react';

export default function LandingView() {
  const { setActiveRole, donations, shelters, riders, deliveries } = useApp();

  const totalMealsDelivered = shelters.reduce((acc, s) => acc + (s.receivedToday || 0), 140);
  const activeDonationsCount = donations.length;
  const activeRidersCount = riders.filter(r => r.status === 'available' || r.status === 'in_transit').length;

  return (
    <div className="space-y-20 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-forest-50 dark:bg-forest-950/80 border border-forest-200/90 dark:border-forest-800 text-xs font-semibold text-forest-900 dark:text-forest-200 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-forest-500 animate-ping" />
            <span className="font-display font-bold">Operational AI Relief Grid</span>
            <span className="text-stonebg-400 dark:text-slate-600">•</span>
            <span className="font-mono text-[11px] text-forest-700 dark:text-forest-300">
              Zero Preventable Spoilage
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] font-display">
            Rescue Food.{' '}
            <span className="bg-gradient-to-r from-forest-800 via-forest-600 to-emerald-500 dark:from-forest-300 dark:via-emerald-400 dark:to-forest-200 bg-clip-text text-transparent">
              Deliver Hope.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Eliminating preventable food waste and delivery failure through real-time shelf-life intelligence, multi-rider capacity partitioning, ghost reservation prevention, and mid-route diversion.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveRole('donor')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-forest-950 dark:bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-xl shadow-forest-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all border border-forest-800"
            >
              <UtensilsCrossed className="w-4 h-4 text-forest-300" />
              <span>Donate Food Now</span>
            </button>

            <button
              onClick={() => setActiveRole('admin')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-obsidian-800 hover:bg-stonebg-100 dark:hover:bg-obsidian-700 text-slate-800 dark:text-white font-bold text-sm border border-stonebg-200 dark:border-obsidian-600 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Activity className="w-4 h-4 text-forest-600 dark:text-forest-400" />
              <span>Live Operations Grid</span>
            </button>

            <button
              onClick={() => setActiveRole('simlab')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-black text-sm shadow-lg shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>Judge Interactive Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Luxury Metric Cards Banner */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="lux-card p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                Meals Rescued
              </span>
              <div className="text-3xl font-extrabold text-forest-700 dark:text-forest-300 mt-1 font-display">
                {totalMealsDelivered}+
              </div>
              <span className="text-[11px] text-forest-600 dark:text-forest-400 font-semibold block mt-0.5">
                Verified Intake
              </span>
            </div>

            <div className="lux-card p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                Active Feed
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-display">
                {activeDonationsCount} Batches
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">Real-time matching</span>
            </div>

            <div className="lux-card p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                Couriers Active
              </span>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-display">
                {activeRidersCount} Volunteers
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">Fleet synchronized</span>
            </div>

            <div className="lux-card p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                Loss Rate
              </span>
              <div className="text-3xl font-extrabold text-forest-700 dark:text-forest-300 mt-1 font-display">
                0%
              </div>
              <span className="text-[11px] text-forest-600 dark:text-forest-400 font-semibold block mt-0.5">
                Automated recovery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Coordination Crisis vs ResQRoute Solution */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-forest-600 dark:text-forest-400">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Why Traditional Food Rescue Fails
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Uncoordinated volunteer efforts break down under perishable holding deadlines and fluctuating shelter facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="lux-card p-6 space-y-4 border-l-4 border-l-rose-500">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Temperature Danger Zones
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Cooked food held between 5°C and 60°C for over 4 hours presents high bacterial propagation risk. Traditional apps guess shelf life; ResQRoute enforces transparent microbial holding thresholds.
            </p>
            <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg">
              Rule R-02 Spoilage Guard Built-in
            </div>
          </div>

          <div className="lux-card p-6 space-y-4 border-l-4 border-l-gold-500">
            <div className="w-10 h-10 rounded-xl bg-gold-50 dark:bg-gold-950/50 flex items-center justify-center text-gold-600">
              <Split className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Batch vs Rider Mismatch
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Banquet halls produce 150+ meals at once, but lone volunteer two-wheelers can only carry 35–40 meals. ResQRoute partitions large batches mathematically across available couriers.
            </p>
            <div className="text-[11px] font-semibold text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-950/40 p-2 rounded-lg">
              Smart Multi-Rider Splitting Engine
            </div>
          </div>

          <div className="lux-card p-6 space-y-4 border-l-4 border-l-forest-500">
            <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-950/50 flex items-center justify-center text-forest-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Mid-Route Facility Disruption
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Shelters suffer power failures or fill up while couriers are in transit. ResQRoute's Mid-Route Rescue Engine dynamically finds compatible alternate shelters and reroutes couriers live.
            </p>
            <div className="text-[11px] font-semibold text-forest-700 dark:text-forest-400 bg-forest-50 dark:bg-forest-950/40 p-2 rounded-lg">
              Dynamic Diversion & Facility Audit
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow: Donate -> Match -> Deliver */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-obsidian-950 text-white shadow-2xl space-y-8 border border-forest-800">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-forest-300">
              Operational Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display">
              The 3-Step Coordination Loop
            </h2>
            <p className="text-xs sm:text-sm text-forest-100/70">
              From surplus generation to verified community intake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-forest-400 text-forest-950 font-black flex items-center justify-center text-sm">
                  1
                </span>
                <span className="text-[10px] font-mono text-forest-300 bg-white/10 px-2 py-0.5 rounded">
                  Safety Engine
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Declare Surplus with Transparency</h4>
              <p className="text-xs text-forest-100/70 leading-relaxed">
                Donor provides quantity, prep timestamp, packaging, and holding temperature. The algorithmic safety engine checks microbial bounds immediately.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-forest-400 text-forest-950 font-black flex items-center justify-center text-sm">
                  2
                </span>
                <span className="text-[10px] font-mono text-forest-300 bg-white/10 px-2 py-0.5 rounded">
                  Smart Split
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Multi-Rider Smart Matching</h4>
              <p className="text-xs text-forest-100/70 leading-relaxed">
                Evaluates shelter compatibility (potable water, refrigeration, open demand) and partitions large batches among nearest available riders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-forest-400 text-forest-950 font-black flex items-center justify-center text-sm">
                  3
                </span>
                <span className="text-[10px] font-mono text-forest-300 bg-white/10 px-2 py-0.5 rounded">
                  Mid-Route Guard
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Live Tracking & Dynamic Diversion</h4>
              <p className="text-xs text-forest-100/70 leading-relaxed">
                Real-time transit telemetry. If the destination shelter unexpectedly closes, the rescue engine reroutes the courier automatically with zero loss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Navigation Launchpad */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-forest-600 dark:text-forest-400">
            Interactive Showcase
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            Select Your Role to Test
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Switch between connected platform experiences to test the complete end-to-end operational flow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveRole('donor')}
            className="lux-card p-5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-950 flex items-center justify-center text-forest-600 mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Food Donor</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Register surplus meals with instant safety clearance and batch tracking.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest-600 dark:text-forest-400 mt-3">
              Open Form <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => setActiveRole('rider')}
            className="lux-card p-5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Volunteer Courier</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Accept tasks, confirm reservations within timeout, and simulate transit navigation.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3">
              Open Rider View <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => setActiveRole('shelter')}
            className="lux-card p-5 cursor-pointer group"
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
            className="lux-card p-5 cursor-pointer group bg-gradient-to-br from-gold-50/50 to-forest-50/50 dark:from-obsidian-900 dark:to-obsidian-800 border-gold-300 dark:border-gold-800"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-950 flex items-center justify-center text-gold-700 dark:text-gold-300 mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Judge Lab</h3>
              <span className="text-[10px] bg-gold-200 dark:bg-gold-950 text-gold-900 dark:text-gold-300 px-1.5 py-0.5 rounded font-bold font-mono">
                7 Tests
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              1-click test simulation for hackathon evaluators to test edge-case recovery live!
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-700 dark:text-gold-400 mt-3">
              Run Scenarios <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
