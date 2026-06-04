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
      'Prefer': 'resolution=merge-duplicates,on-conflict=wilayah_id,periode'},
    body: JSON.stringify(rows)
  })
  const text = await res.text()
  console.log('Supabase response:', res.status, text)
}

async function syncKlaster() {
  console.log('Mulai klasterisasi wilayah...')

  const wilayah = await supabaseGet('wilayah?select=id,nama,tipe')
  console.log(`Total wilayah: ${wilayah.length}`)

  const periode = ['2022', '2023', '2024']
  const rows = []

  // Klaster kecamatan & kelurahan (dari data wajib pajak)
  for (const w of wilayah) {
    if (!['kecamatan', 'kelurahan'].includes(w.tipe)) continue

    for (const p of periode) {
      const wp = await supabaseGet(`wajib_pajak?wilayah_id=eq.${w.id}&select=id`)
      if (wp.length === 0) continue

      let totalLunas = 0
      let totalData = 0

      for (const wpId of wp.map(x => x.id)) {
        const kepatuhan = await supabaseGet(
          `kepatuhan_pajak?wajib_pajak_id=eq.${wpId}&periode=eq.${p}&select=status_bayar`
        )
        for (const k of kepatuhan) {
          totalData++
          if (k.status_bayar === 'lunas') totalLunas++
        }
      }

      if (totalData === 0) continue

      const persentase = (totalLunas / totalData) * 100
      const klasterLabel = persentase >= 75 ? 'Hijau' : persentase >= 50 ? 'Kuning' : 'Merah'
      const skorRisiko = persentase >= 75 ? 1 : persentase >= 50 ? 2 : 3

      rows.push({ wilayah_id: w.id, periode: p, klaster_label: klasterLabel, skor_risiko: skorRisiko })
      console.log(`${w.nama} (${p}): ${persentase.toFixed(1)}% lunas → ${klasterLabel}`)
    }
  }

  // Insert dulu kecamatan & kelurahan
  await upsertKlaster(rows)

  // Klaster kabupaten/kota & provinsi (rata-rata dari anak wilayah)
  const parentWilayah = wilayah.filter(w => ['kabupaten_kota', 'provinsi', 'kecamatan'].includes(w.tipe) && w.nama === 'KUTA')
  .concat(wilayah.filter(w => ['kabupaten_kota', 'provinsi'].includes(w.tipe)))  
  const parentRows = []

  for (const parent of parentWilayah) {
    for (const p of periode) {
      const children = await supabaseGet(
        `klaster_wilayah?periode=eq.${p}&select=skor_risiko,wilayah_id,wilayah(parent_id)`
      )

      const childrenOfParent = children.filter(c => c.wilayah?.parent_id === parent.id)
      if (childrenOfParent.length === 0) continue

      const avgSkor = childrenOfParent.reduce((sum, c) => sum + c.skor_risiko, 0) / childrenOfParent.length
      const skorRisiko = Math.round(avgSkor)
      const klasterLabel = skorRisiko === 1 ? 'Hijau' : skorRisiko === 2 ? 'Kuning' : 'Merah'

      parentRows.push({ wilayah_id: parent.id, periode: p, klaster_label: klasterLabel, skor_risiko: skorRisiko })
      console.log(`${parent.nama} (${p}): avg skor ${avgSkor.toFixed(1)} → ${klasterLabel}`)
    }
  }

  await upsertKlaster(parentRows)
  console.log('\nKlasterisasi selesai!')
}

syncKlaster()