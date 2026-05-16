import HeaderExport from '@/components/export/header';
import KlasterSelector from '@/components/export/klaster';
import PeriodeSelector from '@/components/export/periode';
import { klasterOptions, periodeOptions, laporanContent } from '@/constants/dummyData';
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
      const rows = laporanContent.items
        .map(
          (item) => `
            <tr>
              <td>${item}</td>
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
              }

              p {
                color: #666;
                margin-bottom: 24px;
              }

              .info {
                margin-bottom: 20px;
              }

              table {
                width: 100%;
                border-collapse: collapse;
              }

              th {
                background: #f3f4f6;
              }

              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
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
              <tr>
                <th>Kategori</th>
                <th>Jumlah</th>
              </tr>

              ${rows}
            </table>
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
