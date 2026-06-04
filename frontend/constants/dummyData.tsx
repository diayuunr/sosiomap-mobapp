export const dummyStats = {
  totalWajibPajak: 98940,
  totalTunggakan: 'Rp4,2 M',
  persentaseKepatuhan: 68,
  wajibPajakChange: 8.45,
  tunggakanChange: 2.45,
  kepatuhanChange: -9.45,
};

export const trendData = [
  { date: '16 MEI', value: 1.8 },
  { date: '17 MEI', value: 2.1 },
  { date: '18 MEI', value: 2.5 },
  { date: '19 MEI', value: 2.3 },
  { date: '20 MEI', value: 3.8 },
  { date: '21 MEI', value: 5.2 },
  { date: '22 MEI', value: 6.8 },
];

export const wilayahPrioritas = [
  { id: 1, name: 'Setiamanah', risk: 'risiko' },
  { id: 2, name: 'Karangmekar', risk: 'perhatian' },
  { id: 3, name: 'Padasuka', risk: 'stabil' },
];

export const filterOptions = {
  kota: ['Cimahi', 'Bandung', 'Bogor'],
  kecamatan: ['Cimahi Tengah', 'Cimahi Selatan', 'Cimahi Utara'],
  kelurahan: ['---', 'Setiamanah', 'Karangmekar'],
  provinsi: ['Jawa Barat', 'DKI Jakarta', 'Jawa Tengah'],
};

// Data polygons per kota
export const polygonsByKota: Record<string, any[]> = {
  Cimahi: [
    {
      id: 1,
      coordinates: [
        { latitude: -6.872, longitude: 107.535 },
        { latitude: -6.872, longitude: 107.555 },
        { latitude: -6.885, longitude: 107.555 },
        { latitude: -6.885, longitude: 107.535 },
      ],
      risk: 'stabil',
      name: 'Cimahi Tengah',
    },
    {
      id: 2,
      coordinates: [
        { latitude: -6.885, longitude: 107.535 },
        { latitude: -6.885, longitude: 107.555 },
        { latitude: -6.895, longitude: 107.555 },
        { latitude: -6.895, longitude: 107.535 },
      ],
      risk: 'perhatian',
      name: 'Cimahi Selatan',
    },
    {
      id: 3,
      coordinates: [
        { latitude: -6.860, longitude: 107.540 },
        { latitude: -6.860, longitude: 107.560 },
        { latitude: -6.872, longitude: 107.560 },
        { latitude: -6.872, longitude: 107.540 },
      ],
      risk: 'risiko',
      name: 'Cimahi Utara',
    },
  ],
  Bandung: [
    {
      id: 4,
      coordinates: [
        { latitude: -6.914, longitude: 107.609 },
        { latitude: -6.914, longitude: 107.629 },
        { latitude: -6.934, longitude: 107.629 },
        { latitude: -6.934, longitude: 107.609 },
      ],
      risk: 'stabil',
      name: 'Coblong',
    },
    {
      id: 5,
      coordinates: [
        { latitude: -6.934, longitude: 107.609 },
        { latitude: -6.934, longitude: 107.629 },
        { latitude: -6.954, longitude: 107.629 },
        { latitude: -6.954, longitude: 107.609 },
      ],
      risk: 'risiko',
      name: 'Bandung Wetan',
    },
  ],
  Bogor: [
    {
      id: 6,
      coordinates: [
        { latitude: -6.594, longitude: 106.789 },
        { latitude: -6.594, longitude: 106.809 },
        { latitude: -6.614, longitude: 106.809 },
        { latitude: -6.614, longitude: 106.789 },
      ],
      risk: 'perhatian',
      name: 'Bogor Tengah',
    },
  ],
};

// Region per kota
export const regionByKota: Record<string, any> = {
  Cimahi: {
    latitude: -6.877,
    longitude: 107.545,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  Bandung: {
    latitude: -6.924,
    longitude: 107.619,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  Bogor: {
    latitude: -6.604,
    longitude: 106.799,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
};

// Detail data per zona
export const zonaDetailData: Record<number, any> = {
  1: {
    id: 1,
    name: 'Kec. Cimahi',
    kelompok: 'Pensiunan dan Lansia',
    wajibPajak: 9840,
    pendapatan: 'Rp 6.8jt',
    kepatuhan: '68%',
    tunggakan: 'Rp 4.2M',
    riskLevel: 'risiko',
    riskLabel: 'Risiko Keterlambatan Bayar: Tinggi',
    profilPekerjaan: [
      { label: 'Pensiunan', value: 48, color: '#EACE2A' },
      { label: 'Pegawai Negeri', value: 26, color: '#007BE5' },
      { label: 'UMKM', value: 12, color: '#4FB8F8' },
      { label: 'Wirausaha', value: 14, color: '#0AA34F' },
    ],
    demografiUsia: [
      { range: '20-30', percent: 6, color: '#007BE5' },
      { range: '31-45', percent: 18, color: '#EACE2A' },
      { range: '46-60', percent: 32, color: '#050F32' },
      { range: '60+', percent: 44, color: '#C20B0D' },
    ],
    trenKepatuhan: [
      { year: '2022', value: 74 },
      { year: '2023', value: 71 },
      { year: '2024', value: 69 },
      { year: '2025', value: 68 },
    ],
    rekomendasi: [
      { no: '01', text: 'Tawarkan skema cicilan PBB tanpa bunga' },
      { no: '02', text: 'Berikan keringanan / pengurangan untuk lansia' },
      { no: '03', text: 'Pendampingan pembayaran pajak lansia' },
    ],
  },
  2: {
    id: 2,
    name: 'Kec. Cimahi Selatan',
    kelompok: 'UMKM',
    wajibPajak: 5420,
    pendapatan: 'Rp 3.2jt',
    kepatuhan: '82%',
    tunggakan: 'Rp 1.1M',
    riskLevel: 'perhatian',
    riskLabel: 'Risiko Keterlambatan Bayar: Sedang',
    profilPekerjaan: [
      { label: 'UMKM', value: 55, color: '#4FB8F8' },
      { label: 'Wirausaha', value: 30, color: '#0AA34F' },
      { label: 'Pegawai Negeri', value: 10, color: '#007BE5' },
      { label: 'Pensiunan', value: 5, color: '#EACE2A' },
    ],
    demografiUsia: [
      { range: '20-30', percent: 22, color: '#007BE5' },
      { range: '31-45', percent: 35, color: '#EACE2A' },
      { range: '46-60', percent: 28, color: '#050F32' },
      { range: '60+', percent: 15, color: '#C20B0D' },
    ],
    trenKepatuhan: [
      { year: '2022', value: 78 },
      { year: '2023', value: 80 },
      { year: '2024', value: 81 },
      { year: '2025', value: 82 },
    ],
    rekomendasi: [
      { no: '01', text: 'Diskon denda untuk UMKM aktif' },
      { no: '02', text: 'Program mentoring keuangan UMKM' },
      { no: '03', text: 'Simplifikasi proses pembayaran' },
    ],
  },
  3: {
    id: 3,
    name: 'Kec. Cimahi Utara',
    kelompok: 'Pegawai Negeri',
    wajibPajak: 12300,
    pendapatan: 'Rp 8.5jt',
    kepatuhan: '91%',
    tunggakan: 'Rp 0.8M',
    riskLevel: 'stabil',
    riskLabel: 'Risiko Keterlambatan Bayar: Rendah',
    profilPekerjaan: [
      { label: 'Pegawai Negeri', value: 60, color: '#007BE5' },
      { label: 'Wirausaha', value: 25, color: '#0AA34F' },
      { label: 'UMKM', value: 10, color: '#4FB8F8' },
      { label: 'Pensiunan', value: 5, color: '#EACE2A' },
    ],
    demografiUsia: [
      { range: '20-30', percent: 15, color: '#007BE5' },
      { range: '31-45', percent: 40, color: '#EACE2A' },
      { range: '46-60', percent: 30, color: '#050F32' },
      { range: '60+', percent: 15, color: '#C20B0D' },
    ],
    trenKepatuhan: [
      { year: '2022', value: 88 },
      { year: '2023', value: 89 },
      { year: '2024', value: 90 },
      { year: '2025', value: 91 },
    ],
    rekomendasi: [
      { no: '01', text: 'Pertahankan program reminder otomatis' },
      { no: '02', text: 'Reward untuk pembayaran tepat waktu' },
      { no: '03', text: 'Monitoring berkala via aplikasi' },
    ],
  },
};

export const periodeOptions = [
  { id: 1, label: 'OKT - DES 2025', subtitle: 'Triwulan IV 2025' },
  { id: 2, label: 'JAN - MAR 2026', subtitle: 'Triwulan I 2026' },
  { id: 3, label: 'APR - JUN 2026', subtitle: 'Triwulan II 2026' },
  { id: 4, label: 'JUL - SEP 2026', subtitle: 'Triwulan III 2026' },
];

export const klasterOptions = [
  'Semua',
  'Pensiunan',
  'Pegawai Negeri',
  'UMKM',
  'Wirausaha',
];

export const laporanContent = {
  title: 'Laporan Triwulan',
  subtitle: '12 Kecamatan - Semua Klaster',
  items: [
    'Distribusi Klaster Ekonomi & Populasi Wajib Pajak',
    'Tingkat Kepatuhan & Tren Historis',
    'Ringkasan Tunggakan per Zona',
    'Rekomendasi Kebijakan per Kelompok',
  ],
};

export const laporanItems = [
  {
    no: 1,
    kategori: 'Distribusi Klaster Ekonomi & Populasi Wajib Pajak',
    cakupan: '12 Kecamatan',
    status: 'Lengkap',
    keterangan: 'Data wajib pajak aktif & persebaran ekonomi berhasil dianalisis',
  },
  {
    no: 2,
    kategori: 'Tingkat Kepatuhan & Tren Historis',
    cakupan: 'Triwulan I 2026',
    status: 'Stabil',
    keterangan: 'Terjadi peningkatan kepatuhan sebesar 8% dibanding periode sebelumnya',
  },
  {
    no: 3,
    kategori: 'Ringkasan Tunggakan per Zona',
    cakupan: 'Zona Risiko Tinggi',
    status: 'Perlu Tindak Lanjut',
    keterangan: 'Ditemukan peningkatan tunggakan pada 3 kecamatan prioritas',
  },
  {
    no: 4,
    kategori: 'Rekomendasi Kebijakan per Kelompok',
    cakupan: 'Semua Klaster',
    status: 'Disusun',
    keterangan: 'Kebijakan difokuskan pada edukasi & pengawasan wajib pajak baru',
  },
];