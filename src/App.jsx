import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ToastContainer from './components/ToastContainer';
import LandingView from './views/LandingView';
import AdminDashboard from './views/AdminDashboard';
import DonorDashboard from './views/DonorDashboard';
import RiderDashboard from './views/RiderDashboard';
import ShelterDashboard from './views/ShelterDashboard';
import HistoryDashboard from './views/HistoryDashboard';
import SimulationLabView from './views/SimulationLabView';
import MobileSimulatorView from './views/MobileSimulatorView';
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
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Activity,
  Map,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'landing', label: 'Overview', icon: HeartHandshake, group: 'main' },
  { id: 'admin', label: 'Operations Command', icon: LayoutDashboard, group: 'main', badge: 'LIVE' },
  { id: 'donor', label: 'Donor Hub', icon: Sparkles, group: 'roles' },
  { id: 'rider', label: 'Volunteer Courier', icon: Bike, group: 'roles' },
  { id: 'shelter', label: 'Shelter Intake', icon: Building2, group: 'roles' },
  { id: 'history', label: 'Audit Trail', icon: FileClock, group: 'tools' },
  { id: 'simlab', label: 'Judge Lab', icon: FlaskConical, group: 'tools', isSpecial: true },
];

function Sidebar({ collapsed, onCollapse }) {
  const {
    activeRole,
    setActiveRole,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    resetToInitialData,
    deliveries,
    donations,
    riders,
  } = useApp();

  const activeDeliveriesCount = deliveries.filter(
    d => d.status === 'in_transit' || d.status === 'assigned' || d.status === 'diverted'
  ).length;

  const availableRiders = riders.filter(r => r.status === 'available').length;
  const urgentDonations = donations.filter(d => d.safeWindowHours && d.safeWindowHours < 1).length;

  const grouped = {
    main: NAV_ITEMS.filter(n => n.group === 'main'),
    roles: NAV_ITEMS.filter(n => n.group === 'roles'),
    tools: NAV_ITEMS.filter(n => n.group === 'tools'),
  };

  const groupLabels = { main: 'COMMAND', roles: 'ROLE PORTALS', tools: 'UTILITIES' };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-50 flex flex-col border-r border-emerald-900/50
        bg-[#061a14] shadow-2xl transition-all duration-300
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-emerald-900/50 px-3 shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-extrabold text-sm text-white tracking-tight leading-tight">
              Resq<span className="text-emerald-400">Route</span>
            </p>
            <p className="text-[10px] text-emerald-500/80 leading-tight font-medium tracking-tight">
              Self-Healing Aid Network
            </p>
          </div>
        )}
      </div>

      {/* Live Status Chips */}
      {!collapsed && (
        <div className="px-3 py-2.5 flex items-center gap-2 border-b border-emerald-900/30">
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/40">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {activeDeliveriesCount} In Transit
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/40">
            {availableRiders} Riders Free
          </span>
          {urgentDonations > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-700/40 animate-pulse">
              <AlertTriangle className="w-2.5 h-2.5" />
              {urgentDonations} Urgent
            </span>
          )}
        </div>
      )}

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-hide">
        {Object.entries(grouped).map(([groupKey, items]) => (
          <div key={groupKey}>
            {!collapsed && (
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-700/70 px-2 pb-1.5">
                {groupLabels[groupKey]}
              </p>
            )}
            {items.map(item => {
              const Icon = item.icon;
              const isActive = activeRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveRole(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all mb-0.5
                    ${isActive
                      ? item.isSpecial
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-950/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/50'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? (item.isSpecial ? 'text-amber-400' : 'text-emerald-400') : 'text-slate-500'}`} />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 border border-cyan-700/30">
                      {item.badge}
                    </span>
                  )}
                  {!collapsed && item.isSpecial && (
                    <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-300 border border-amber-700/30">
                      7 TESTS
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Utility Controls */}
      <div className={`border-t border-emerald-900/50 p-2 space-y-1 shrink-0`}>
        {[
          {
            icon: soundEnabled ? Volume2 : VolumeX,
            label: soundEnabled ? 'Mute SFX' : 'Enable SFX',
            onClick: toggleSound,
            active: soundEnabled,
          },
          {
            icon: theme === 'dark' ? Sun : Moon,
            label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
            onClick: toggleTheme,
          },
          {
            icon: RotateCcw,
            label: 'Reset Demo',
            onClick: resetToInitialData,
            danger: true,
          },
        ].map((ctrl, idx) => {
          const Icon = ctrl.icon;
          return (
            <button
              key={idx}
              onClick={ctrl.onClick}
              title={collapsed ? ctrl.label : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition
                ${ctrl.danger
                  ? 'text-red-400/70 hover:text-red-300 hover:bg-red-950/30'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'}
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{ctrl.label}</span>}
            </button>
          );
        })}

        {/* Collapse Toggle */}
        <button
          onClick={onCollapse}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-white hover:bg-white/5 transition ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Collapse Panel</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function TopBar({ viewMode, setViewMode, mobileOpen, setMobileOpen }) {
  const { activeRole, deliveries, isDemoMode } = useApp();

  const labels = {
    landing: 'Platform Overview',
    admin: 'Operations Command Center',
    donor: 'Donor Hub — Food Submission & Tracking',
    rider: 'Volunteer Courier Dashboard',
    shelter: 'Shelter Intake & Demand Management',
    history: 'Audit Trail & History',
    simlab: 'Judge Lab — Hackathon Demonstration',
  };

  return (
    <header className="h-14 bg-[#0a2118]/90 dark:bg-[#040f0a]/90 border-b border-emerald-900/40 backdrop-blur-md flex items-center px-4 gap-4 shrink-0 sticky top-0 z-40">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden p-1.5 text-slate-400 hover:text-white transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-bold text-white truncate">{labels[activeRole] || 'RescueOS'}</h2>
        <p className="text-[10px] text-emerald-600/80 font-medium">
          RescueOS v2 • Self-Healing Aid Network {isDemoMode && '• Demo Scenario Active'}
        </p>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
        <button
          onClick={() => setViewMode('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            viewMode === 'desktop'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Desktop</span>
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            viewMode === 'mobile'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mobile Sim</span>
        </button>
      </div>

      {/* Live pulse */}
      <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/40 px-3 py-1.5 rounded-full">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        LIVE
      </div>
    </header>
  );
}

function MainContent({ viewMode }) {
  const { activeRole } = useApp();

  if (viewMode === 'mobile') {
    return <MobileSimulatorView />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRole === 'landing' && <LandingView />}
        {activeRole === 'admin' && <AdminDashboard />}
        {activeRole === 'donor' && <DonorDashboard />}
        {activeRole === 'rider' && <RiderDashboard />}
        {activeRole === 'shelter' && <ShelterDashboard />}
        {activeRole === 'history' && <HistoryDashboard />}
        {activeRole === 'simlab' && <SimulationLabView />}
      </div>
    </div>
  );
}

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('desktop');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60';

  return (
    <div className="min-h-screen bg-[#071a10] dark:bg-[#040d08] text-slate-100 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10" onClick={e => e.stopPropagation()}>
            <Sidebar collapsed={false} onCollapse={() => setMobileSidebarOpen(false)} />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${sidebarWidth}`}>
        <TopBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />
        <MainContent viewMode={viewMode} />
      </div>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
