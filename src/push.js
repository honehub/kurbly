import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { supabase, ORG_ID } from './supabase'

let registered = false

// Registers this device for push reminders. Safe to call on every app open.
export async function registerForPush(lat, lng, reminderHour = 19) {
  if (!Capacitor.isNativePlatform()) return 'unsupported'
  if (registered) return 'already'

  let perm = await PushNotifications.checkPermissions()
  if (perm.receive !== 'granted') {
    perm = await PushNotifications.requestPermissions()
  }
  if (perm.receive !== 'granted') return 'denied'

  return new Promise((resolve) => {
    const done = (result) => {
      registered = true
      resolve(result)
    }

    PushNotifications.addListener('registration', async (token) => {
      try {
        const { error } = await supabase.rpc('register_push_device', {
          input_organization_id: ORG_ID,
          input_token: token.value,
          input_platform: Capacitor.getPlatform(),
          input_lat: lat,
          input_lng: lng,
          input_reminder_hour: reminderHour,
        })
        done(error ? 'save-failed' : 'registered')
      } catch {
        done('save-failed')
      }
    })

    PushNotifications.addListener('registrationError', () => {
      done('failed')
    })

    PushNotifications.register()

    // Don't hang forever if neither listener fires
    setTimeout(() => done('timeout'), 15000)
  })
}