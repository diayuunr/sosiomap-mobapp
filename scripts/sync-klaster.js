const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'

async function supabaseGet(endpoint) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  return await res.json()
}

async function upsertKlaster(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/klaster_wilayah`, {
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

async function syncKlaster() {
  console.log('Mulai klasterisasi wilayah...')

  // Ambil semua wilayah kecamatan
  const wilayah = await supabaseGet('wilayah?tipe=in.(kecamatan,kabupaten_kota)&select=id,nama,tipe')
  console.log(`Total wilayah: ${wilayah.length}`)

  const periode = ['2022', '2023', '2024']
  const rows = []

  for (const w of wilayah) {
    for (const p of periode) {
      // Ambil wajib pajak di wilayah ini
      const wp = await supabaseGet(`wajib_pajak?wilayah_id=eq.${w.id}&select=id`)
      if (wp.length === 0) continue

      const wpIds = wp.map(x => x.id)

      // Ambil kepatuhan periode ini
      let totalLunas = 0
      let totalData = 0

      for (const wpId of wpIds) {
        const kepatuhan = await supabaseGet(
          `kepatuhan_pajak?wajib_pajak_id=eq.${wpId}&periode=eq.${p}&select=status_bayar,nilai_tunggakan`
        )
        for (const k of kepatuhan) {
          totalData++
          if (k.status_bayar === 'lunas') totalLunas++
        }
      }

      if (totalData === 0) continue

      const persentase = (totalLunas / totalData) * 100

      let klasterLabel = ''
      let skorRisiko = 0

      if (persentase >= 75) {
        klasterLabel = 'Hijau'
        skorRisiko = 1
      } else if (persentase >= 50) {
        klasterLabel = 'Kuning'
        skorRisiko = 2
      } else {
        klasterLabel = 'Merah'
        skorRisiko = 3
      }

      rows.push({
        wilayah_id: w.id,
        periode: p,
        klaster_label: klasterLabel,
        skor_risiko: skorRisiko
      })

      console.log(`${w.nama} (${p}): ${persentase.toFixed(1)}% lunas → ${klasterLabel}`)
    }
  }

  await upsertKlaster(rows)
  console.log('\nKlasterisasi selesai!')
}

syncKlaster()