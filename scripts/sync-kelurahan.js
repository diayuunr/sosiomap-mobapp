const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'
const SIMPBB_BASE = 'https://simpbb.technosmart.id/api/rpc'

async function simpbb(endpoint, body) {
  const res = await fetch(`${SIMPBB_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: body })
  })
  const data = await res.json()
  return data.json
}

async function getWilayahId(nama) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/wilayah?nama=eq.${encodeURIComponent(nama)}&select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  const data = await res.json()
  return data[0]?.id || null
}

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
}

async function syncKelurahan() {
  console.log('Mulai sync kelurahan...')

  const kecamatanList = [
    { nama: 'DENPASAR SELATAN', kdKecamatan: '010' },
    { nama: 'DENPASAR TIMUR', kdKecamatan: '020' },
  ]

  for (const kec of kecamatanList) {
    const kecId = await getWilayahId(kec.nama)
    if (!kecId) {
      console.log(`${kec.nama} tidak ditemukan, skip`)
      continue
    }

    const kelurahan = await simpbb('wilayah/listKelurahan', {
      kdPropinsi: '51',
      kdDati2: '71',
      kdKecamatan: kec.kdKecamatan
    })

    const rows = kelurahan.map(k => ({
      nama: k.nmKelurahan,
      tipe: 'kelurahan',
      parent_id: kecId
    }))

    await upsertWilayah(rows)
    console.log(`${kec.nama}: ${rows.length} kelurahan dimasukkan`)
  }

  // Kuta (Kabupaten Badung)
  const kutaId = await getWilayahId('KUTA')
  if (kutaId) {
    const kelurahan = await simpbb('wilayah/listKelurahan', {
      kdPropinsi: '51',
      kdDati2: '72',
      kdKecamatan: '010'
    })

    const rows = kelurahan.map(k => ({
      nama: k.nmKelurahan,
      tipe: 'kelurahan',
      parent_id: kutaId
    }))

    await upsertWilayah(rows)
    console.log(`KUTA: ${rows.length} kelurahan dimasukkan`)
  }

  console.log('\nSync kelurahan selesai!')
}

syncKelurahan()