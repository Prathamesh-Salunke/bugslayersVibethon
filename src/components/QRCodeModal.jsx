import React from 'react';
import { X, ShieldCheck, CheckCircle2, Download, Copy, Share2 } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const qrValue = data.qrCodeString || `RESCUEOS-AUTH-${data.id || 'DEL-8801'}-${Date.now()}`;
  const encodedSvgData = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#0f172a"><rect width="100" height="100" fill="#ffffff" rx="8"/><rect x="10" y="10" width="24" height="24" fill="#0f172a"/><rect x="14" y="14" width="16" height="16" fill="#ffffff"/><rect x="18" y="18" width="8" height="8" fill="#0f172a"/><rect x="66" y="10" width="24" height="24" fill="#0f172a"/><rect x="70" y="14" width="16" height="16" fill="#ffffff"/><rect x="74" y="18" width="8" height="8" fill="#0f172a"/><rect x="10" y="66" width="24" height="24" fill="#0f172a"/><rect x="14" y="70" width="16" height="16" fill="#ffffff"/><rect x="18" y="74" width="8" height="8" fill="#0f172a"/><circle cx="50" cy="50" r="10" fill="#059669"/><rect x="42" y="15" width="8" height="18" fill="#0f172a"/><rect x="42" y="67" width="8" height="18" fill="#0f172a"/><rect x="15" y="42" width="18" height="8" fill="#0f172a"/><rect x="67" y="42" width="18" height="8" fill="#0f172a"/><rect x="66" y="66" width="12" height="12" fill="#0f172a"/><rect x="80" y="80" width="10" height="10" fill="#0f172a"/></svg>`
  );

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Chain-of-Custody Digital Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/40">
            <img
              src={`data:image/svg+xml;utf8,${encodedSvgData}`}
              alt="Verification QR"
              className="w-48 h-48"
            />
          </div>

          <div>
            <p className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
              PASS: {qrValue}
            </p>
            <p className="text-sm font-bold text-white mt-1">
              {data.donationItemName || data.itemName || 'Fresh Cooked Meals (Surplus Batch)'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantity: <span className="text-white font-medium">{data.quantity} {data.unit || 'portions'}</span>
            </p>
          </div>

          <div className="w-full bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Shelter:</span>
              <span className="font-semibold text-emerald-300">{data.assignedShelterName || 'Hope Shelter'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Authorized Courier:</span>
              <span className="font-semibold text-white">{data.riderName || 'Rohit Kumar (Rider R-01)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Safety Check:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Microbial Verified
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 max-w-xs">
            Present this QR code to the shelter intake manager upon arrival to record biometric and cryptographic proof of delivery.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(qrValue);
              alert('Verification code copied to clipboard!');
            }}
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            Copy Code
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-emerald-900/40"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
