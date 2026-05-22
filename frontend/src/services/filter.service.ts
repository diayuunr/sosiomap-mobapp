import { supabase } from '@/src/lib/supabase';

export const getKlaster = async () => {
  const { data, error } = await supabase
    .from('klaster')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};