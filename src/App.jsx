import { useState, useEffect } from 'react'
import { geocodeAddress, getOrganization, reverseGeocode, getSchedule, getAnnouncements } from './supabase'
import { registerForPush } from './push'
import BottomNav from './BottomNav'
import ScheduleView from './ScheduleView'
import SettingsView from './SettingsView'
import Logo from './Logo'
import { S } from './styles'
import { useLang } from './i18n'
import AlertsView from './AlertsView'

export default function App() {
  const { t } = useLang()
  const [tab, setTab] = useState('home')
  const [address, setAddress] = useState(() => localStorage.getItem('address') || '')
  const [collections, setCollections] = useState(null)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [org, setOrg] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [editing, setEditing] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [seenAlerts, setSeenAlerts] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('seenAlerts') || '[]'))
    } catch {
      return new Set()
    }
  })
  const [pinned, setPinned] = useState(() => {
    const saved = localStorage.getItem('pinned')
    return saved ? JSON.parse(saved) : null
  })
  const [unreadIds, setUnreadIds] = useState(new Set())
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

  useEffect(() => {
    if (tab !== 'alerts' || alerts.length === 0) return
    const fresh = alerts.filter((a) => !seenAlerts.has(a.id)).map((a) => a.id)
    if (fresh.length) setUnreadIds(new Set(fresh))
    const ids = new Set([...seenAlerts, ...alerts.map((a) => a.id)])
    setSeenAlerts(ids)
    localStorage.setItem('seenAlerts', JSON.stringify([...ids]))
  }, [tab, alerts])

  useEffect(() => {
    if (tab !== 'alerts' && unreadIds.size) setUnreadIds(new Set())
  }, [tab])

  async function lookup() {
    setBusy(true)
    setStatus(null)
    setShowMap(false)
    try {
      const place = await geocodeAddress(address)
      if (!place) {
        setStatus(t.notFound)
        setShowMap(true)
        return
      }
      const ok = await loadSchedule(place.lat, place.lng)
      if (ok) {
        localStorage.setItem('address', address)
        localStorage.removeItem('pinned')
        setPinned(null)
        setEditing(false)
      }
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
        setEditing(false)
        setPinned({ lat: pos.lat, lng: pos.lng })
        localStorage.setItem('pinned', JSON.stringify({ lat: pos.lat, lng: pos.lng }))
        const label =
          (await reverseGeocode(pos.lat, pos.lng)) ||
          `${t.pinnedLocation} (${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)})`
        setAddress(label)
        localStorage.setItem('address', label)
      }
    } catch (e) {
      setStatus(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function loadSchedule(lat, lng) {
    const data = await getSchedule(lat, lng, 60)
    if (!data || data.length === 0) {
      setStatus(t.outsideArea)
      setCollections(null)
      return false
    }
    setCollections(data)
    setStatus(null)
    registerForPush(lat, lng).catch(() => {})
    setAlertsLoading(true)
    getAnnouncements(lat, lng)
      .then(setAlerts)
      .catch(() => {})
      .finally(() => setAlertsLoading(false))
    return true
  }

  const unread = alerts.filter((a) => !seenAlerts.has(a.id)).length

  return (
    <div style={S.page}>
      <div style={S.shell}>
        <header style={S.topbar}>
          <span style={S.wordmark}>
            <Logo size={26} color={accent} />
            Kurbly
          </span>
          {org?.organization_name && (
            <span style={S.provider}>{org.organization_name}</span>
          )}
        </header>

        {tab === 'home' && (
          <ScheduleView
            address={address}
            setAddress={setAddress}
            collections={collections}
            status={status}
            busy={busy}
            accent={accent}
            showMap={showMap}
            onLookup={lookup}
            onUsePin={usePin}
            pinned={pinned}
            onCancelMap={() => { setShowMap(false); setStatus(null) }}
            editing={editing}
            setEditing={setEditing}
          />
        )}

        {tab === 'alerts' && (
          <AlertsView alerts={alerts} loading={alertsLoading} unreadIds={unreadIds} />
        )}
        {tab === 'report' && <div style={S.empty}>{t.reportSoon}</div>}
        {tab === 'settings' && <SettingsView accent={accent} />}
      </div>

      <BottomNav tab={tab} setTab={setTab} accent={accent} alertCount={unread} />
    </div>
  )
}