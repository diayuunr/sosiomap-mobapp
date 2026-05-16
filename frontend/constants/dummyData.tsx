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