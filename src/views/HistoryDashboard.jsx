import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/csvExport';
import {
  FileClock,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

export default function HistoryDashboard() {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      severityFilter === 'ALL' || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const handleExport = () => {
    exportToCSV('ResQRoute_Audit_History', filteredLogs);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Permanent Audit & Operations History
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stonebg-200 dark:bg-obsidian-800 text-slate-800 dark:text-slate-200 border border-stonebg-300 dark:border-obsidian-700">
              Immutable Trail
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent accountability: every automated safety evaluation, split decision, and mid-route reroute is logged.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-forest-950 dark:bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition self-start sm:self-auto border border-forest-800"
        >
          <Download className="w-4 h-4 text-forest-300" />
          <span>Export Filtered Audit Log (.CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="lux-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, actor, target or reason..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-stonebg-300 dark:border-obsidian-700 bg-stonebg-50 dark:bg-obsidian-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'INFO', 'SUCCESS', 'WARNING'].map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                severityFilter === s
                  ? 'bg-forest-950 dark:bg-forest-800 text-white shadow-sm'
                  : 'bg-stonebg-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300 hover:bg-stonebg-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="lux-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Showing {filteredLogs.length} Log Entries
          </span>
          <span className="text-[11px] text-slate-400">Chronological Stream</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stonebg-100 dark:bg-obsidian-900/60 text-slate-500 dark:text-slate-400 font-semibold border-y border-stonebg-200 dark:border-obsidian-700">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Target Reference</th>
                <th className="py-2.5 px-3">Details & Algorithmic Rationale</th>
                <th className="py-2.5 px-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stonebg-100 dark:divide-obsidian-700/60 text-slate-700 dark:text-slate-300">
              {filteredLogs.map(log => {
                let badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                if (log.severity === 'SUCCESS')
                  badgeClass = 'bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300';
                if (log.severity === 'WARNING')
                  badgeClass = 'bg-gold-100 text-gold-800 dark:bg-gold-950 dark:text-gold-300';

                return (
                  <tr key={log.id} className="hover:bg-stonebg-50 dark:hover:bg-obsidian-800/40 transition">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                      <span className="text-[9px] text-slate-400 block">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 dark:text-white block font-mono text-[11px]">
                        {log.actionType}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.id}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {log.actor}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-forest-700 dark:text-forest-300 font-bold">
                        {log.target}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-md">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                        {log.description}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
