import { Trash2, Recycle, Truck } from 'lucide-react'

export const ICONS = { trash: Trash2, recycle: Recycle, truck: Truck }

export const C = {
  ink: '#0F172A',
  body: '#334155',
  muted: '#64748B',
  faint: '#94A3B8',
  rule: '#E2E8F0',
  ruleSoft: '#F1F5F9',
  paper: '#FFFFFF',
  alert: '#B45309',
  alertBg: '#FFFBEB',
}

export const CAT = {
  trash:      { solid: '#334155', tint: '#F1F5F9' },
  recycling:  { solid: '#0369A1', tint: '#EFF6FF' },
  bulk:       { solid: '#A16207', tint: '#FEFCE8' },
  yard_waste: { solid: '#4D7C0F', tint: '#F7FEE7' },
}

export function catColor(category) {
  return CAT[category] || CAT.trash
}

const font = "'IBM Plex Sans', system-ui, -apple-system, sans-serif"

export const S = {
  page: {
    minHeight: '100vh',
    background: C.paper,
    fontFamily: font,
    color: C.body,
    paddingBottom: 88,
    WebkitFontSmoothing: 'antialiased',
  },
  shell: { maxWidth: 480, margin: '0 auto' },

  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 20px 16px',
  },
  wordmark: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    fontSize: 19,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: C.ink,
  },
  provider: { fontSize: 13, color: C.faint, fontWeight: 400 },

  addressBar: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 16,
    padding: '12px 20px',
    borderTop: `1px solid ${C.ruleSoft}`,
    borderBottom: `1px solid ${C.ruleSoft}`,
  },
  addressText: {
    fontSize: 14,
    color: C.muted,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  textLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    font: 'inherit',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    flexShrink: 0,
  },

  hero: {
    padding: '40px 20px 34px',
    borderBottom: `1px solid ${C.rule}`,
    position: 'relative',
  },
  heroRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  heroDay: {
    fontSize: 52,
    lineHeight: 0.98,
    fontWeight: 700,
    letterSpacing: '-0.04em',
    color: C.ink,
    margin: 0,
  },
  heroDate: {
    fontSize: 16,
    fontWeight: 400,
    color: C.muted,
    marginTop: 10,
  },
  heroServices: { marginTop: 24, display: 'flex', flexDirection: 'column', gap: 6 },
  heroServiceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '11px 14px',
    borderRadius: 8,
  },
  heroServiceName: {
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '-0.015em',
  },

  agendaHead: {
    fontSize: 13,
    fontWeight: 500,
    color: C.faint,
    padding: '24px 20px 10px',
  },
  agendaRow: {
    display: 'grid',
    gridTemplateColumns: '78px 1fr',
    gap: 12,
    padding: '15px 20px',
    borderTop: `1px solid ${C.ruleSoft}`,
    alignItems: 'start',
  },
  agendaDate: {
    fontSize: 14,
    fontWeight: 600,
    color: C.ink,
    letterSpacing: '-0.01em',
  },
  agendaWeekday: { fontSize: 12, color: C.faint, marginTop: 1 },
  agendaServices: {
    fontSize: 15,
    color: C.body,
    lineHeight: 1.5,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  agendaService: { display: 'flex', alignItems: 'flex-start', gap: 9 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 7,
  },

  section: { padding: '20px' },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: C.ink,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '13px 14px',
    fontSize: 16,
    fontFamily: font,
    color: C.ink,
    background: C.paper,
    border: `1px solid ${C.rule}`,
    borderRadius: 6,
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    marginTop: 10,
    padding: '13px',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: font,
    color: C.paper,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    letterSpacing: '-0.01em',
  },
  buttonQuiet: {
    width: '100%',
    marginTop: 8,
    padding: '13px',
    fontSize: 15,
    fontWeight: 500,
    fontFamily: font,
    background: 'transparent',
    border: `1px solid ${C.rule}`,
    borderRadius: 6,
    cursor: 'pointer',
    color: C.body,
  },
  notice: {
    margin: '0 20px 16px',
    padding: '13px 15px',
    background: C.alertBg,
    borderLeft: `2px solid ${C.alert}`,
    color: C.alert,
    fontSize: 14,
    lineHeight: 1.5,
  },
  changed: { fontSize: 13, color: C.alert, marginTop: 3 },

  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '16px 20px',
    borderBottom: `1px solid ${C.ruleSoft}`,
  },
  settingName: { fontSize: 15, fontWeight: 500, color: C.ink },
  settingHint: { fontSize: 13, color: C.muted, marginTop: 2 },
  groupHead: {
    fontSize: 13,
    fontWeight: 500,
    color: C.faint,
    padding: '28px 20px 8px',
  },

  muted: { fontSize: 14, color: C.muted },
  empty: {
    textAlign: 'center',
    color: C.faint,
    padding: '72px 32px',
    fontSize: 15,
    lineHeight: 1.6,
  },
}

export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(iso, locale = 'en-US') {
  return parseDate(iso).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function shortDate(iso, locale = 'en-US') {
  return parseDate(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

export function weekday(iso, locale = 'en-US') {
  return parseDate(iso).toLocaleDateString(locale, { weekday: 'long' })
}

export function daysUntil(iso) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((parseDate(iso) - today) / 86400000)
}

export function relative(iso, t) {
  const days = daysUntil(iso)
  if (days === 0) return t.today
  if (days === 1) return t.tomorrow
  return t.inDays(days)
}