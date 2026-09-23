import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet's default marker images don't survive bundling, so use a plain SVG pin
const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.2 0 0 7.2 0 16c0 11 16 26 16 26s16-15 16-26c0-8.8-7.2-16-16-16z" fill="#1d4ed8"/>
    <circle cx="16" cy="16" r="6" fill="#fff"/>
  </svg>`,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
})

function ClickHandler({ onMove }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng)
    },
  })
  return null
}

export default function PinMap({ center, onConfirm, onCancel, accent = '#1d4ed8', busy }) {
  const [pos, setPos] = useState(center)

  return (
    <div style={wrap}>
      <div style={help}>
        Tap the map to move the pin onto your house, then confirm.
      </div>

      <div style={mapBox}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <ClickHandler onMove={setPos} />
          <Marker
            position={[pos.lat, pos.lng]}
            icon={pinIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => setPos(e.target.getLatLng()),
            }}
          />
        </MapContainer>
      </div>

      <button
        onClick={() => onConfirm(pos)}
        disabled={busy}
        style={{ ...btn, background: accent, opacity: busy ? 0.5 : 1 }}
      >
        {busy ? 'Checking…' : 'Use this location'}
      </button>

      <button onClick={onCancel} style={{ ...btn, ...cancelBtn }}>
        Enter address again
      </button>
    </div>
  )
}

const wrap = {
  background: '#fff',
  borderRadius: 16,
  padding: 18,
  marginBottom: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
}

const help = {
  fontSize: 14,
  color: '#4b5563',
  marginBottom: 12,
}

const mapBox = {
  height: 300,
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
}

const btn = {
  width: '100%',
  marginTop: 10,
  padding: '13px',
  fontSize: 16,
  fontWeight: 600,
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
}

const cancelBtn = {
  background: 'transparent',
  color: '#6b7280',
  border: '1px solid #d1d5db',
  marginTop: 8,
}

export const SAN_ANGELO = { lat: 31.4638, lng: -100.437 }