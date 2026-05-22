import { supabase } from '@/src/lib/supabase';

export const getRekomendasi = async () => {

  const { data, error } = await supabase
    .from('rekomendasi')
    .select(`
      *,
      wilayah (
        id,
        nama,
        klaster_wilayah (
          periode,
          klaster_label
        )
      )
    `);

  if (error) {
    throw error;
  }

  return data;
};