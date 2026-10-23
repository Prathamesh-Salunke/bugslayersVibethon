import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Bike,
  Heart,
  Navigation,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

// Custom Leaflet DivIcons with crisp SVG rendering
const createCustomIcon = (bgColor, iconText, borderStyle = 'border-white') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${bgColor};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 15px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        transition: transform 0.2s ease;
      ">
        ${iconText}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

const shelterIcon = createCustomIcon('#059669', '🏠');
const closedShelterIcon = createCustomIcon('#dc2626', '⛔');
const riderIcon = createCustomIcon('#2563eb', '🚴');
const donationIcon = createCustomIcon('#d97706', '🍲');

export default function InteractiveMap({
  height = '500px',
  selectedFocus = null,
  showControls = true,
}) {
  const { shelters, riders, donations, deliveries, activeRole, setActiveRole } = useApp();

  const [layers, setLayers] = useState({
    shelters: true,
    riders: true,
    donations: true,
    routes: true,
  });

  // Center coordinate (Metro Mumbai / Suburbs)
  const defaultCenter = [19.065, 72.84];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-warm-200 dark:border-slate-800 shadow-sm bg-warm-100 dark:bg-slate-900">
      {/* Map Layer Filter Toggles */}
      {showControls && (
        <div className="absolute top-3 right-3 z-[1000] glassmorphism p-2 rounded-xl border border-warm-200 dark:border-slate-700/70 shadow-lg flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mr-1 pl-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Layers</span>
          </div>

          <button
            onClick={() => setLayers(p => ({ ...p, shelters: !p.shelters }))}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              layers.shelters
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 opacity-60'
            }`}
          >
            🏠 Shelters ({shelters.length})
          </button>

          <button
            onClick={() => setLayers(p => ({ ...p, riders: !p.riders }))}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              layers.riders
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 opacity-60'
            }`}
          >
            🚴 Riders ({riders.length})
          </button>

          <button
            onClick={() => setLayers(p => ({ ...p, donations: !p.donations }))}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              layers.donations
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 opacity-60'
            }`}
          >
            🍲 Donors ({donations.length})
          </button>
        </div>
      )}

      {/* Simulated Demo Notice Badge */}
      <div className="absolute bottom-3 left-3 z-[1000] glassmorphism px-3 py-1.5 rounded-xl border border-emerald-300/40 dark:border-emerald-700/40 text-[11px] text-slate-600 dark:text-slate-300 shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-semibold text-emerald-800 dark:text-emerald-300">Live Grid</span>
        <span className="text-slate-400">•</span>
        <span>OSM Tile Server Active</span>
      </div>

      <div style={{ height }}>
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Shelters */}
          {layers.shelters &&
            shelters.map(shelter => {
              const isClosed = shelter.status === 'closed' || shelter.status === 'closed_emergency';
              return (
                <Marker
                  key={shelter.id}
                  position={[shelter.location.lat, shelter.location.lng]}
                  icon={isClosed ? closedShelterIcon : shelterIcon}
                >
                  <Popup className="resq-popup">
                    <div className="p-1 space-y-1.5 text-xs text-slate-800 min-w-[210px]">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="font-bold text-sm text-forest-900">{shelter.name}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isClosed ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isClosed ? 'CLOSED' : 'OPEN'}
                        </span>
                      </div>
                      <p className="text-slate-500">{shelter.address}</p>
                      <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1.5 rounded-lg border">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Open Demand</span>
                          <span className="font-bold text-emerald-700">{shelter.openDemand} meals</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Occupancy</span>
                          <span className="font-semibold text-slate-700">
                            {shelter.currentOccupancy}/{shelter.capacity}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 flex flex-wrap gap-1">
                        {shelter.facilities.clean_water && (
                          <span className="bg-blue-50 text-blue-700 px-1 rounded">💧 Clean Water</span>
                        )}
                        {shelter.facilities.refrigeration && (
                          <span className="bg-indigo-50 text-indigo-700 px-1 rounded">❄️ Chilled</span>
                        )}
                        {shelter.facilities.cooking_fuel && (
                          <span className="bg-amber-50 text-amber-700 px-1 rounded">🔥 Cooking Fuel</span>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Riders */}
          {layers.riders &&
            riders.map(rider => (
              <Marker
                key={rider.id}
                position={[rider.currentLocation.lat, rider.currentLocation.lng]}
                icon={riderIcon}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 text-xs text-slate-800 min-w-[200px]">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-sm text-blue-900">{rider.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 capitalize">
                        {rider.status}
                      </span>
                    </div>
                    <p className="text-slate-500">Vehicle: {rider.vehicle}</p>
                    <div className="flex justify-between bg-blue-50 p-1.5 rounded-lg border border-blue-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Capacity</span>
                        <span className="font-bold text-blue-900">{rider.capacity} units</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Reliability</span>
                        <span className="font-bold text-emerald-700">{rider.reliability}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Completed</span>
                        <span className="font-semibold text-slate-700">{rider.completedDeliveries}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Donations */}
          {layers.donations &&
            donations
              .filter(d => d.location?.lat && d.location?.lng)
              .map(don => (
                <Marker
                  key={don.id}
                  position={[don.location.lat, don.location.lng]}
                  icon={donationIcon}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 text-xs text-slate-800 min-w-[210px]">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="font-bold text-sm text-amber-900">{don.itemName}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            don.safetyStatus === 'ELIGIBLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {don.safetyStatus}
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium">Donor: {don.donorName}</p>
                      <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-100 flex justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Batch Size</span>
                          <span className="font-bold text-amber-900">
                            {don.quantity} {don.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Storage</span>
                          <span className="font-semibold text-slate-700">
                            {don.storageMethod?.split(' ')[0] || 'Standard'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 italic">"{don.pickupReadiness}"</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

          {/* Active In-Transit Delivery Polylines */}
          {layers.routes &&
            deliveries
              .filter(del => del.status === 'in_transit' || del.status === 'diverted')
              .map(del => {
                const positions = [
                  [del.pickupLocation.lat, del.pickupLocation.lng],
                  [del.currentRiderLocation.lat, del.currentRiderLocation.lng],
                  [del.destinationLocation.lat, del.destinationLocation.lng],
                ];

                return (
                  <React.Fragment key={del.id}>
                    <Polyline
                      positions={positions}
                      pathOptions={{
                        color: del.status === 'diverted' ? '#f59e0b' : '#10b981',
                        weight: 4,
                        dashArray: '8, 8',
                      }}
                    >
                      <Tooltip sticky>
                        <div className="text-xs p-1">
                          <span className="font-bold block">Delivery {del.id}</span>
                          <span>{del.quantity} {del.unit} to {del.assignedShelterName}</span>
                          <span className="block text-emerald-700 font-semibold">
                            ~{del.estimatedMinutesRemaining} mins remaining
                          </span>
                        </div>
                      </Tooltip>
                    </Polyline>
                  </React.Fragment>
                );
              })}
        </MapContainer>
      </div>
    </div>
  );
}
