import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import LandingView from './views/LandingView';
import AdminDashboard from './views/AdminDashboard';
import DonorDashboard from './views/DonorDashboard';
import RiderDashboard from './views/RiderDashboard';
import ShelterDashboard from './views/ShelterDashboard';
import HistoryDashboard from './views/HistoryDashboard';
import SimulationLabView from './views/SimulationLabView';
import { ShieldCheck, Heart } from 'lucide-react';

function MainContent() {
  const { activeRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeRole === 'landing' && <LandingView />}
        {activeRole === 'admin' && <AdminDashboard />}
        {activeRole === 'donor' && <DonorDashboard />}
        {activeRole === 'rider' && <RiderDashboard />}
        {activeRole === 'shelter' && <ShelterDashboard />}
        {activeRole === 'history' && <HistoryDashboard />}
        {activeRole === 'simlab' && <SimulationLabView />}
      </main>

      {/* Unified Footer */}
      <footer className="border-t border-warm-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              ResQRoute
            </span>
            <span>— Smart Food Rescue & Last-Mile Aid Coordination</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>BugSlayers Hackathon Prototype</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              Zero Preventable Spoilage
            </span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
