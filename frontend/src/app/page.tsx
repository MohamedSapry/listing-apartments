'use client';

import { useState, useEffect } from 'react';
import { ApartmentService } from '@/lib/apartmentService';
import { ApartmentListItem, SearchFilters as SearchFiltersType, Amenity, Compound } from '@/types';
import ApartmentGrid from '@/components/ApartmentGrid';
import SearchFilters from '@/components/SearchFilters';
import ClientOnly from '@/components/ClientOnly';

export default function HomePage() {
  const [apartments, setApartments] = useState<ApartmentListItem[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [apartmentsResponse, amenitiesResponse, compoundsResponse] = await Promise.all([
          ApartmentService.getApartments(filters, { page: 1, limit: 12 }),
          ApartmentService.getAmenities(),
          ApartmentService.getCompounds()
        ]);

        // Data loaded successfully

        // Ensure we have arrays
        setApartments(Array.isArray(apartmentsResponse.data) ? apartmentsResponse.data : []);
        setAmenities(Array.isArray(amenitiesResponse.data) ? amenitiesResponse.data : []);
        setCompounds(Array.isArray(compoundsResponse.data) ? compoundsResponse.data : []);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load apartments. Please try again.');
        // Set empty arrays on error
        setApartments([]);
        setAmenities([]);
        setCompounds([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [filters]);

  // Handle filter changes
  const handleFiltersChange = async (newFilters: SearchFiltersType) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ApartmentService.getApartments(newFilters, { page: 1, limit: 12 });
      
      // Search completed successfully
      
      // Ensure we have an array
      setApartments(Array.isArray(response.data) ? response.data : []);
      setFilters(newFilters);
    } catch (err) {
      console.error('Failed to search apartments:', err);
      setError('Failed to search apartments. Please try again.');
      setApartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Apartment</h1>
          <p className="mt-2 text-gray-600">
            Discover amazing apartments in Cairo with our comprehensive search
          </p>
        </div>
      </header>

      <ClientOnly 
        suppressHydrationWarning={true}
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <SearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                amenities={amenities}
                compounds={compounds}
                isLoading={isLoading}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Apartments ({apartments.length})
                </h2>
                <ApartmentGrid apartments={apartments} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  );
}