import { supabase } from '@/src/lib/supabase';

export const getRekomendasi =
  async (wilayahId: number) => {

    const { data, error } =
      await supabase
        .from('rekomendasi')
        .select('*')
        .eq(
          'wilayah_id',
          wilayahId
        )
        .order(
          'prioritas',
          {
            ascending: false,
          }
        )
        .limit(3);

    if (error) {
      throw error;
    }

    return data;
  };