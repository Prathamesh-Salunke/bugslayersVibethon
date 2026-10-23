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

  const activeDeliveriesCount = deliveries.filter(
    d => d.status === 'in_transit' || d.status === 'assigned'
  ).length;

  const roles = [
    { id: 'landing', label: 'Overview', icon: HeartHandshake },
    { id: 'admin', label: 'Admin Ops', icon: LayoutDashboard },
    { id: 'donor', label: 'Donor Hub', icon: Sparkles },
    { id: 'rider', label: 'Volunteer Rider', icon: Bike },
    { id: 'shelter', label: 'Shelter Intake', icon: Building2 },
    { id: 'history', label: 'Audit Trail', icon: FileClock },
    {
      id: 'simlab',
      label: 'Judge Lab',
      icon: FlaskConical,
      isSpecial: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-warm-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            onClick={() => setActiveRole('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-forest-800 via-emerald-600 to-mint-400 p-0.5 shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-forest-900 rounded-[10px] flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-forest-950 dark:text-emerald-400">
                  ResQ<span className="text-emerald-600 dark:text-emerald-300">Route</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  AI Grid
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                Rescue Food. Deliver Hope.
              </p>
            </div>
          </div>

          {/* Role Navigation Buttons (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 bg-warm-100 dark:bg-slate-800/70 p-1.5 rounded-2xl border border-warm-200 dark:border-slate-700/60">
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
                        ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-700 text-forest-900 dark:text-emerald-300 shadow-sm border border-slate-200 dark:border-slate-600'
                      : r.isSpecial
                      ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-forest-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? '' : 'opacity-80'}`} />
                  {r.label}
                  {r.isSpecial && (
                    <span className="ml-0.5 text-[9px] bg-white/25 px-1 py-0.2 rounded font-mono">
                      TEST
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Controls & Badges */}
          <div className="flex items-center gap-2">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeDeliveriesCount} In Transit</span>
            </div>

            {/* GPS Demo vs Live Switcher */}
            <button
              onClick={requestBrowserLocation}
              title={isDemoMode ? 'Click to enable real browser GPS' : 'Browser GPS active'}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-warm-100 hover:bg-warm-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-warm-200 dark:border-slate-700 transition"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isDemoMode ? 'Demo City (Metro)' : 'Live GPS'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-warm-100 dark:hover:bg-slate-800 transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-warm-100 dark:hover:bg-slate-800 transition"
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
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-warm-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-warm-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
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
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-warm-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{r.label}</span>
                </div>
                {r.isSpecial && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
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
