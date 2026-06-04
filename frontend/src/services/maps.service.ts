import { supabase } from '@/src/lib/supabase';

export const getMapGeometry =
  async () => {

  const { data, error } =
    await supabase
      .from('wilayah')
      .select(`
        id,
        nama,
        tipe,
        geom,
        klaster_wilayah (
          klaster_label,
          skor_risiko
        )
      `)
      .in('tipe', [
        'kecamatan',
        'kelurahan',
      ])
      .not('geom', 'is', null);

  if (error) {
    throw error;
  }

  return data;
};

export const getProvinsi = async () => {
  const { data, error } = await supabase
    .from('wilayah')
    .select('*')
    .eq('tipe', 'provinsi');

  if (error) throw error;

  return data;
};

export const getKota = async () => {
  const { data, error } = await supabase
    .from('wilayah')
    .select('*')
    .eq('tipe', 'kabupaten_kota');

  if (error) throw error;

  return data;
};

export const getKecamatan = async () => {
  const { data, error } = await supabase
    .from('wilayah')
    .select('*')
    .eq('tipe', 'kecamatan');

  if (error) throw error;

  return data;
};

export const getKelurahan = async () => {
  const { data, error } = await supabase
    .from('wilayah')
    .select('*')
    .eq('tipe', 'kelurahan');

  if (error) throw error;

  return data;
};

// Ambil wilayah beserta jumlah wajib pajak per kelompok ekonomi
export const getWilayahKelompok = async () => {
  const { data, error } = await supabase
    .from('wajib_pajak')
    .select('wilayah_id, kelompok_ekonomi');

  if (error) throw error;

  // Group by wilayah_id → set of kelompok_ekonomi
  const map: Record<string, Set<string>> = {};
  for (const row of data || []) {
    if (!map[row.wilayah_id]) map[row.wilayah_id] = new Set();
    map[row.wilayah_id].add(row.kelompok_ekonomi);
  }

  // Convert Set to array
  const result: Record<string, string[]> = {};
  for (const [id, set] of Object.entries(map)) {
    result[id] = Array.from(set);
  }

  return result;
};