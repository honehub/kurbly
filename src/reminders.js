import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { supabase, ORG_ID } from './supabase'

// Schedules a reminder at 7 PM the evening before each pickup,
// for roughly the next six weeks. Safe to call every time the app opens.
export async function scheduleReminders(lat, lng, hour = 19) {
  if (!Capacitor.isNativePlatform()) return 'unsupported'

  let perm = await LocalNotifications.checkPermissions()
  if (perm.display !== 'granted') {
    perm = await LocalNotifications.requestPermissions()
  }
  if (perm.display !== 'granted') return 'denied'

  const { data, error } = await supabase.rpc('get_resident_schedule', {
    input_organization_id: ORG_ID,
    input_lat: lat,
    input_lng: lng,
    input_days_ahead: 120,
  })
  if (error) throw error

  // Group services that share a pickup date into one reminder
  const byDate = new Map()
  for (const row of data || []) {
    if (!byDate.has(row.pickup_date)) byDate.set(row.pickup_date, [])
    byDate.get(row.pickup_date).push(row.service_name)
  }

  // Clear old reminders so we don't double up
  const pending = await LocalNotifications.getPending()
  if (pending.notifications.length) {
    await LocalNotifications.cancel({
      notifications: pending.notifications.map((n) => ({ id: n.id })),
    })
  }

  const now = new Date()
  const notifications = []
  for (const [date, names] of byDate) {
    const [y, m, d] = date.split('-').map(Number)
    const at = new Date(y, m - 1, d - 1, hour, 0, 0)
    if (at <= now) continue
    notifications.push({
      id: y * 10000 + m * 100 + d,
      title: 'Pickup tomorrow',
      body: `${joinNames(names)} — roll your cart to the curb tonight.`,
      schedule: { at, allowWhileIdle: true },
    })
  }

  if (notifications.length) {
    await LocalNotifications.schedule({ notifications })
  }
  return notifications.length
}

// Fires one notification a minute from now, for testing
export async function testReminder() {
  if (!Capacitor.isNativePlatform()) return 'unsupported'
  const perm = await LocalNotifications.requestPermissions()
  if (perm.display !== 'granted') return 'denied'
  await LocalNotifications.schedule({
    notifications: [{
      id: 1,
      title: 'Kurbly test',
      body: 'Reminders are working.',
      schedule: { at: new Date(Date.now() + 60 * 1000), allowWhileIdle: true },
    }],
  })
  return 'scheduled'
}

function joinNames(names) {
  if (names.length === 1) return names[0]
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]
}