'use client';

import { ApartmentListItem } from '@/types';
import ApartmentCard from './ApartmentCard';

interface ApartmentGridProps {
  apartments: ApartmentListItem[];
  isLoading?: boolean;
}

export default function ApartmentGrid({ apartments, isLoading = false }: ApartmentGridProps) {
  // Component rendered with apartment data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Ensure apartments is an array
  const apartmentArray = Array.isArray(apartments) ? apartments : [];

  if (apartmentArray.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No apartments found</div>
        <p className="text-gray-400">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apartmentArray.map((apartment) => (
        <ApartmentCard key={apartment.id} apartment={apartment} />
      ))}
    </div>
  );
}
