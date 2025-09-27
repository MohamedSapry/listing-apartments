'use client';

import { useState, useEffect } from 'react';
import type { SearchFilters, Amenity, Compound } from '@/types';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  amenities: Amenity[];
  compounds: Compound[];
  isLoading?: boolean;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  amenities,
  compounds
}: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>({});

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | number[] | undefined) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmenityToggle = (amenityId: number) => {
    const currentAmenities = localFilters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Search Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search apartments by title or description..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 hover:border-gray-400"
        />
      </div>

      {/* Main Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Listing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Listing Type
          </label>
          <select
            value={localFilters.listingType || ''}
            onChange={(e) => handleFilterChange('listingType', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200 hover:border-gray-400"
          >
            <option value="">All Types</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <select
            value={localFilters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200 hover:border-gray-400"
          >
            <option value="">All Cities</option>
            {Array.isArray(compounds) && Array.from(new Set(compounds.map(c => c.city))).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <select
            value={localFilters.district || ''}
            onChange={(e) => handleFilterChange('district', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200 hover:border-gray-400"
          >
            <option value="">All Districts</option>
            {Array.isArray(compounds) && Array.from(new Set(compounds.map(c => c.district))).map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <select
            value={localFilters.bedrooms || ''}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200 hover:border-gray-400"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Bathrooms
            </label>
            <select
              value={localFilters.bathrooms || ''}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 hover:border-gray-400"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range (EGP)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Minimum Price
            </label>
            <input
              type="number"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g. 1,000,000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 hover:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Maximum Price
            </label>
            <input
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g. 10,000,000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 hover:border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Amenities & Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {Array.isArray(amenities) && amenities.map(amenity => (
            <label 
              key={amenity.id} 
              className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={localFilters.amenities?.includes(amenity.id) || false}
                onChange={() => handleAmenityToggle(amenity.id)}
                className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 select-none">{amenity.name}</span>
            </label>
          ))}
        </div>
        
        {localFilters.amenities && localFilters.amenities.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {localFilters.amenities.length} amenity{localFilters.amenities.length !== 1 ? 'ies' : ''} selected
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
