import { supabase } from '@/src/lib/supabase';

export const getKlaster = async (filters?: any) => {
  let query = supabase
    .from('klaster_wilayah')
    .select(`
      *,
      wilayah (
        id,
        nama,
        tipe
      )
    `);

  // filter wilayah
  if (filters?.wilayah) {
    query = query.eq(
      'wilayah.tipe',
      filters.wilayah.toLowerCase()
    );
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
};