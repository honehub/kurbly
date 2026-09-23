import { useState, useEffect } from 'react'
import { geocodeAddress, getNextCollections, getOrganization, reverseGeocode, getSchedule } from './supabase'
import { scheduleReminders, testReminder } from './reminders'
import PinMap, { SAN_ANGELO } from './PinMap'

const ICONS = { trash: '🗑️', recycle: '♻️', truck: '🚚' }

export default function App() {
  const [address, setAddress] = useState(() => localStorage.getItem('address') || '')
  const [collections, setCollections] = useState(null)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [org, setOrg] = useState(null)
  const [reminderStatus, setReminderStatus] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [pinned, setPinned] = useState(() => {
    const saved = localStorage.getItem('pinned')
    return saved ? JSON.parse(saved) : null
  })
  const accent = org?.primary_color || '#1d4ed8'
  
  useEffect(() => {
    getOrganization().then(setOrg).catch(() => {})
    if (pinned) {
      setBusy(true)
      loadSchedule(pinned.lat, pinned.lng).finally(() => setBusy(false))
    } else if (address) {
      lookup()
    }
  }, [])

  async function lookup() {
    setBusy(true)
    setStatus(null)
    setCollections(null)
    setShowMap(false)
    try {
      const place = await geocodeAddress(address)
      if (!place) {
        setStatus("We couldn't find that address. You can place a pin on the map instead.")
        setShowMap(true)
        return
      }
      await loadSchedule(place.lat, place.lng)
      localStorage.setItem('address', address)
      localStorage.removeItem('pinned')
      setPinned(null)
    } catch (e) {
      setStatus(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function usePin(pos) {
    setBusy(true)
    setStatus(null)
    try {
      const found = await loadSchedule(pos.lat, pos.lng)
      if (found) {
        setShowMap(false)
        setPinned({ lat: pos.lat, lng: pos.lng })
        localStorage.setItem('pinned', JSON.stringify({ lat: pos.lat, lng: pos.lng }))

        const label =
          (await reverseGeocode(pos.lat, pos.lng)) ||
          `Pinned location (${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)})`
        setAddress(label)
        localStorage.setItem('address', label)
      }
    } catch (e) {
      setStatus(e.message)
    } finally {
      setBusy(false)
    }
  }

  // Shared by both paths: fetch the schedule and set up reminders
  async function loadSchedule(lat, lng) {
    const data = await getSchedule(lat, lng, 60)
    if (!data || data.length === 0) {
      setStatus('That location is outside our service area.')
      setCollections(null)
      return false
    }
    setCollections(data)
    setStatus(null)

    const result = await scheduleReminders(lat, lng)
    if (result === 'denied') {
      setReminderStatus('Reminders are off. Turn on notifications for Kurbly in your phone settings.')
    } else if (result === 'unsupported') {
      setReminderStatus('Reminders work in the Kurbly phone app.')
    } else {
      setReminderStatus(`Reminders set for ${result} upcoming pickup days at 7 PM the night before.`)
    }
    return true
  }

  async function runTest() {
    const result = await testReminder()
    if (result === 'scheduled') setReminderStatus('Test notification coming in about 1 minute.')
    else if (result === 'denied') setReminderStatus('Notifications are blocked for Kurbly.')
    else setReminderStatus('Test reminders only work in the phone app.')
  }

  const groups = groupByDate(collections)
  const first = groups[0]
  const rest = groups.slice(1)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + 21)
  const withinThreeWeeks = rest.filter((g) => parseDate(g.date) <= cutoff)
  const later = showAll ? rest : withinThreeWeeks
  const hiddenCount = rest.length - withinThreeWeeks.length

  return (
    <div style={S.page}>
      <div style={S.shell}>
        <header style={S.header}>
          {org?.logo_url && <img src={org.logo_url} alt="" style={S.logo} />}
          <h1 style={{ ...S.title, color: accent }}>
            {org?.organization_name || 'Kurbly'}
          </h1>
          <p style={S.tagline}>Know what's going out.</p>
        </header>

        <div style={S.card}>
          <label style={S.label}>Your service address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            placeholder="Street address, city, state ZIP"
            style={S.input}
          />
          <button
            onClick={lookup}
            disabled={busy || !address.trim()}
            style={{
              ...S.button,
              background: accent,
              opacity: busy || !address.trim() ? 0.5 : 1,
            }}
          >
            {busy ? 'Looking up…' : 'Find my schedule'}
          </button>
        </div>

        {status && <div style={S.status}>{status}</div>}

        {showMap && (
          <PinMap
            center={pinned || SAN_ANGELO}
            onConfirm={usePin}
            onCancel={() => { setShowMap(false); setStatus(null) }}
            accent={accent}
            busy={busy}
          />
        )}
		
        {first && (
          <div style={{ ...S.card, ...S.nextCard }}>
            <div style={S.eyebrow}>
              {first.items.length > 1 ? 'Next pickups' : 'Next pickup'}
            </div>
            <div style={{ ...S.nextDate, color: accent, fontSize: 18 }}>
              {formatDate(first.date)}
            </div>
            <div style={S.relative}>{relative(first.date)}</div>

            {first.items.map((c) => (
              <div key={c.service_category} style={S.nextItem}>
                <div style={{ ...S.iconWrap, background: tint(accent) }}>
                  {ICONS[c.icon_name] || '🗑️'}
                </div>
                <div>
                  <div style={S.nextName}>{c.service_name}</div>
                  {c.schedule_changed && (
                    <div style={S.changedText}>⚠️ {c.change_reason}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {later.length > 0 && (
          <>
            <h2 style={S.sectionTitle}>Coming up</h2>
            {later.map((g) => (
              <div key={g.date} style={S.card}>
                <div style={S.rowDate}>{formatDate(g.date)}</div>
                <div style={S.relative}>{relative(g.date)}</div>
                {g.items.map((c) => (
                  <div key={c.service_category} style={{ ...S.row, marginTop: 12 }}>
                    <div style={{ ...S.iconWrapSm, background: tint(accent) }}>
                      {ICONS[c.icon_name] || '🗑️'}
                    </div>
                    <div>
                      <div style={S.rowName}>{c.service_name}</div>
                      {c.schedule_changed && (
                        <div style={S.changedText}>{c.change_reason}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {!showAll && hiddenCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                style={{ ...S.button, background: 'transparent', color: accent, border: `1px solid ${accent}` }}
              >
                See {hiddenCount} more pickup {hiddenCount === 1 ? 'day' : 'days'}
              </button>
            )}
          </>
        )}

        {collections && (
          <div style={S.card}>
            <div style={S.rowName}>🔔 Reminders</div>
            {reminderStatus && <div style={{ ...S.relative, marginTop: 6 }}>{reminderStatus}</div>}
            <button
              onClick={runTest}
              style={{ ...S.button, background: 'transparent', color: accent, border: `1px solid ${accent}` }}
            >
              Send a test reminder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function groupByDate(collections) {
  if (!collections) return []
  const map = new Map()
  for (const c of collections) {
    if (!map.has(c.pickup_date)) map.set(c.pickup_date, [])
    map.get(c.pickup_date).push(c)
  }
  return [...map.entries()]
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function tint(hex) {
  return hex + '1a'
}

function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(iso) {
  return parseDate(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function relative(iso) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.round((parseDate(iso) - today) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

const S = {
  page: {
    minHeight: '100vh',
    background: '#f4f5f7',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '24px 16px 48px',
  },
  shell: { maxWidth: 440, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 20 },
  logo: { height: 48, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' },
  tagline: { color: '#6b7280', fontSize: 15, margin: '4px 0 0' },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: 16,
    border: '1px solid #d1d5db',
    borderRadius: 10,
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    marginTop: 10,
    padding: '13px',
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
  status: {
    background: '#fff7ed',
    border: '1px solid #fed7aa',
    color: '#9a3412',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  nextCard: { padding: 20 },
  eyebrow: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: 8,
  },
  nextItem: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: '50%',
	    display: 'grid',
    placeItems: 'center',
    fontSize: 28,
    flexShrink: 0,
  },
  iconWrapSm: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    fontSize: 21,
    flexShrink: 0,
  },
  nextName: { fontSize: 20, fontWeight: 700, color: '#111827' },
  nextDate: { fontSize: 16, fontWeight: 600, marginTop: 2 },
  relative: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  changedText: { fontSize: 13, color: '#92400e', marginTop: 2 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#374151',
    margin: '20px 0 10px',
  },
  row: { display: 'flex', alignItems: 'center', gap: 14 },
  rowName: { fontSize: 16, fontWeight: 600, color: '#111827' },
  rowDate: { fontSize: 15, fontWeight: 600, color: '#111827' },
}