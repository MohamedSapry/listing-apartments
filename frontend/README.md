# Frontend Web Application

Next.js web application for browsing apartment listings with a modern, responsive interface.

## What This Does

- Displays apartment listings in a searchable grid
- Provides advanced search and filtering options
- Shows detailed apartment information with image galleries
- Responsive design that works on desktop and mobile
- Real-time search with instant results

## Main Features

### Apartment Browsing
- Grid view of all available apartments
- Click any apartment to see full details
- Image galleries with multiple photos
- Property details like bedrooms, bathrooms, size

### Search and Filters
- Text search in apartment titles and descriptions
- Filter by listing type (rent or sale)
- Price range filtering
- Location filtering (city and district)
- Property filters (bedrooms, bathrooms)
- Amenities selection (pool, gym, parking, etc.)

### User Interface
- Clean, modern design with Tailwind CSS
- Mobile-responsive layout
- Loading states and error handling
- Smooth navigation between pages

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios for API calls
- **Images**: Next.js Image component for optimization

## Project Structure

```
frontend/src/
├── app/
│   ├── page.tsx              # Main apartment listings page
│   └── apartments/[id]/
│       └── page.tsx          # Individual apartment details
├── components/
│   ├── ApartmentCard.tsx     # Single apartment display
│   ├── ApartmentGrid.tsx     # Grid of apartments
│   └── SearchFilters.tsx     # Search and filter controls
├── lib/
│   ├── api.ts               # HTTP client setup
│   └── apartmentService.ts  # API calls to backend
└── types/
    └── index.ts             # TypeScript type definitions
```

## Running Locally

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
# Copy the example file and edit as needed
cp env.example .env.local
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production version
- `npm start` - Start production server

## How It Works

1. **Homepage** loads apartment listings from the API
2. **Search filters** send requests to backend with filter parameters
3. **Results** update in real-time as you change filters
4. **Apartment details** page shows full information when you click an apartment
5. **Images** are optimized automatically by Next.js

The frontend communicates with the backend API to get all data and never directly accesses the database.