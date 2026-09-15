import { useState } from 'react'
import { getNextCollections } from './supabase'

export default function App() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function test() {
    setError(null)
    setResult(null)
    try {
      const data = await getNextCollections(31.44, -100.45)
      setResult(data)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>TrashDay</h1>
      <button onClick={test}>Test Supabase connection</button>
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}