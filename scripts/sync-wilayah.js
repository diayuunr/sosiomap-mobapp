const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'
const SIMPBB_BASE = 'https://simpbb.technosmart.id/api/rpc'

// Helper: hit SIMPBB API
async function simpbb(endpoint, body) {
  const res = await fetch(`${SIMPBB_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: body })
  })
  const data = await res.json()
  return data.json
}

// Helper: insert ke Supabase
async function upsertWilayah(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/wilayah`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(rows)
  })
  const text = await res.text()
  console.log('Supabase response:', res.status, text)
  return res.status
}

async function syncWilayah() {
  console.log('Mulai sync wilayah...')

  // 1. Ambil provinsi
  const provinsi = await simpbb('wilayah/listPropinsi', {})
  for (const prov of provinsi) {
    await upsertWilayah([{
      nama: prov.nmPropinsi,
      tipe: 'provinsi',
      parent_id: null
    }])
    console.log(`Provinsi: ${prov.nmPropinsi}`)

    // 2. Ambil kabupaten/kota
    const dati2 = await simpbb('wilayah/listDati2', { kdPropinsi: prov.kdPropinsi })
    for (const kota of dati2) {
      await upsertWilayah([{
        nama: kota.nmDati2,
        tipe: 'kabupaten_kota',
        parent_id: null
      }])
      console.log(`Kota: ${kota.nmDati2}`)

      // 3. Ambil kecamatan
      const kecamatan = await simpbb('wilayah/listKecamatan', {
        kdPropinsi: prov.kdPropinsi,
        kdDati2: kota.kdDati2
      })
      for (const kec of kecamatan) {
        await upsertWilayah([{
          nama: kec.nmKecamatan,
          tipe: 'kecamatan',
          parent_id: null
        }])
        console.log(`Kecamatan: ${kec.nmKecamatan}`)
      }
    }
  }

  console.log('Sync selesai!')
}

syncWilayah()