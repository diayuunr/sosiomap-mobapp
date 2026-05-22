import { supabase } from '@/src/lib/supabase';

export const getRekomendasi = async () => {
  const { data, error } = await supabase
    .from('rekomendasi')
    .select(`
      *,
      wilayah (
        id,
        nama
      )
    `);

  if (error) {
    throw error;
  }

  return data;
};