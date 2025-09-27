/**
 * Database Seed Script
 * 
 * This populates our database with sample apartment listings,
 * compounds, and amenities for development and testing.
 */

import { PrismaClient, ListingType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample data...');

  // Clear any existing data first
  await prisma.apartmentAmenity.deleteMany();
  await prisma.apartmentImage.deleteMany();
  await prisma.apartment.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.compound.deleteMany();

  console.log('Cleared existing data');

  // Create some apartment compounds in Cairo
  const compounds = await prisma.compound.createMany({
    data: [
      {
        name: 'Palm Hills New Cairo',
        city: 'New Cairo',
        district: 'Fifth Settlement',
        addressLine: 'Palm Hills Compound, New Cairo City',
        lat: 30.0444,
        lng: 31.2357,
        description: 'Luxury residential compound in the heart of New Cairo with world-class amenities'
      },
      {
        name: 'Madinaty',
        city: 'New Cairo',
        district: 'Madinaty',
        addressLine: 'Madinaty Compound, New Cairo',
        lat: 30.0876,
        lng: 31.4390,
        description: 'Integrated residential city offering a complete lifestyle experience'
      },
      {
        name: 'Al Rehab City',
        city: 'New Cairo',
        district: 'Al Rehab',
        addressLine: 'Al Rehab City, New Cairo',
        lat: 30.0626,
        lng: 31.4147,
        description: 'Self-contained residential community with comprehensive facilities'
      },
      {
        name: 'Sheikh Zayed Gardens',
        city: 'Giza',
        district: 'Sheikh Zayed',
        addressLine: 'Gardens Compound, Sheikh Zayed City',
        lat: 30.0777,
        lng: 31.0117,
        description: 'Green residential compound in the prestigious Sheikh Zayed area'
      },
      {
        name: 'Degla Gardens',
        city: 'Maadi',
        district: 'Maadi',
        addressLine: 'Degla Gardens, Maadi',
        lat: 29.9600,
        lng: 31.2600,
        description: 'Established residential compound in the heart of Maadi'
      }
    ]
  });

  console.log('Created compounds');

  // Create various amenities that apartments can have
  const amenityNames = [
    'Swimming Pool', 'Gym', 'Kids Area', 'Security 24/7', 'Parking',
    'Garden View', 'Balcony', 'Air Conditioning', 'Central Heating', 'Elevator',
    'Concierge', 'Tennis Court', 'Basketball Court', 'Clubhouse', 'Spa',
    'Jogging Track', 'Playground', 'Shopping Center', 'Medical Center', 'School',
    'Mosque', 'Restaurants', 'Cafe', 'Laundry Service', 'Internet',
    'Cable TV', 'Intercom', 'Satellite', 'Furnished', 'Kitchen Appliances'
  ];

  const amenities = await Promise.all(
    amenityNames.map(name => 
      prisma.amenity.create({ data: { name } })
    )
  );

  console.log('Created amenities');

  // Get the compounds we just created so we can link apartments to them
  const compoundList = await prisma.compound.findMany();
  
  // Create sample apartment listings
  const apartmentData = [
    {
      compoundId: compoundList[0].id, // Palm Hills New Cairo
      title: 'Luxury 3BR Apartment with Garden View',
      referenceNumber: 'PH-NC-001',
      listingType: ListingType.sale,
      price: 4500000.00,
      description: 'Stunning 3-bedroom apartment with beautiful garden views, fully finished with high-end materials',
      sizeSqm: 180,
      bedrooms: 3,
      bathrooms: 2,
      floor: 2,
      unitNumber: 'A-201'
    },
    {
      compoundId: compoundList[0].id,
      title: 'Modern 2BR Apartment',
      referenceNumber: 'PH-NC-002',
      listingType: ListingType.rent,
      price: 25000.00,
      description: 'Contemporary 2-bedroom apartment with modern amenities and pool access',
      sizeSqm: 120,
      bedrooms: 2,
      bathrooms: 2,
      floor: 5,
      unitNumber: 'B-502'
    },
    {
      compoundId: compoundList[0].id,
      title: 'Spacious 4BR Penthouse',
      referenceNumber: 'PH-NC-003',
      listingType: ListingType.sale,
      price: 8500000.00,
      description: 'Magnificent penthouse with private terrace and panoramic views',
      sizeSqm: 280,
      bedrooms: 4,
      bathrooms: 3,
      floor: 8,
      unitNumber: 'P-801'
    },
    {
      compoundId: compoundList[1].id, // Madinaty
      title: 'Family Villa 4BR',
      referenceNumber: 'MD-V-001',
      listingType: ListingType.rent,
      price: 35000.00,
      description: 'Beautiful family villa with private garden and garage',
      sizeSqm: 320,
      bedrooms: 4,
      bathrooms: 3,
      floor: 0,
      unitNumber: 'V-15'
    },
    {
      compoundId: compoundList[1].id,
      title: 'Cozy 1BR Studio',
      referenceNumber: 'MD-A-002',
      listingType: ListingType.rent,
      price: 12000.00,
      description: 'Perfect starter home with all essential amenities',
      sizeSqm: 65,
      bedrooms: 1,
      bathrooms: 1,
      floor: 3,
      unitNumber: 'A-305'
    },
    {
      compoundId: compoundList[2].id, // Al Rehab City
      title: 'Premium 3BR Apartment',
      referenceNumber: 'AR-A-001',
      listingType: ListingType.sale,
      price: 3200000.00,
      description: 'Premium apartment with modern finishes and city views',
      sizeSqm: 150,
      bedrooms: 3,
      bathrooms: 2,
      floor: 6,
      unitNumber: 'T-603'
    },
    {
      compoundId: compoundList[3].id, // Sheikh Zayed Gardens
      title: 'Elegant 3BR with Pool View',
      referenceNumber: 'SZ-A-001',
      listingType: ListingType.sale,
      price: 5200000.00,
      description: 'Elegant apartment overlooking the swimming pool area',
      sizeSqm: 165,
      bedrooms: 3,
      bathrooms: 2,
      floor: 3,
      unitNumber: 'C-301'
    },
    {
      compoundId: compoundList[4].id, // Degla Gardens
      title: 'Classic 2BR in Maadi',
      referenceNumber: 'DG-A-001',
      listingType: ListingType.rent,
      price: 22000.00,
      description: 'Classic apartment in the prestigious Maadi area',
      sizeSqm: 110,
      bedrooms: 2,
      bathrooms: 2,
      floor: 2,
      unitNumber: 'M-201'
    }
  ];

  const apartments = await Promise.all(
    apartmentData.map(data => prisma.apartment.create({ data }))
  );

  console.log('Created apartments');

  // Create apartment images
  const imageData = [
    // Apartment 1 images
    { apartmentId: apartments[0].id, url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', altText: 'Living room with garden view', position: 0 },
    { apartmentId: apartments[0].id, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', altText: 'Master bedroom', position: 1 },
    
    // Apartment 2 images
    { apartmentId: apartments[1].id, url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', altText: 'Modern living area', position: 0 },
    
    // Apartment 3 images
    { apartmentId: apartments[2].id, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', altText: 'Penthouse living room', position: 0 },
    { apartmentId: apartments[2].id, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', altText: 'Private terrace', position: 1 },
  ];

  await prisma.apartmentImage.createMany({ data: imageData });

  console.log('Created apartment images');

  // Create apartment-amenity relationships
  const apartmentAmenityData = [
    // Apartment 1 - luxury amenities
    ...Array.from({length: 10}, (_, i) => ({ apartmentId: apartments[0].id, amenityId: amenities[i].id })),
    
    // Apartment 2 - standard amenities
    ...Array.from({length: 6}, (_, i) => ({ apartmentId: apartments[1].id, amenityId: amenities[i].id })),
    
    // Apartment 3 - premium penthouse amenities
    ...Array.from({length: 15}, (_, i) => ({ apartmentId: apartments[2].id, amenityId: amenities[i].id })),
  ];

  await prisma.apartmentAmenity.createMany({ data: apartmentAmenityData });

  console.log('Created apartment-amenity relationships');

  console.log('Database seed completed successfully!');
  console.log(`   - ${compoundList.length} compounds created`);
  console.log(`   - ${amenities.length} amenities created`);
  console.log(`   - ${apartments.length} apartments created`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
