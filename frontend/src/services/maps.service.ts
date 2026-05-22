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