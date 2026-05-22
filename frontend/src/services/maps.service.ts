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