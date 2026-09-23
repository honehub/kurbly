import { Calendar, Megaphone, Camera, Settings } from 'lucide-react'

export default function BottomNav({ tab, setTab, accent, alertCount = 0 }) {
  const tabs = [
    { id: 'home', label: 'Schedule', Icon: Calendar },
    { id: 'alerts', label: 'Alerts', Icon: Megaphone, badge: alertCount },
    { id: 'report', label: 'Report', Icon: Camera },
    { id: 'settings', label: 'Settings', Icon: Settings },
  ]

  return (
    <nav style={bar}>
      <div style={inner}>
        {tabs.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...item,
                color: active ? accent : '#9ca3af',
                fontWeight: active ? 600 : 500,
              }}
            >
              <span style={iconWrap}>
                <t.Icon size={21} strokeWidth={active ? 2.2 : 1.8} />
                {t.badge > 0 && <span style={badge}>{t.badge}</span>}
              </span>
              <span style={{ fontSize: 11 }}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

const bar = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: '#fff',
  borderTop: '1px solid #e5e7eb',
  paddingBottom: 'env(safe-area-inset-bottom)',
  zIndex: 1000,
}

const inner = {
  maxWidth: 440,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
}

const item = {
  background: 'none',
  border: 'none',
  padding: '10px 4px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const iconWrap = {
  position: 'relative',
  fontSize: 20,
  lineHeight: 1,
}

const badge = {
  position: 'absolute',
  top: -4,
  right: -8,
  background: '#dc2626',
  color: '#fff',
  fontSize: 10,
  fontWeight: 700,
  minWidth: 16,
  height: 16,
  borderRadius: 8,
  display: 'grid',
  placeItems: 'center',
  padding: '0 4px',
}