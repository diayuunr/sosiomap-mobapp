const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'
const SIMPBB_BASE = 'https://simpbb.technosmart.id/api/rpc'

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

async function getSemuaWajibPajak() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/wajib_pajak?select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  return await res.json()
}

async function upsertKepatuhan(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/kepatuhan_pajak`, {
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

async function syncKepatuhan() {
  console.log('Mulai sync kepatuhan pajak...')

  const wajibPajak = await getSemuaWajibPajak()
  console.log(`Total wajib pajak: ${wajibPajak.length}`)

  const periode = ['2022', '2023', '2024']
  const rows = []

  for (const wp of wajibPajak) {
    for (const p of periode) {
      const statusBayar = random(['lunas', 'lunas', 'lunas', 'belum_lunas']) // 75% lunas
      const nilaiTunggakan = statusBayar === 'lunas' ? 0 : Math.floor(Math.random() * 5000000) + 100000

      rows.push({
        wajib_pajak_id: wp.id,
        periode: p,
        status_bayar: statusBayar,
        nilai_tunggakan: nilaiTunggakan
      })
    }
  }

  // Insert per batch 50
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50)
    await upsertKepatuhan(batch)
    console.log(`Batch ${i / 50 + 1} selesai (${batch.length} rows)`)
  }

  console.log('\nSync kepatuhan selesai!')
}

syncKepatuhan()