import { useState, useEffect } from 'react'
import { geocodeAddress, getNextCollections } from './supabase'

export default function App() {
  const [address, setAddress] = useState(() => localStorage.getItem('address') || '')
  const [collections, setCollections] = useState(null)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (address) lookup()
  }, [])

  async function lookup() {
    setBusy(true)
    setStatus(null)
    setCollections(null)
    try {
      const place = await geocodeAddress(address)
      if (!place) {
        setStatus("We couldn't find that address.")
        return
      }
      const data = await getNextCollections(place.lat, place.lng)
      if (!data || data.length === 0) {
        setStatus('That address is outside our service area.')
        return
      }
      setCollections(data)
      localStorage.setItem('address', address)
    } catch (e) {
      setStatus(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 480 }}>
      <h1>TrashDay</h1>

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && lookup()}
        placeholder="Street address, city, state ZIP"
        style={{ width: '100%', padding: 10, fontSize: 16 }}
      />

      <button
        onClick={lookup}
        disabled={busy || !address.trim()}
        style={{ marginTop: 10, padding: '10px 16px', fontSize: 16 }}
      >
        {busy ? 'Looking up…' : 'Find my schedule'}
      </button>

      {status && <p>{status}</p>}

      {collections?.map((c) => (
        <div
          key={c.service_category}
          style={{ border: '1px solid #ddd', borderRadius: 8, padding: 14, marginTop: 12 }}
        >
          <strong>{c.service_name}</strong>
          <div>{formatDate(c.pickup_date)}</div>
          {c.schedule_changed && (
            <div style={{ color: '#c60' }}>{c.change_reason}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}