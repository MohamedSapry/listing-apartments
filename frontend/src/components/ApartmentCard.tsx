'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ApartmentListItem } from '@/types';
import { formatPrice, formatSize, formatListingType, getListingTypeColor } from '@/lib/apartmentService';

interface ApartmentCardProps {
  apartment: ApartmentListItem;
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  const mainImage = apartment.images?.[0] || {
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    altText: 'Apartment image'
  };

  return (
    <Link href={`/apartments/${apartment.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={mainImage.url}
            alt={mainImage.altText || apartment.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getListingTypeColor(apartment.listingType)}`}>
              {formatListingType(apartment.listingType)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {apartment.title}
            </h3>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(apartment.price, apartment.currency)}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3">
            {apartment.compound.name}, {apartment.compound.district}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {apartment.bedrooms} bed
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                </svg>
                {apartment.bathrooms} bath
              </span>
            </div>
            <span className="text-gray-500">
              {formatSize(apartment.sizeSqm)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
