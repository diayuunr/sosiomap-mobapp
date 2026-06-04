const SUPABASE_URL = 'https://ebfyrbnxrlyobzssgyot.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74'

const KELOMPOK_EKONOMI = ['Pensiunan', 'UMKM', 'Wirausaha', 'Pegawai Negeri']
const USIA_RANGE = ['20-30', '31-40', '41-50', '51-60', '61+']

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Data mockup wilayah Bali
const MOCKUP_WILAYAH = [
  {
    kabupaten: 'KABUPATEN BANGLI',
    klaster: 'Merah',
    kecamatan: [
      { nama: 'BANGLI', kelurahan: ['CEMPAGA', 'KUBU'] },
      { nama: 'KINTAMANI', kelurahan: ['BATUR', 'KEDISAN'] },
    ]
  },
  {
    kabupaten: 'KABUPATEN BULELENG',
    klaster: 'Kuning',
    kecamatan: [
      { nama: 'SINGARAJA', kelurahan: ['BANYUNING', 'ASTINA'] },
      { nama: 'SERIRIT', kelurahan: ['LOKAPAKSA', 'PENGASTULAN'] },
    ]
  },
  {
    kabupaten: 'KABUPATEN GIANYAR',
    klaster: 'Hijau',
    kecamatan: [
      { nama: 'GIANYAR', kelurahan: ['GIANYAR', 'BITERA'] },
      { nama: 'UBUD', kelurahan: ['UBUD', 'PELIATAN'] },
    ]
  },
  {
    kabupaten: 'KABUPATEN JEMBRANA',
    klaster: 'Merah',
    kecamatan: [
      { nama: 'NEGARA', kelurahan: ['LELATENG', 'BALER BALE AGUNG'] },
      { nama: 'MELAYA', kelurahan: ['MELAYA', 'TUKADAYA'] },
    ]
  },
  {
    kabupaten: 'KABUPATEN KARANGASEM',
    klaster: 'Kuning',
    kecamatan: [
      { nama: 'AMLAPURA', kelurahan: ['KARANGASEM', 'SUBAGAN'] },
      { nama: 'RENDANG', kelurahan: ['RENDANG', 'PEMPATAN'] },
    ]
  },
  {
    kabupaten: 'KABUPATEN KLUNGKUNG',
    klaster: 'Hijau',
    kecamatan: [
      { nama: 'KLUNGKUNG', kelurahan: ['SEMARAPURA TENGAH', 'SEMARAPURA KANGIN'] },
      { nama: 'NUSA PENIDA', kelurahan: ['BATUNUNGGUL', 'PED'] },
    ]
  },
  {
    kabupaten: 'KABUPATEN TABANAN',
    klaster: 'Merah',
    kecamatan: [
      { nama: 'TABANAN', kelurahan: ['DELOD PEKEN', 'DAUH PEKEN'] },
      { nama: 'KEDIRI', kelurahan: ['KEDIRI', 'BELALANG'] },
    ]
  },
]

const KLASTER_CONFIG = {
  'Hijau': { label: 'Hijau', skor: 1, statusRatio: [0.8, 0.2] },  // 80% lunas
  'Kuning': { label: 'Kuning', skor: 2, statusRatio: [0.6, 0.4] }, // 60% lunas
  'Merah': { label: 'Merah', skor: 3, statusRatio: [0.3, 0.7] },   // 30% lunas
}

const RULES = {
  'Pensiunan': { teks: 'Berikan opsi cicilan atau keringanan pajak untuk kelompok pensiunan.', prioritas: 2 },
  'UMKM': { teks: 'Berikan diskon denda untuk mendorong kepatuhan UMKM.', prioritas: 2 },
  'Wirausaha': { teks: 'Lakukan audit dan monitoring intensif untuk kelompok wirausaha.', prioritas: 3 },
  'Pegawai Negeri': { teks: 'Lakukan monitoring rutin kepatuhan pembayaran pajak.', prioritas: 1 }
}

async function supabasePost(endpoint, rows, method = 'POST') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(rows)
  })
  return res.status
}

async function supabaseGet(endpoint) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  })
  return await res.json()
}

async function getIdByNama(nama) {
  const data = await supabaseGet(`wilayah?nama=eq.${encodeURIComponent(nama)}&select=id`)
  return data[0]?.id || null
}

async function seedMockup() {
  console.log('Mulai seed mockup wilayah Bali...')

  const baliId = await getIdByNama('BALI')
  const periode = ['2022', '2023', '2024']

  for (const w of MOCKUP_WILAYAH) {
    console.log(`\n${w.kabupaten}`)
    const config = KLASTER_CONFIG[w.klaster]

    // 1. Insert kabupaten
    await supabasePost('wilayah', [{ nama: w.kabupaten, tipe: 'kabupaten_kota', parent_id: baliId }])
    const kabId = await getIdByNama(w.kabupaten)

    // Klaster kabupaten
    for (const p of periode) {
      await supabasePost('klaster_wilayah', [{ wilayah_id: kabId, periode: p, klaster_label: config.label, skor_risiko: config.skor }])
    }

    for (const kec of w.kecamatan) {
      // 2. Insert kecamatan
      await supabasePost('wilayah', [{ nama: kec.nama, tipe: 'kecamatan', parent_id: kabId }])
      const kecId = await getIdByNama(kec.nama)

      // Klaster kecamatan
      for (const p of periode) {
        await supabasePost('klaster_wilayah', [{ wilayah_id: kecId, periode: p, klaster_label: config.label, skor_risiko: config.skor }])
      }

      for (const kel of kec.kelurahan) {
        // 3. Insert kelurahan
        await supabasePost('wilayah', [{ nama: kel, tipe: 'kelurahan', parent_id: kecId }])
        const kelId = await getIdByNama(kel)

        // Klaster kelurahan
        for (const p of periode) {
          await supabasePost('klaster_wilayah', [{ wilayah_id: kelId, periode: p, klaster_label: config.label, skor_risiko: config.skor }])
        }

        // 4. Insert wajib pajak (10 per kelurahan)
        const wpRows = Array.from({ length: 10 }, () => ({
          wilayah_id: kelId,
          kelompok_ekonomi: random(KELOMPOK_EKONOMI),
          usia_range: random(USIA_RANGE),
          status_aktif: true
        }))
        await supabasePost('wajib_pajak', wpRows)

        const wpData = await supabaseGet(`wajib_pajak?wilayah_id=eq.${kelId}&select=id`)

        // 5. Insert kepatuhan
        const kepatuhanRows = []
        for (const wp of wpData) {
          for (const p of periode) {
            const lunas = Math.random() < config.statusRatio[0]
            kepatuhanRows.push({
              wajib_pajak_id: wp.id,
              periode: p,
              status_bayar: lunas ? 'lunas' : 'belum_lunas',
              nilai_tunggakan: lunas ? 0 : Math.floor(Math.random() * 5000000) + 100000
            })
          }
        }
        await supabasePost('kepatuhan_pajak', kepatuhanRows)

        // 6. Insert rekomendasi
        const rekRows = Object.entries(RULES).map(([kelompok, rule]) => ({
          wilayah_id: kelId,
          kelompok,
          rekomendasi_teks: config.label === 'Merah'
            ? rule.teks + ' Wilayah ini termasuk risiko tinggi — prioritaskan penagihan segera.'
            : rule.teks,
          prioritas: config.label === 'Merah' ? 3 : rule.prioritas
        }))
        await supabasePost('rekomendasi', rekRows)

        console.log(`${kel} (${w.klaster}) — selesai`)
      }
    }
  }

  // Geom untuk wilayah baru
  console.log('\nFetching geom...')
  const wilayahBaru = await supabaseGet('wilayah?geom=is.null&select=id,nama,tipe')
  
  for (const w of wilayahBaru) {
    const query = `${w.nama}, Bali, Indonesia`
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=geojson&polygon_geojson=1&limit=1`
    const res = await fetch(url, { headers: { 'User-Agent': 'SosioMap/1.0' } })
    const data = await res.json()

    if (data.features.length > 0) {
      await supabasePost(
        `wilayah?id=eq.${w.id}`,
        { geom: JSON.stringify(data.features[0].geometry) },
        'PATCH'
      )
      console.log(`Geom: ${w.nama}`)
    } else {
      console.log(`Geom tidak ditemukan: ${w.nama}`)
    }

    await new Promise(r => setTimeout(r, 1000))
  }

  console.log('\nSeed mockup selesai!')
}

seedMockup()