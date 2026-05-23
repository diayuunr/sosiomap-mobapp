import Greetings from '@/components/home/greetings';
import { ScrollView } from 'react-native';
import MapPreview from '@/components/home/maps';
import { useState } from 'react';
import FilterSection from '@/components/home/filter';
import RecommendationSection from '@/components/home/recommendations';
import StatsSection from '@/components/home/stats';
import TrendChart from '@/components/home/trend';

export default function HomePage() {

  /**
   * FILTER STATE
   */

  const [filters, setFilters] =
    useState({
      kabupaten_kota: '',
      kota: '',
      kecamatan: '',
      kelurahan: '',
      provinsi: '',
    });

  /**
   * APPLIED FILTER
   */

  const [appliedFilters,
    setAppliedFilters] =
    useState(filters);

  /**
   * APPLY FILTER
   */

  const handleApplyFilter =
    () => {
      setAppliedFilters(filters);
    };

  return (
    <ScrollView
      className="flex-1 w-full bg-white"
      contentContainerStyle={{
        paddingBottom: 110,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      <Greetings />

      <StatsSection />

      <TrendChart />

      {/* MAP */}
      <MapPreview
        selectedKota={
          appliedFilters.kabupaten_kota
        }
        filters={
          appliedFilters
        }
      />

      {/* FILTER */}
      <FilterSection
        filters={filters}
        onFilterChange={
          setFilters
        }
        onApplyFilter={
          handleApplyFilter
        }
      />

      <RecommendationSection />
    </ScrollView>
  );
}