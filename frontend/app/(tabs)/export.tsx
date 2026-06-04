import HeaderExport from '@/components/export/header';
import KlasterSelector from '@/components/export/klaster';
import PeriodeSelector from '@/components/export/periode';
import { klasterOptions, periodeOptions, laporanContent, laporanItems } from '@/constants/dummyData';
import { Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import LaporanPreview from '@/components/export/laporanPreview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ExportPage() {
  
  const [selectedPeriode, setSelectedPeriode] = useState<number | null>(1);
  const [selectedKlaster, setSelectedKlaster] = useState<string[]>(['Semua']);

  const handleKlasterToggle = (klaster: string) => {
    if (klaster === 'Semua') {
      setSelectedKlaster(['Semua']);
      return;
    }

    let newSelected = selectedKlaster.filter(k => k !== 'Semua');
    
    if (newSelected.includes(klaster)) {
      // Unselect
      newSelected = newSelected.filter(k => k !== klaster);
      if (newSelected.length === 0) {
        newSelected = ['Semua'];
      }
    } else {
      // Select
      newSelected = [...newSelected, klaster];
    }
    
    setSelectedKlaster(newSelected);
  };

  const handleExport = async () => {
    try {
    const rows = laporanItems
      .map(
        (item) => `
          <tr>
            <td>${item.no}</td>
            <td>${item.kategori}</td>
            <td>${item.cakupan}</td>
            <td>${item.status}</td>
            <td>${item.keterangan}</td>
          </tr>
        `
      )
      .join('');

      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial;
                padding: 24px;
                color: #222;
              }

              h1 {
                font-size: 24px;
                margin-bottom: 4px;
                color: #2563eb;
              }

              p {
                color: #666;
                margin-bottom: 24px;
              }

              .info {
                margin-bottom: 20px;
                padding: 16px;
                background: #f9fafb;
                border-radius: 12px;
                line-height: 24px;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                overflow: hidden;
                border-radius: 12px;
              }

              th {
                background: #2563eb;
                color: white;
              }

              th, td {
                border: 1px solid #ddd;
                padding: 14px;
                text-align: left;
              }

              tr:nth-child(even) {
                background: #f9fafb;
              }

              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #888;
                text-align: center;
              }
            </style>
          </head>

          <body>
            <h1>${laporanContent.title}</h1>

            <p>${laporanContent.subtitle}</p>

            <div class="info">
              <strong>Periode:</strong>
              ${
                periodeOptions.find(
                  (p) => p.id === selectedPeriode
                )?.label
              }

              <br />

              <strong>Klaster:</strong>
              ${selectedKlaster.join(', ')}
            </div>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kategori</th>
                  <th>Cakupan</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>

              <tbody>
                ${rows}
              </tbody>
            </table>

            <div class="footer">
              Dibuat otomatis oleh sistem export laporan
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Gagal membuat PDF'
      );
    }
  };

  return (
    <ScrollView
      className='flex-1 w-full bg-white'
      contentContainerStyle={{paddingBottom: 110,}}
      showsVerticalScrollIndicator={false}
    >
      <HeaderExport />
      <PeriodeSelector options={periodeOptions} selectedId={selectedPeriode} onSelect={setSelectedPeriode} />
      <KlasterSelector options={klasterOptions} selected={selectedKlaster} onToggle={handleKlasterToggle} />
      <LaporanPreview
        title={laporanContent.title}
        subtitle={laporanContent.subtitle}
        items={laporanContent.items}
        onExport={handleExport}
      />
    </ScrollView>
  );
}
