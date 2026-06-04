import { supabase } from '@/src/lib/supabase';

export const getTrendPenerimaan = async () => {
  const { data, error } = await supabase
    .from('kepatuhan_pajak')
    .select('*')
    .order('periode', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};