import PinMap, { SAN_ANGELO } from './PinMap'
import { S, ICONS, catColor, shortDate, weekday, formatDate, relative } from './styles'
import { useLang, CATEGORY_LABELS } from './i18n'

export default function ScheduleView({
  address, setAddress, collections, status, busy, accent,
  showMap, onLookup, onUsePin, pinned, onCancelMap, editing, setEditing,
}) {
  const { t, lang, locale } = useLang()
  const labels = CATEGORY_LABELS[lang]
  const name = (c) => labels[c.service_category] || c.service_name

  const groups = groupByDate(collections)
  const first = groups[0]
  const later = groups.slice(1)
  const hasSchedule = groups.length > 0

  if (!hasSchedule || editing) {
    return (
      <>
        {status && <div style={{ ...S.notice, marginTop: 8 }}>{status}</div>}

        <div style={S.section}>
          <label style={S.label} htmlFor="addr">{t.yourAddress}</label>
          <input
            id="addr"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onLookup()}
            placeholder={t.addressPlaceholder}
            style={S.input}
            autoComplete="street-address"
          />
          <button
            onClick={onLookup}
            disabled={busy || !address.trim()}
            style={{
              ...S.button,
              background: accent,
              opacity: busy || !address.trim() ? 0.45 : 1,
            }}
          >
            {busy ? t.lookingUp : t.findSchedule}
          </button>
          {hasSchedule && (
            <button onClick={() => setEditing(false)} style={S.buttonQuiet}>
              {t.cancel}
            </button>
          )}
        </div>

        {showMap && (
          <div style={S.section}>
            <PinMap
              center={pinned || SAN_ANGELO}
              onConfirm={onUsePin}
              onCancel={onCancelMap}
              accent={accent}
              busy={busy}
            />
          </div>
        )}
      </>
    )
  }

  const leadColor = catColor(first.items[0].service_category).solid

  return (
    <>
      <div style={S.addressBar}>
        <span style={S.addressText}>{address}</span>
        <button
          onClick={() => setEditing(true)}
          style={{ ...S.textLink, color: accent }}
        >
          {t.change}
        </button>
      </div>

      <div style={S.hero}>
        <div style={{ ...S.heroRail, background: leadColor }} />
        <h2 style={S.heroDay}>{relative(first.date, t)}</h2>
        <div style={S.heroDate}>{formatDate(first.date, locale)}</div>

        <div style={S.heroServices}>
          {first.items.map((c) => {
            const Icon = ICONS[c.icon_name] || ICONS.trash
            const col = catColor(c.service_category)
            return (
              <div
                key={c.service_category}
                style={{ ...S.heroServiceRow, background: col.tint }}
              >
                <Icon size={23} color={col.solid} strokeWidth={1.9} />
                <div>
                  <div style={{ ...S.heroServiceName, color: col.solid }}>
                    {name(c)}
                  </div>
                  {c.schedule_changed && (
                    <div style={S.changed}>{c.change_reason}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {later.length > 0 && (
        <>
          <div style={S.agendaHead}>{t.comingUp}</div>
          {later.map((g) => (
            <div key={g.date} style={S.agendaRow}>
              <div>
                <div style={S.agendaDate}>{shortDate(g.date, locale)}</div>
                <div style={S.agendaWeekday}>{weekday(g.date, locale)}</div>
              </div>
              <div style={S.agendaServices}>
                {g.items.map((c) => (
                  <div key={c.service_category} style={S.agendaService}>
                    <span style={{ ...S.dot, background: catColor(c.service_category).solid }} />
                    <span>
                      {name(c)}
                      {c.schedule_changed && (
                        <span style={S.changed}> {c.change_reason}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
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