import { createClient } from '@supabase/supabase-js'

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