import { supabase } from '@/src/lib/supabase';

export const getTrendPenerimaan =
  async (wilayahId: number) => {

    const { data, error } =
      await supabase
        .from('kepatuhan_pajak')
        .select(`
          periode,
          status_bayar,
          wajib_pajak!inner (
            wilayah_id
          )
        `)
        .eq(
          'wajib_pajak.wilayah_id',
          wilayahId
        )
        .order(
          'periode',
          { ascending: true }
        );

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // grouping per tahun
    const grouped:
      Record<
        string,
        {
          total: number;
          lunas: number;
        }
      > = {};

    data.forEach((item: any) => {

      const tahun =
        item.periode;

      if (!grouped[tahun]) {
        grouped[tahun] = {
          total: 0,
          lunas: 0,
        };
      }

      grouped[tahun].total++;

      if (
        item.status_bayar ===
        'lunas'
      ) {
        grouped[tahun].lunas++;
      }
    });

    // hitung persentase
    return Object.entries(grouped)
      .map(([year, value]) => ({
        year,
        value: Math.round(
          (
            value.lunas /
            value.total
          ) * 100
        ),
      }))
      .sort(
        (a, b) =>
          Number(a.year) -
          Number(b.year)
      );
  };