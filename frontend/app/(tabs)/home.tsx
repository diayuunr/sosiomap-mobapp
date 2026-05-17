import Greetings from '@/components/home/greetings';
import { ScrollView } from 'react-native';
import MapPreview from '@/components/home/maps';
import { useState } from 'react';
import FilterSection from '@/components/home/filter';
import RecommendationSection from '@/components/home/recommendations';
import StatsSection from '@/components/home/stats';
import TrendChart from '@/components/home/trend';

export default function HomePage() {
  const [filters, setFilters] = useState({
    kota: 'Cimahi',
    kecamatan: 'Cimahi Tengah',
    kelurahan: '---',
    provinsi: 'Jawa Barat',
  });

  const [appliedKota, setAppliedKota] = useState('Cimahi');

  const handleApplyFilter = () => {
    setAppliedKota(filters.kota);
  };

  return (
    <ScrollView
      className='flex-1 w-full bg-white'
      contentContainerStyle={{paddingBottom: 110,}}
      showsVerticalScrollIndicator={false}
    >
      <Greetings />
      <StatsSection />
      <TrendChart />
      <MapPreview selectedKota={appliedKota} />
      <FilterSection
        filters={filters}
        onFilterChange={setFilters}
        onApplyFilter={handleApplyFilter}
      />
      <RecommendationSection />
    </ScrollView>
  );
}