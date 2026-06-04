const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'

async function checkGianyarGeom() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/wilayah?id=eq.b8a91190-e176-43c0-a293-0eeb06c9c093&select=geom`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  })
  const data = await res.json()
  const geom = JSON.parse(data[0].geom)
  
  console.log('Type:', geom.type)
  console.log('Coordinates arrays:', geom.coordinates.length)
  console.log('Total koordinat:', geom.coordinates[0].length)
  
  const allCoords = geom.coordinates[0]
  const maxLng = Math.max(...allCoords.map(c => c[0]))
  const minLat = Math.min(...allCoords.map(c => c[1]))
  console.log('Max longitude:', maxLng)
  console.log('Min latitude:', minLat)
}

checkGianyarGeom()