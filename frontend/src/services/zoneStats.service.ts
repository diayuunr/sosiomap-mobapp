import { supabase } from '@/src/lib/supabase';

export const getZoneStats = async (wilayahId: number) => {
  // ambil semua wp berdasarkan wilayah
  const { data: wpData, error: wpError } = await supabase
    .from('wajib_pajak')
    .select('id')
    .eq('wilayah_id', wilayahId);

  if (wpError) throw wpError;

  const wajibPajak = wpData?.length || 0;

  const wpIds = wpData.map((w) => w.id);

  if (wpIds.length === 0) {
    return {
      wajibPajak: 0,
      kepatuhan: '0%',
      tunggakan: 'Rp 0',
      pendapatan: 'Rp 0',
      riskLabel: 'Risiko Rendah',
      riskLevel: 'green',
    };
  }

  // ambil data kepatuhan
  const { data: kepatuhanData, error: kepError } = await supabase
    .from('kepatuhan_pajak')
    .select('*')
    .in('wajib_pajak_id', wpIds);

  if (kepError) throw kepError;

  const totalData = kepatuhanData.length;

  const lunas = kepatuhanData.filter(
    (k) => k.status_bayar === 'lunas'
  ).length;

  const belumLunas = kepatuhanData.filter(
    (k) => k.status_bayar === 'belum_lunas'
  );

  const totalTunggakan = belumLunas.reduce(
    (acc, item) => acc + (item.nilai_tunggakan || 0),
    0
  );

  // simulasi pendapatan
  const totalPendapatan =
    lunas * 1500000;

  const persenKepatuhan =
    totalData > 0
      ? Math.round((lunas / totalData) * 100)
      : 0;

  let riskLevel: 'green' | 'yellow' | 'red' = 'green';
  let riskLabel = 'Risiko Rendah';

  if (persenKepatuhan < 50) {
    riskLevel = 'red';
    riskLabel = 'Risiko Tinggi';
  } else if (persenKepatuhan < 75) {
    riskLevel = 'yellow';
    riskLabel = 'Risiko Sedang';
  }

  return {
    wajibPajak,

    kepatuhan: `${persenKepatuhan}%`,

    tunggakan: `Rp ${totalTunggakan.toLocaleString(
      'id-ID'
    )}`,

    pendapatan: `Rp ${totalPendapatan.toLocaleString(
      'id-ID'
    )}`,

    riskLevel,
    riskLabel,
  };
};