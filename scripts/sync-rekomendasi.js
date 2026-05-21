const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'

const RULES = {
  'Pensiunan': {
    teks: 'Berikan opsi cicilan atau keringanan pajak untuk kelompok pensiunan.',
    prioritas: 2
  },
  'UMKM': {
    teks: 'Berikan diskon denda untuk mendorong kepatuhan UMKM.',
    prioritas: 2
  },
  'Wirausaha': {
    teks: 'Lakukan audit dan monitoring intensif untuk kelompok wirausaha.',
    prioritas: 3
  },
  'Pegawai Negeri': {
    teks: 'Lakukan monitoring rutin kepatuhan pembayaran pajak.',
    prioritas: 1
  }
}

async function supabaseGet(endpoint) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  return await res.json()
}

async function upsertRekomendasi(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rekomendasi`, {
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

async function syncRekomendasi() {
  console.log('Mulai generate rekomendasi...')

  const wilayah = await supabaseGet('wilayah?tipe=eq.kecamatan&select=id,nama')
  const rows = []

  for (const w of wilayah) {
    // Cek klaster terbaru (2024)
    const klaster = await supabaseGet(
      `klaster_wilayah?wilayah_id=eq.${w.id}&periode=eq.2024&select=klaster_label,skor_risiko`
    )

    const klasterLabel = klaster[0]?.klaster_label || 'Hijau'
    const skorRisiko = klaster[0]?.skor_risiko || 1

    // Rekomendasi per kelompok ekonomi
    for (const [kelompok, rule] of Object.entries(RULES)) {
      let teks = rule.teks
      let prioritas = rule.prioritas

      // Kalau wilayah risiko tinggi, naikkan prioritas
      if (klasterLabel === 'Merah') {
        teks += ' Wilayah ini termasuk risiko tinggi — prioritaskan penagihan segera.'
        prioritas = 3
      }

      rows.push({
        wilayah_id: w.id,
        kelompok: kelompok,
        rekomendasi_teks: teks,
        prioritas: prioritas
      })
    }

    console.log(`${w.nama} (${klasterLabel}) — ${Object.keys(RULES).length} rekomendasi dibuat`)
  }

  await upsertRekomendasi(rows)
  console.log('\nRekomendasi selesai!')
}

syncRekomendasi()