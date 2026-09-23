import { useState } from 'react'
import PinMap, { SAN_ANGELO } from './PinMap'
import { S, ICONS, tint, parseDate, formatDate, relative } from './styles'
import { useLang, CATEGORY_LABELS } from './i18n'

export default function ScheduleView({
  address, setAddress, collections, status, busy, accent,
  showMap, setShowMap, onLookup, onUsePin, pinned, onCancelMap,
}) {
  const [showAll, setShowAll] = useState(false)
  const { t, lang, locale } = useLang()
  const labels = CATEGORY_LABELS[lang]

  const name = (c) => labels[c.service_category] || c.service_name

  const groups = groupByDate(collections)
  const first = groups[0]
  const rest = groups.slice(1)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + 21)
  const withinThreeWeeks = rest.filter((g) => parseDate(g.date) <= cutoff)
  const later = showAll ? rest : withinThreeWeeks
  const hiddenCount = rest.length - withinThreeWeeks.length

  return (
    <>
      <div style={S.card}>
        <label style={S.label}>{t.yourAddress}</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLookup()}
          placeholder={t.addressPlaceholder}
          style={S.input}
        />
        <button
          onClick={onLookup}
          disabled={busy || !address.trim()}
          style={{
            ...S.button,
            background: accent,
            opacity: busy || !address.trim() ? 0.5 : 1,
          }}
        >
          {busy ? t.lookingUp : t.findSchedule}
        </button>
      </div>

      {status && <div style={S.status}>{status}</div>}

      {showMap && (
        <PinMap
          center={pinned || SAN_ANGELO}
          onConfirm={onUsePin}
          onCancel={onCancelMap}
          accent={accent}
          busy={busy}
        />
      )}

      {first && (
        <div style={{ ...S.card, ...S.nextCard }}>
          <div style={S.eyebrow}>
            {first.items.length > 1 ? t.nextPickups : t.nextPickup}
          </div>
          <div style={{ ...S.nextDate, color: accent, fontSize: 18 }}>
            {formatDate(first.date, locale)}
          </div>
          <div style={S.relative}>{relative(first.date, t)}</div>

          {first.items.map((c) => (
            <div key={c.service_category} style={S.nextItem}>
              <div style={{ ...S.iconWrap, background: tint(accent) }}>
                {(() => {
                  const Icon = ICONS[c.icon_name] || ICONS.trash
                  return <Icon size={26} color={accent} strokeWidth={1.8} />
                })()}
              </div>
              <div>
                <div style={S.nextName}>{name(c)}</div>
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
          <h2 style={S.sectionTitle}>{t.comingUp}</h2>
          {later.map((g) => (
            <div key={g.date} style={S.card}>
              <div style={S.rowDate}>{formatDate(g.date, locale)}</div>
              <div style={S.relative}>{relative(g.date, t)}</div>
              {g.items.map((c) => (
                <div key={c.service_category} style={{ ...S.row, marginTop: 12 }}>
                  <div style={{ ...S.iconWrapSm, background: tint(accent) }}>
                    {(() => {
                      const Icon = ICONS[c.icon_name] || ICONS.trash
                      return <Icon size={20} color={accent} strokeWidth={1.8} />
                    })()}
                  </div>
                  <div>
                    <div style={S.rowName}>{name(c)}</div>
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
              {t.seeMore(hiddenCount)}
            </button>
          )}
        </>
      )}
    </>
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