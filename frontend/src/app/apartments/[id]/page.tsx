'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ApartmentService, formatPrice, formatSize, formatListingType, getListingTypeColor } from '@/lib/apartmentService';
import { ApartmentWithDetails } from '@/types';

export default function ApartmentDetailPage() {
  const params = useParams();
  const [apartment, setApartment] = useState<ApartmentWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !params.id) return;
    
    const loadApartment = async () => {
      try {
        setIsLoading(true);
        const response = await ApartmentService.getApartmentById(Number(params.id));
        setApartment(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load apartment:', err);
        setError('Failed to load apartment details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadApartment();
  }, [mounted, params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading apartment details...</p>
        </div>
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apartment Not Found</h1>
          <p className="text-gray-700 mb-4 font-medium">{error || 'The apartment you are looking for does not exist.'}</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < apartment.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : apartment.images.length - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              {apartment.images.length > 0 ? (
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <Image
                    src={apartment.images[currentImageIndex].url}
                    alt={apartment.images[currentImageIndex].altText || apartment.title}
                    fill
                    className="object-cover"
                  />
                  
                  {apartment.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-medium">No images available</span>
                </div>
              )}
              
              {/* Image Thumbnails */}
              {apartment.images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {apartment.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                        currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || apartment.title}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Apartment Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{apartment.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getListingTypeColor(apartment.listingType)}`}>
                  {formatListingType(apartment.listingType)}
                </span>
              </div>

              <div className="flex items-center text-gray-700 mb-4">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{apartment.compound.name}, {apartment.compound.district}, {apartment.compound.city}</span>
              </div>

              {apartment.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-800 leading-relaxed font-medium">{apartment.description}</p>
                </div>
              )}

              {/* Amenities */}
              {apartment.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {apartment.amenities.map((apartmentAmenity) => (
                      <div key={apartmentAmenity.amenityId} className="flex items-center text-sm text-gray-800 font-medium">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {apartmentAmenity.amenity.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatPrice(apartment.price, apartment.currency)}
                </div>
                <div className="text-sm text-gray-700 font-medium">
                  {apartment.listingType === 'rent' ? 'per month' : 'total price'}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Size</span>
                  <span className="font-semibold text-gray-900">{formatSize(apartment.sizeSqm)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Bedrooms</span>
                  <span className="font-semibold text-gray-900">{apartment.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Bathrooms</span>
                  <span className="font-semibold text-gray-900">{apartment.bathrooms}</span>
                </div>
                {apartment.floor && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Floor</span>
                    <span className="font-semibold text-gray-900">{apartment.floor}</span>
                  </div>
                )}
                {apartment.unitNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Unit</span>
                    <span className="font-semibold text-gray-900">{apartment.unitNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Status</span>
                  <span className="font-semibold text-gray-900">{apartment.finished ? 'Finished' : 'Unfinished'}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                Contact Agent
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Reference: {apartment.referenceNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
