const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'
const SIMPBB_BASE = 'https://simpbb.technosmart.id/api/rpc'

const KELOMPOK_EKONOMI = ['Pensiunan', 'UMKM', 'Wirausaha', 'Pegawai Negeri']
const USIA_RANGE = ['20-30', '31-40', '41-50', '51-60', '61+']

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function simpbb(endpoint, body) {
  const res = await fetch(`${SIMPBB_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: body })
  })
  const data = await res.json()
  return data.json
}

async function getWilayahId(nmKecamatan) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/wilayah?nama=eq.${encodeURIComponent(nmKecamatan)}&select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  const data = await res.json()
  return data[0]?.id || null
}

async function upsertWajibPajak(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/wajib_pajak`, {
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

async function syncWajibPajak() {
  console.log('Mulai sync wajib pajak...')

  // Ambil semua kecamatan di Denpasar
  const kecamatan = await simpbb('wilayah/listKecamatan', {
    kdPropinsi: '51',
    kdDati2: '71'
  })

  for (const kec of kecamatan) {
    console.log(`\n Kecamatan: ${kec.nmKecamatan}`)

    // Ambil wilayah_id dari Supabase
    const wilayahId = await getWilayahId(kec.nmKecamatan)
    if (!wilayahId) {
      console.log(`wilayah_id tidak ditemukan, skip`)
      continue
    }

    // Ambil data wajib pajak dari SIMPBB
    const result = await simpbb('objekPajak/listDetails', {
      kdPropinsi: '51',
      kdDati2: '71',
      kdKecamatan: kec.kdKecamatan,
      limit: 100,
      offset: 0
    })

    const rows = result.rows.map(() => ({
      wilayah_id: wilayahId,
      kelompok_ekonomi: random(KELOMPOK_EKONOMI),
      usia_range: random(USIA_RANGE),
      status_aktif: true
    }))

    await upsertWajibPajak(rows)
    console.log(`${rows.length} wajib pajak dimasukkan`)
  }

  console.log('\n Sync selesai!')
}

syncWajibPajak()