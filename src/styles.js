import { Trash2, Recycle, Truck } from 'lucide-react'

export const S = {
  page: {
    minHeight: '100vh',
    background: '#f4f5f7',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '24px 16px 96px',
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
  muted: { fontSize: 14, color: '#6b7280' },
  empty: { textAlign: 'center', color: '#9ca3af', padding: '40px 20px', fontSize: 15 },
}

export const ICONS = { trash: Trash2, recycle: Recycle, truck: Truck }

export function tint(hex) {
  return hex + '1a'
}

export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(iso, locale) {
  return parseDate(iso).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function relative(iso) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.round((parseDate(iso) - today) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}