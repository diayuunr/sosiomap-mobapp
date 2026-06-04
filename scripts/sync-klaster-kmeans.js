const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'

async function supabaseGet(endpoint) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
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
      'Prefer': 'resolution=merge-duplicates,on-conflict=wilayah_id,periode'
    },
    body: JSON.stringify(rows)
  })
  const text = await res.text()
  console.log('Supabase response:', res.status)
}

// K-Means algorithm
function kMeans(data, k = 3, maxIter = 100) {
  // data = array of { id, nilai } where nilai is array of features
  let centroids = data.slice(0, k).map(d => [...d.nilai])

  let assignments = new Array(data.length).fill(0)

  for (let iter = 0; iter < maxIter; iter++) {
    // Assign each point to nearest centroid
    let changed = false
    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity
      let minIdx = 0
      for (let j = 0; j < k; j++) {
        const dist = euclidean(data[i].nilai, centroids[j])
        if (dist < minDist) {
          minDist = dist
          minIdx = j
        }
      }
      if (assignments[i] !== minIdx) {
        assignments[i] = minIdx
        changed = true
      }
    }

    if (!changed) break

    // Update centroids
    for (let j = 0; j < k; j++) {
      const members = data.filter((_, i) => assignments[i] === j)
      if (members.length === 0) continue
      centroids[j] = data[0].nilai.map((_, fi) =>
        members.reduce((sum, d) => sum + d.nilai[fi], 0) / members.length
      )
    }
  }

  return assignments
}

function euclidean(a, b) {
  return Math.sqrt(a.reduce((sum, ai, i) => sum + Math.pow(ai - b[i], 2), 0))
}

function normalize(values) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (max === min) return values.map(() => 0)
  return values.map(v => (v - min) / (max - min))
}

async function syncKlasterKMeans() {
  console.log('Mulai K-Means klasterisasi...')

  const periode = ['2022', '2023', '2024']
  const wilayah = await supabaseGet('wilayah?tipe=in.(kelurahan,kecamatan)&select=id,nama,tipe')

  console.log(`Total wilayah: ${wilayah.length}`)

  for (const p of periode) {
    console.log(`\nPeriode: ${p}`)

    const dataPoints = []

    for (const w of wilayah) {
      const wp = await supabaseGet(`wajib_pajak?wilayah_id=eq.${w.id}&select=id`)
      if (wp.length === 0) continue

      let totalLunas = 0
      let totalTunggakan = 0
      let totalData = 0

      for (const wpItem of wp) {
        const kepatuhan = await supabaseGet(
          `kepatuhan_pajak?wajib_pajak_id=eq.${wpItem.id}&periode=eq.${p}&select=status_bayar,nilai_tunggakan`
        )
        for (const k of kepatuhan) {
          totalData++
          if (k.status_bayar === 'lunas') totalLunas++
          totalTunggakan += k.nilai_tunggakan || 0
        }
      }

      if (totalData === 0) continue

      const persentaseKepatuhan = (totalLunas / totalData) * 100
      const rataRataTunggakan = totalTunggakan / totalData

      dataPoints.push({
        id: w.id,
        nama: w.nama,
        nilai: [persentaseKepatuhan, rataRataTunggakan]
      })
    }

    if (dataPoints.length < 3) continue

    // Normalize fitur
    const kepatuhanValues = normalize(dataPoints.map(d => d.nilai[0]))
    const tunggakanValues = normalize(dataPoints.map(d => d.nilai[1]))
    const normalizedData = dataPoints.map((d, i) => ({
      ...d,
      nilai: [kepatuhanValues[i], tunggakanValues[i]]
    }))

    // Jalankan K-Means
    const assignments = kMeans(normalizedData, 3)

    // Tentukan label klaster berdasarkan rata-rata kepatuhan
    const clusterStats = [0, 1, 2].map(c => {
      const members = dataPoints.filter((_, i) => assignments[i] === c)
      if (members.length === 0) return { avg: 0 }
      return { avg: members.reduce((s, d) => s + d.nilai[0], 0) / members.length }
    })

    // Sort: klaster dengan kepatuhan tertinggi = Hijau
    const sorted = [0, 1, 2].sort((a, b) => clusterStats[b].avg - clusterStats[a].avg)
    const labelMap = { [sorted[0]]: 'Hijau', [sorted[1]]: 'Kuning', [sorted[2]]: 'Merah' }
    const skorMap = { [sorted[0]]: 1, [sorted[1]]: 2, [sorted[2]]: 3 }

    const rows = dataPoints.map((d, i) => ({
      wilayah_id: d.id,
      periode: p,
      klaster_label: labelMap[assignments[i]],
      skor_risiko: skorMap[assignments[i]]
    }))

    await upsertKlaster(rows)

    // Log hasil
    rows.forEach(r => {
      const d = dataPoints.find(x => x.id === r.wilayah_id)
      console.log(`  ${d.nama}: ${d.nilai[0].toFixed(1)}% lunas → ${r.klaster_label}`)
    })
  }

  // Hitung klaster kecamatan yg WP-nya di kelurahan + kabupaten + provinsi
  console.log('\nHitung klaster agregat (kecamatan tanpa WP, kabupaten, provinsi)...')
  const allWilayah = await supabaseGet('wilayah?select=id,nama,tipe,parent_id')

  const tipeAgregat = ['kecamatan', 'kabupaten_kota', 'provinsi']
  for (const p of periode) {
    for (const tipe of tipeAgregat) {
      const targets = allWilayah.filter(w => w.tipe === tipe)
      const agregRows = []

      for (const t of targets) {
        const children = await supabaseGet(
          `klaster_wilayah?periode=eq.${p}&select=skor_risiko,wilayah_id,wilayah(parent_id)`
        )
        const childrenOfParent = children.filter(c => c.wilayah?.parent_id === t.id)
        if (childrenOfParent.length === 0) continue

        const avgSkor = childrenOfParent.reduce((sum, c) => sum + c.skor_risiko, 0) / childrenOfParent.length
        const skorRisiko = Math.round(avgSkor)
        const klasterLabel = skorRisiko === 1 ? 'Hijau' : skorRisiko === 2 ? 'Kuning' : 'Merah'

        agregRows.push({ wilayah_id: t.id, periode: p, klaster_label: klasterLabel, skor_risiko: skorRisiko })
        console.log(`  ${t.nama} (${p}): avg ${avgSkor.toFixed(1)} → ${klasterLabel}`)
      }

      if (agregRows.length > 0) await upsertKlaster(agregRows)
    }
  }

  console.log('\nK-Means klasterisasi selesai!')
}

syncKlasterKMeans()