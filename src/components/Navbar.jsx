import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  LayoutDashboard,
  HeartHandshake,
  Bike,
  Building2,
  FileClock,
  FlaskConical,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  RotateCcw,
  Compass,
  Menu,
  X,
  Sparkles,
  Zap,
  Split,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

export default function Navbar() {
  const {
    activeRole,
    setActiveRole,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    isDemoMode,
    requestBrowserLocation,
    resetToInitialData,
    deliveries,
    donations,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featureMenuOpen, setFeatureMenuOpen] = useState(false);

  const activeDeliveriesCount = deliveries.filter(
    d => d.status === 'in_transit' || d.status === 'assigned' || d.status === 'diverted'
  ).length;

  const roles = [
    { id: 'landing', label: 'Overview', icon: HeartHandshake },
    { id: 'admin', label: 'Operations Grid', icon: LayoutDashboard },
    { id: 'donor', label: 'Donor Hub', icon: Sparkles },
    { id: 'rider', label: 'Volunteer Courier', icon: Bike },
    { id: 'shelter', label: 'Shelter Intake', icon: Building2 },
    { id: 'history', label: 'Audit Trail', icon: FileClock },
    {
      id: 'simlab',
      label: 'Judge Lab',
      icon: FlaskConical,
      isSpecial: true,
    },
  ];

  const innovations = [
    { num: '01', title: 'Shelf-Life Safety Engine', role: 'donor', desc: 'Microbial holding rules & ambient danger checks' },
    { num: '02', title: 'Multi-Rider Smart Splitting', role: 'admin', desc: 'Dynamic load partitioning across rider fleet' },
    { num: '03', title: 'Ghost Reservation Guard', role: 'rider', desc: '60s countdown timer & automatic backup reallocation' },
    { num: '04', title: 'Mid-Route Disruption Diversion', role: 'simlab', desc: 'In-transit emergency shelter rerouting' },
    { num: '05', title: 'Destination Compatibility', role: 'shelter', desc: 'Potable water, cold storage & dietary enforcement' },
    { num: '06', title: 'Explainable Matching Matrix', role: 'admin', desc: 'Multi-criteria scoring with transparent rationale' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stonebg-200/80 dark:border-obsidian-700/80 bg-stonebg-50/90 dark:bg-obsidian-950/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            onClick={() => setActiveRole('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-900 via-forest-700 to-forest-500 p-0.5 shadow-md shadow-forest-900/15 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-forest-950 rounded-[14px] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-forest-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-forest-950 dark:text-forest-200 font-display">
                  ResQ<span className="text-forest-600 dark:text-forest-400">Route</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-forest-100 text-forest-900 dark:bg-forest-950 dark:text-forest-300 border border-forest-200/60 dark:border-forest-800">
                  v2.0 PRO
                </span>
              </div>
              <p className="text-[11px] text-stonebg-500 dark:text-slate-400 -mt-0.5 font-medium tracking-tight">
                Rescue Food. Deliver Hope.
              </p>
            </div>
          </div>

          {/* Role Navigation Buttons (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 bg-stonebg-100/80 dark:bg-obsidian-900/90 p-1.5 rounded-2xl border border-stonebg-200/90 dark:border-obsidian-700/80 shadow-sm">
            {roles.map(r => {
              const Icon = r.icon;
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? r.isSpecial
                        ? 'bg-gradient-to-r from-gold-500 to-forest-700 text-white shadow-md'
                        : 'bg-white dark:bg-obsidian-800 text-forest-950 dark:text-forest-200 shadow-sm border border-stonebg-200 dark:border-obsidian-600'
                      : r.isSpecial
                      ? 'text-gold-700 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-forest-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-obsidian-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? '' : 'opacity-70'}`} />
                  {r.label}
                  {r.isSpecial && (
                    <span className="ml-0.5 text-[9px] bg-slate-900/40 px-1 py-0.2 rounded font-mono font-black text-amber-200">
                      7 TESTS
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Controls & Status Bar */}
          <div className="flex items-center gap-2">
            {/* Feature Navigator Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setFeatureMenuOpen(!featureMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-obsidian-900 border border-stonebg-200 dark:border-obsidian-700 text-slate-700 dark:text-slate-200 hover:border-forest-400 transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
                <span>Feature Hub</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {featureMenuOpen && (
                <div
                  onMouseLeave={() => setFeatureMenuOpen(false)}
                  className="absolute right-0 mt-2 w-80 p-3 rounded-2xl bg-white dark:bg-obsidian-900 border border-stonebg-200 dark:border-obsidian-700 shadow-2xl z-50 animate-slide-up space-y-1.5 text-left"
                >
                  <div className="flex items-center justify-between px-2 pb-2 border-b border-stonebg-200 dark:border-obsidian-700">
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400">
                      Core Innovations Directory
                    </span>
                    <span className="text-[10px] bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 px-1.5 py-0.2 rounded font-bold">
                      6 Modules
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {innovations.map(inv => (
                      <div
                        key={inv.num}
                        onClick={() => {
                          setActiveRole(inv.role);
                          setFeatureMenuOpen(false);
                        }}
                        className="p-2 rounded-xl hover:bg-stonebg-100 dark:hover:bg-obsidian-800 cursor-pointer transition flex items-start gap-2.5"
                      >
                        <span className="font-mono text-[10px] font-bold text-forest-600 bg-forest-50 dark:bg-forest-950 px-1.5 py-0.5 rounded mt-0.5">
                          {inv.num}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                            <span>{inv.title}</span>
                            <span className="text-[10px] text-forest-600 dark:text-forest-400 opacity-80">
                              View →
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                            {inv.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* In-Transit Live Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 dark:bg-forest-950/80 border border-forest-200/80 dark:border-forest-800 text-[11px] font-bold text-forest-900 dark:text-forest-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
              <span>{activeDeliveriesCount} In Transit</span>
            </div>

            {/* GPS Toggle */}
            <button
              onClick={requestBrowserLocation}
              title={isDemoMode ? 'Click to enable real browser GPS' : 'Browser GPS active'}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-obsidian-900 hover:bg-stonebg-100 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300 border border-stonebg-200 dark:border-obsidian-700 transition"
            >
              <Compass className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
              <span>{isDemoMode ? 'Metro Grid' : 'Live GPS'}</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-stonebg-100 dark:hover:bg-obsidian-800 border border-transparent hover:border-stonebg-200 dark:hover:border-obsidian-700 transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-forest-600 dark:text-forest-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Light/Dark Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-stonebg-100 dark:hover:bg-obsidian-800 border border-transparent hover:border-stonebg-200 dark:hover:border-obsidian-700 transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Reset Demo State Button */}
            <button
              onClick={resetToInitialData}
              title="Reset Demo Records to Initial Conditions"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/70 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-stonebg-100 dark:hover:bg-obsidian-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stonebg-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-950 p-4 space-y-2 animate-slide-up">
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-forest-900 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-stonebg-100 dark:hover:bg-obsidian-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{r.label}</span>
                </div>
                {r.isSpecial && (
                  <span className="text-[10px] bg-gold-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                    Hackathon Lab
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
