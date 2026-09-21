import { createClient } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const ORG_ID = '0ad4df8a-f79a-4229-9c61-f942f751c313'

export async function getNextCollections(lat, lng) {
  const { data, error } = await supabase.rpc('get_next_collections', {
    input_organization_id: ORG_ID,
    input_lat: lat,
    input_lng: lng,
  })
  if (error) throw error
  return data
}

export async function geocodeAddress(address) {
  const base = Capacitor.isNativePlatform()
    ? 'https://geocoding.geo.census.gov/geocoder'
    : window.location.origin + '/geocode'

  const url = new URL(base + '/locations/onelineaddress')
  url.searchParams.set('address', address)
  url.searchParams.set('benchmark', 'Public_AR_Current')
  url.searchParams.set('format', 'json')

  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocoding service unavailable')

  const json = await res.json()
  const match = json.result?.addressMatches?.[0]
  if (!match) return null

  return {
    lat: match.coordinates.y,
    lng: match.coordinates.x,
    matched: match.matchedAddress,
  }
}

export async function getOrganization() {
  const { data, error } = await supabase.rpc('get_public_organization', {
    input_organization_id: ORG_ID,
  })
  if (error) throw error
  return data?.[0] ?? null
}