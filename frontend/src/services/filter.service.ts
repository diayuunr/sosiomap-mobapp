import { supabase } from '@/src/lib/supabase';

export const getKlaster = async (filters?: any) => {

  let query = supabase
    .from('klaster_wilayah')
    .select(`
      *,
      wilayah!inner (
        id,
        nama,
        tipe
      )
    `);

  // FILTER TIPE WILAYAH
  if (
    filters?.wilayah &&
    filters.wilayah !== ''
  ) {

    query = query.eq(
      'wilayah.tipe',
      filters.wilayah
    );
  }

  const { data, error } =
    await query;

  if (error) {
    console.log(
      'KLASTER ERROR:',
      error
    );

    throw error;
  }

  return data;
};

export const getAllWilayah = async () => {
  const { data, error } = await supabase
    .from('wilayah')
    .select('id, nama, tipe, parent_id')
    .order('nama');

  if (error) throw error;
  return data || [];
};