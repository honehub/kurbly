import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { supabase, ORG_ID } from './supabase'

let registered = false
let deviceToken = null

export function getDeviceToken() {
  return deviceToken || localStorage.getItem('pushToken')
}

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
      deviceToken = token.value
      localStorage.setItem('pushToken', token.value)
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

export async function loadPreferences() {
  const token = getDeviceToken()
  if (!token) return null
  const { data, error } = await supabase.rpc('get_push_preferences', {
    input_token: token,
  })
  if (error) return null
  return data?.[0] ?? null
}

export async function savePreferences(prefs) {
  const token = getDeviceToken()
  if (!token) return false
  const { error } = await supabase.rpc('update_push_preferences', {
    input_token: token,
    input_enabled: prefs.enabled,
    input_timing: prefs.timing,
    input_hour: prefs.hour,
    input_minute: prefs.minute ?? 0,
    input_categories: prefs.categories,
    input_language: prefs.language,
  })
  return !error
}