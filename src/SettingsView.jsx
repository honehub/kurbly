import { useState, useEffect } from 'react'
import { Trash2, Recycle, Truck } from 'lucide-react'
import { loadPreferences, savePreferences, getDeviceToken } from './push'
import { S, C } from './styles'
import { useLang } from './i18n'

const TIMES = {
  night_before: [
    { h: 16, m: 0 }, { h: 16, m: 30 }, { h: 17, m: 0 }, { h: 17, m: 30 },
    { h: 18, m: 0 }, { h: 18, m: 30 }, { h: 19, m: 0 }, { h: 19, m: 30 },
    { h: 20, m: 0 }, { h: 20, m: 30 }, { h: 21, m: 0 }, { h: 21, m: 30 },
  ],
  day_of: [
    { h: 4, m: 0 }, { h: 4, m: 30 }, { h: 5, m: 0 }, { h: 5, m: 30 },
    { h: 6, m: 0 }, { h: 6, m: 30 }, { h: 7, m: 0 }, { h: 7, m: 30 },
  ],
}

function timeLabel(h, m, locale) {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })
}

export default function SettingsView({ accent }) {
  const { t, lang, locale, setLang } = useLang()
  const [prefs, setPrefs] = useState(null)
  const [saved, setSaved] = useState(false)
  const hasDevice = !!getDeviceToken()

  const CATEGORIES = [
    { id: 'trash', label: t.trash, Icon: Trash2 },
    { id: 'recycling', label: t.recycling, Icon: Recycle },
    { id: 'bulk', label: t.bulk, Icon: Truck },
  ]

  useEffect(() => {
    loadPreferences().then((p) => {
      setPrefs(
        p || {
          reminders_enabled: true,
          reminder_timing: 'night_before',
          reminder_hour: 19,
          reminder_minute: 0,
          enabled_categories: ['trash', 'recycling', 'bulk'],
          language: lang,
        },
      )
    })
  }, [])

  async function update(changes) {
    const next = { ...prefs, ...changes }
    setPrefs(next)
    if (changes.language) setLang(changes.language)
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
      setTimeout(() => setSaved(false), 1800)
    }
  }

  function toggleCategory(id) {
    const list = prefs.enabled_categories.includes(id)
      ? prefs.enabled_categories.filter((c) => c !== id)
      : [...prefs.enabled_categories, id]
    update({ enabled_categories: list })
  }

  if (!prefs) return <div style={S.empty}>{t.loading}</div>

  const times = TIMES[prefs.reminder_timing]

  return (
    <>
      {!hasDevice && <div style={{ ...S.notice, marginTop: 8 }}>{t.openOnPhone}</div>}

      <div style={S.settingRow}>
        <div>
          <div style={S.settingName}>{t.pickupReminders}</div>
          <div style={S.settingHint}>{t.reminderSubtitle}</div>
        </div>
        <Toggle
          on={prefs.reminders_enabled}
          accent={accent}
          onChange={(v) => update({ reminders_enabled: v })}
        />
      </div>

      {prefs.reminders_enabled && (
        <>
          <div style={S.groupHead}>{t.when}</div>

          <div style={{ padding: '4px 20px 16px' }}>
            <div style={segment}>
              {[
                { id: 'night_before', label: t.nightBefore },
                { id: 'day_of', label: t.morningOf },
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
                      background: active ? C.ink : 'transparent',
                      color: active ? C.paper : C.muted,
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <div style={{ ...S.label, marginTop: 20 }}>{t.time}</div>
            <select
              value={`${prefs.reminder_hour}:${prefs.reminder_minute}`}
              onChange={(e) => {
                const [h, m] = e.target.value.split(':').map(Number)
                update({ reminder_hour: h, reminder_minute: m })
              }}
              style={S.input}
            >
              {times.map((tm) => (
                <option key={`${tm.h}:${tm.m}`} value={`${tm.h}:${tm.m}`}>
                  {timeLabel(tm.h, tm.m, locale)}
                </option>
              ))}
            </select>
          </div>

          <div style={S.groupHead}>{t.remindMeAbout}</div>
          {CATEGORIES.map(({ id, label, Icon }) => (
            <div key={id} style={S.settingRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <Icon size={19} color={C.muted} strokeWidth={1.75} />
                <div style={S.settingName}>{label}</div>
              </div>
              <Toggle
                on={prefs.enabled_categories.includes(id)}
                accent={accent}
                onChange={() => toggleCategory(id)}
              />
            </div>
          ))}
        </>
      )}

      <div style={S.groupHead}>{t.language}</div>
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={segment}>
          {[
            { id: 'en', label: 'English' },
            { id: 'es', label: 'Español' },
          ].map((opt) => {
            const active = lang === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => update({ language: opt.id })}
                style={{
                  ...segItem,
                  background: active ? C.ink : 'transparent',
                  color: active ? C.paper : C.muted,
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ height: 20 }} />
      {saved && (
        <div style={{ ...S.muted, textAlign: 'center', color: C.faint }}>{t.saved}</div>
      )}
    </>
  )
}

function Toggle({ on, onChange, accent }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        border: 'none',
        background: on ? accent : C.rule,
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.15s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 21 : 3,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.15s',
        }}
      />
    </button>
  )
}

const segment = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 2,
  background: C.ruleSoft,
  borderRadius: 7,
  padding: 3,
}

const segItem = {
  padding: '9px 8px',
  border: 'none',
  borderRadius: 5,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
  transition: 'background 0.12s',
}