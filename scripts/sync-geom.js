const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'

const WILAYAH_QUERY = [
  { nama: 'DENPASAR SELATAN', query: 'Denpasar Selatan, Bali' },
  { nama: 'DENPASAR TIMUR', query: 'Denpasar Timur, Bali' },
  { nama: 'KUTA', query: 'Kuta, Badung, Bali' },
  { nama: 'DENPASAR', query: 'Denpasar, Bali' },
  { nama: 'BADUNG', query: 'Badung, Bali' },
  { nama: 'BALI', query: 'Bali, Indonesia' },
  { nama: 'SIDAKARYA', query: 'Sidakarya, Denpasar Selatan, Bali' },
  { nama: 'SESETAN', query: 'Sesetan, Denpasar Selatan, Bali' },
  { nama: 'DANGIN PURI', query: 'Dangin Puri, Denpasar Timur, Bali' },
  { nama: 'SUMERTA', query: 'Sumerta, Denpasar Timur, Bali' },
  { nama: 'TUBAN', query: 'Tuban, Kuta, Badung, Bali' },
  { nama: 'LEGIAN', query: 'Legian, Kuta, Badung, Bali' },
]

async function getGeoJSON(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=geojson&polygon_geojson=1&limit=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SosioMap/1.0' }
  })
  const data = await res.json()
  if (data.features.length === 0) return null
  return data.features[0].geometry
}

async function updateGeom(nama, geom) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/wilayah?nama=eq.${encodeURIComponent(nama)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({ geom })
  })
  return res.status
}

async function syncGeom() {
  console.log('Mulai sync geom...')

  for (const w of WILAYAH_QUERY) {
    console.log(`Fetching: ${w.nama}`)
    const geom = await getGeoJSON(w.query)

    if (!geom) {
      console.log(`Tidak ditemukan, skip`)
      continue
    }

    const status = await updateGeom(w.nama, geom)
    console.log(`Status: ${status}`)

    // Delay biar nggak kena rate limit OpenStreetMap
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log('\nSync geom selesai!')
}

syncGeom()