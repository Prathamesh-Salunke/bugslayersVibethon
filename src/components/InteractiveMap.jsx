import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
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
  Compass,
  Eye,
  Maximize2,
} from 'lucide-react';

// Custom Glowing SVG Leaflet Markers
const createSvgIcon = (bgColor, iconText, glowColor = 'rgba(16, 185, 129, 0.4)') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${bgColor};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 0 15px ${glowColor}, 0 4px 10px rgba(0,0,0,0.5);
        border: 2px solid white;
        transition: transform 0.2s ease;
      ">
        ${iconText}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const shelterIcon = createSvgIcon('#059669', '🏠', 'rgba(16, 185, 129, 0.6)');
const closedShelterIcon = createSvgIcon('#dc2626', '⛔', 'rgba(239, 68, 68, 0.6)');
const riderIcon = createSvgIcon('#0284c7', '🚴', 'rgba(14, 165, 233, 0.6)');
const donorIcon = createSvgIcon('#d97706', '🍲', 'rgba(245, 158, 11, 0.6)');

// Recenter component
function RecenterMap({ center }) {
  const map = useMap();
  if (center) {
    map.panTo(center);
  }
  return null;
}

export default function InteractiveMap({
  height = '500px',
  selectedFocus = null,
  showControls = true,
  defaultDark = true,
}) {
  const { shelters, riders, donations, deliveries, activeRole, setActiveRole } = useApp();

  const [isDarkTiles, setIsDarkTiles] = useState(defaultDark);
  const [layers, setLayers] = useState({
    shelters: true,
    riders: true,
    donations: true,
    routes: true,
  });

  const [mapCenter, setMapCenter] = useState([19.065, 72.84]);

  const activeRider = riders.find(r => r.status === 'in_transit') || riders[0];

  const handleFollowRider = () => {
    if (activeRider && activeRider.currentLocation) {
      setMapCenter([activeRider.currentLocation.lat, activeRider.currentLocation.lng]);
    }
  };

  const handleFitRoute = () => {
    setMapCenter([19.065, 72.84]);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
      {/* Top Map Action Bar */}
      {showControls && (
        <div className="absolute top-3 right-3 z-[1000] flex flex-wrap items-center gap-2 text-xs">
          {/* Tile Theme Toggle */}
          <button
            onClick={() => setIsDarkTiles(!isDarkTiles)}
            className={`px-3 py-1.5 rounded-xl font-bold backdrop-blur-md border transition ${
              isDarkTiles
                ? 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 shadow-lg'
                : 'bg-white/90 text-slate-800 border-slate-300 shadow-md'
            }`}
          >
            {isDarkTiles ? '🌙 Dark Grid' : '☀️ Light Grid'}
          </button>

          {/* Quick Filter Buttons */}
          <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg flex items-center gap-1.5">
            <button
              onClick={() => setLayers(p => ({ ...p, shelters: !p.shelters }))}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                layers.shelters ? 'bg-emerald-900/80 text-emerald-300' : 'text-slate-500'
              }`}
            >
              🏠 Shelters
            </button>
            <button
              onClick={() => setLayers(p => ({ ...p, riders: !p.riders }))}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                layers.riders ? 'bg-sky-900/80 text-sky-300' : 'text-slate-500'
              }`}
            >
              🚴 Couriers
            </button>
            <button
              onClick={() => setLayers(p => ({ ...p, donations: !p.donations }))}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                layers.donations ? 'bg-amber-900/80 text-amber-300' : 'text-slate-500'
              }`}
            >
              🍲 Donors
            </button>
          </div>
        </div>
      )}

      {/* Floating Camera Controls (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2">
        <button
          onClick={handleFollowRider}
          className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center gap-1.5 shadow-xl transition"
        >
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>Follow Active Rider</span>
        </button>

        <button
          onClick={handleFitRoute}
          className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 shadow-xl transition"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Fit City Grid</span>
        </button>

        {/* Live Simulation Indicator Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SIMULATED LIVE TELEMETRY</span>
        </div>
      </div>

      <div style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <RecenterMap center={mapCenter} />

          {/* Dark Tiles or Standard OpenStreetMap */}
          {isDarkTiles ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

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
                    <div className="p-1 space-y-1.5 text-xs text-slate-800 min-w-[220px]">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="font-bold text-sm text-emerald-950">{shelter.name}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isClosed ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isClosed ? 'CLOSED' : 'OPEN INTAKE'}
                        </span>
                      </div>
                      <p className="text-slate-500">{shelter.address}</p>
                      <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1.5 rounded-lg border">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Open Meal Need</span>
                          <span className="font-bold text-emerald-700">{shelter.openDemand} portions</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Occupancy</span>
                          <span className="font-semibold text-slate-700">
                            {shelter.currentOccupancy}/{shelter.capacity}
                          </span>
                        </div>
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
                  <div className="p-1 space-y-1.5 text-xs text-slate-800 min-w-[210px]">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-sm text-sky-950">{rider.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 capitalize">
                        {rider.status}
                      </span>
                    </div>
                    <p className="text-slate-500">{rider.vehicle}</p>
                    <div className="flex justify-between bg-sky-50 p-1.5 rounded-lg border border-sky-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Max Capacity</span>
                        <span className="font-bold text-sky-900">{rider.capacity} portions</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Reliability</span>
                        <span className="font-bold text-emerald-700">{rider.reliability}%</span>
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
                  icon={donorIcon}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 text-xs text-slate-800 min-w-[220px]">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="font-bold text-sm text-amber-950">{don.itemName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
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
                          <span className="text-[10px] text-slate-400 block">Deadline Buffer</span>
                          <span className="font-semibold text-slate-700">
                            ~{(don.safeWindowHours * 60).toFixed(0)} mins
                          </span>
                        </div>
                      </div>
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
                        color: del.status === 'diverted' ? '#f59e0b' : '#06b6d4',
                        weight: 5,
                        dashArray: '10, 10',
                      }}
                    >
                      <Tooltip sticky>
                        <div className="text-xs p-1">
                          <span className="font-bold block text-slate-900">Delivery #{del.id}</span>
                          <span>{del.quantity} {del.unit} to {del.assignedShelterName}</span>
                          <span className="block text-cyan-600 font-bold">
                            ~{del.estimatedMinutesRemaining} mins remaining ({del.distanceKm} km)
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
