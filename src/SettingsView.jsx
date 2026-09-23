import { useState, useEffect } from 'react'
import { Trash2, Recycle, Truck } from 'lucide-react'
import { loadPreferences, savePreferences, getDeviceToken } from './push'
import { S, tint } from './styles'

const CATEGORIES = [
  { id: 'trash', label: 'Trash', Icon: Trash2 },
  { id: 'recycling', label: 'Recycling', Icon: Recycle },
  { id: 'bulk', label: 'Bulk pickup', Icon: Truck },
]

const TIMES = {
  night_before: [
    { h: 16, m: 0, label: '4:00 PM' },
    { h: 16, m: 30, label: '4:30 PM' },
    { h: 17, m: 0, label: '5:00 PM' },
    { h: 17, m: 30, label: '5:30 PM' },
    { h: 18, m: 0, label: '6:00 PM' },
    { h: 18, m: 30, label: '6:30 PM' },
    { h: 19, m: 0, label: '7:00 PM' },
    { h: 19, m: 30, label: '7:30 PM' },
    { h: 20, m: 0, label: '8:00 PM' },
    { h: 20, m: 30, label: '8:30 PM' },
    { h: 21, m: 0, label: '9:00 PM' },
    { h: 21, m: 30, label: '9:30 PM' },
  ],
  day_of: [
    { h: 4, m: 0, label: '4:00 AM' },
    { h: 4, m: 30, label: '4:30 AM' },
    { h: 5, m: 0, label: '5:00 AM' },
    { h: 5, m: 30, label: '5:30 AM' },
    { h: 6, m: 0, label: '6:00 AM' },
    { h: 6, m: 30, label: '6:30 AM' },
    { h: 7, m: 0, label: '7:00 AM' },
    { h: 7, m: 30, label: '7:30 AM' },
  ],
}

export default function SettingsView({ accent }) {
  const [prefs, setPrefs] = useState(null)
  const [saved, setSaved] = useState(false)
  const hasDevice = !!getDeviceToken()

  useEffect(() => {
    loadPreferences().then((p) => {
      setPrefs(
        p || {
          reminders_enabled: true,
          reminder_timing: 'night_before',
          reminder_hour: 19,
          reminder_minute: 0,
          enabled_categories: ['trash', 'recycling', 'bulk'],
          language: 'en',
        },
      )
    })
  }, [])

  async function update(changes) {
    const next = { ...prefs, ...changes }
    setPrefs(next)
    const ok = await savePreferences({
      enabled: next.reminders_enabled,
      timing: next.reminder_timing,
      hour: next.reminder_hour,
      minute: next.reminder_minute,
      categories: next.enabled_categories,
      language: next.language,
    })
    if (ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  function toggleCategory(id) {
    const list = prefs.enabled_categories.includes(id)
      ? prefs.enabled_categories.filter((c) => c !== id)
      : [...prefs.enabled_categories, id]
    update({ enabled_categories: list })
  }

  if (!prefs) return <div style={S.empty}>Loading…</div>

  const times = TIMES[prefs.reminder_timing]

  return (
    <>
      {!hasDevice && (
        <div style={S.status}>
          Open Kurbly on your phone to turn on reminders.
        </div>
      )}

      <div style={S.card}>
        <div style={rowBetween}>
          <div>
            <div style={S.rowName}>Pickup reminders</div>
            <div style={S.muted}>Get notified before each collection</div>
          </div>
          <Toggle
            on={prefs.reminders_enabled}
            accent={accent}
            onChange={(v) => update({ reminders_enabled: v })}
          />
        </div>
      </div>

      {prefs.reminders_enabled && (
        <>
          <div style={S.card}>
            <div style={S.label}>When</div>
            <div style={segment}>
              {[
                { id: 'night_before', label: 'Night before' },
                { id: 'day_of', label: 'Morning of' },
              ].map((opt) => {
                const active = prefs.reminder_timing === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      update({
                        reminder_timing: opt.id,
                        reminder_hour: opt.id === 'night_before' ? 19 : 6,
                        reminder_minute: 0,
                      })
                    }
                    style={{
                      ...segItem,
                      background: active ? accent : 'transparent',
                      color: active ? '#fff' : '#4b5563',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <div style={{ ...S.label, marginTop: 16 }}>Time</div>
            <select
              value={`${prefs.reminder_hour}:${prefs.reminder_minute}`}
              onChange={(e) => {
                const [h, m] = e.target.value.split(':').map(Number)
                update({ reminder_hour: h, reminder_minute: m })
              }}
              style={S.input}
            >
              {times.map((t) => (
                <option key={`${t.h}:${t.m}`} value={`${t.h}:${t.m}`}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={S.card}>
            <div style={S.label}>Remind me about</div>
            {CATEGORIES.map(({ id, label, Icon }) => (
              <div key={id} style={{ ...rowBetween, marginTop: 14 }}>
                <div style={S.row}>
                  <div style={{ ...S.iconWrapSm, background: tint(accent) }}>
                    <Icon size={20} color={accent} strokeWidth={1.8} />
                  </div>
                  <div style={S.rowName}>{label}</div>
                </div>
                <Toggle
                  on={prefs.enabled_categories.includes(id)}
                  accent={accent}
                  onChange={() => toggleCategory(id)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <div style={S.card}>
        <div style={S.label}>Language</div>
        <div style={segment}>
          {[
            { id: 'en', label: 'English' },
            { id: 'es', label: 'Español' },
          ].map((opt) => {
            const active = prefs.language === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => update({ language: opt.id })}
                style={{
                  ...segItem,
                  background: active ? accent : 'transparent',
                  color: active ? '#fff' : '#4b5563',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {saved && <div style={{ ...S.muted, textAlign: 'center' }}>Saved</div>}
    </>
  )
}

function Toggle({ on, onChange, accent }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        border: 'none',
        background: on ? accent : '#d1d5db',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.15s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.15s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}

const rowBetween = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
}

const segment = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 4,
  background: '#f3f4f6',
  borderRadius: 10,
  padding: 4,
}

const segItem = {
  padding: '9px 8px',
  border: 'none',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}