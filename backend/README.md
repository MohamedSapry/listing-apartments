# Backend API

Node.js REST API for the apartment listing application using Express.js and Prisma ORM.

## What This Does

- Provides REST API endpoints for apartment data
- Handles database operations with PostgreSQL
- Manages apartment listings, compounds, and amenities
- Supports search and filtering functionality

## Database Structure

The database has 5 main tables:

```
Compound (Buildings/Communities)
├── id, name, city, district, address_line
└── Has many Apartments

Apartment (Property Listings)  
├── id, title, price, bedrooms, bathrooms, size_sqm
├── listing_type (rent/sale), finished, floor, unit_number
├── Belongs to one Compound
└── Has many Images and Amenities

Amenity (Features like Pool, Gym)
├── id, name
└── Linked to many Apartments

ApartmentImage (Property Photos)
├── id, url, alt_text, position
└── Belongs to one Apartment

ApartmentAmenity (Links Apartments to Amenities)
├── apartment_id, amenity_id
└── Junction table for many-to-many relationship
```

## API Endpoints

### Apartments
- `GET /api/apartments` - Get all apartments with filters
- `GET /api/apartments/:id` - Get specific apartment details
- `POST /api/apartments` - Create new apartment

### Supporting Data
- `GET /api/apartments/compounds` - Get all compounds
- `GET /api/apartments/amenities` - Get all amenities
- `GET /health` - Health check

## Search Filters

You can filter apartments using these parameters:
- `search` - Search in title/description
- `listingType` - "rent" or "sale"
- `minPrice`, `maxPrice` - Price range
- `bedrooms`, `bathrooms` - Property details
- `city`, `district` - Location
- `amenityIds` - Array of amenity IDs
- `page`, `limit` - Pagination

Example:
```
GET /api/apartments?listingType=rent&city=Cairo&minPrice=20000&maxPrice=50000
```

## Running Locally

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
# Create .env file
DATABASE_URL="postgresql://user:password@localhost:5432/apartment_listing"
PORT=3001
```

3. Setup database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open database browser