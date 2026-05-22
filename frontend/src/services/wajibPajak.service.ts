import { supabase } from '@/src/lib/supabase';

const pekerjaanColors: Record<
  string,
  string
> = {
  Wirausaha: '#C20B0D',
  UMKM: '#FDD216',
  'Pegawai Negeri': '#007BE5',
  Pensiunan: '#050F32',
};

const usiaColors: string[] = [
  '#007BE5',
  '#FDD216',
  '#050F32',
  '#C20B0D',
  '#00A86B',
];

export const getWilayahStatistik =
  async (wilayahId: number) => {

    const { data, error } =
      await supabase
        .from('wajib_pajak')
        .select(`
          kelompok_ekonomi,
          usia_range
        `)
        .eq('wilayah_id', wilayahId);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        profilPekerjaan: [],
        demografiUsia: [],
      };
    }

    const total = data.length;

    /**
     * PROFIL PEKERJAAN
     */

    const pekerjaanMap:
      Record<string, number> = {};

    data.forEach((item) => {
      const key =
        item.kelompok_ekonomi;

      pekerjaanMap[key] =
        (pekerjaanMap[key] || 0) + 1;
    });

    const profilPekerjaan =
    Object.entries(
        pekerjaanMap
    )
        .map(([label, count]) => ({
        label,
        value: Math.round(
            (Number(count) / total) * 100
        ),
        color:
            pekerjaanColors[label] ||
            '#999',
        }))
        .sort(
        (a, b) => b.value - a.value
        );

    /**
     * DEMOGRAFI USIA
     */

    const usiaMap:
      Record<string, number> = {};

    data.forEach((item) => {
      const key =
        item.usia_range;

      usiaMap[key] =
        (usiaMap[key] || 0) + 1;
    });

    const demografiUsia =
    Object.entries(
        usiaMap
    )
        .map(
        ([range, count], index) => ({
            range,
            percent: Math.round(
            (Number(count) / total) * 100
            ),
            color:
            usiaColors[
                index %
                usiaColors.length
            ],
        })
        )
        .sort(
        (a, b) =>
            b.percent - a.percent
        );

    return {
      profilPekerjaan,
      demografiUsia,
    };
  };