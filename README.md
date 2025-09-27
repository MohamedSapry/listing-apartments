# Apartment Listing Application

A modern web application for browsing apartment listings with search and filtering capabilities.

## Technologies Used

- **Backend**: Node.js with TypeScript and Express.js
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Containerization**: Docker and Docker Compose

## Quick Start

1. Make sure Docker is installed and running on your system
2. Clone this repository
3. Run the application:

```bash
docker-compose up --build
```

This single command will:
- Start PostgreSQL database
- Run database migrations
- Start the backend API server
- Start the frontend web application

## Access the Application

- **Website**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Database**: PostgreSQL on port 5432

## Project Structure

```
apartment-listing/
├── backend/          # Node.js API server
├── frontend/         # Next.js web application  
├── docker-compose.yml
└── README.md
```

## Adding Sample Data

The database will be created automatically. To add sample apartments:

1. Create compounds first:
```bash
docker exec apartment_db psql -U apartment_user -d apartment_listing -c "INSERT INTO compound (name, city, district, address_line) VALUES ('Palm Hills', 'Cairo', 'New Cairo', 'New Cairo City');"
```

2. Create amenities:
```bash
docker exec apartment_db psql -U apartment_user -d apartment_listing -c "INSERT INTO amenity (name) VALUES ('Swimming Pool'), ('Gym'), ('Parking');"
```

3. Add apartments via API:
```bash
curl -X POST http://localhost:3001/api/apartments \
  -H "Content-Type: application/json" \
  -d '{
    "compoundId": 1,
    "title": "Modern 2BR Apartment",
    "referenceNumber": "APT001",
    "listingType": "rent",
    "price": 25000,
    "currency": "EGP",
    "sizeSqm": 120,
    "bedrooms": 2,
    "bathrooms": 2,
    "finished": true,
    "amenityIds": [1, 2, 3]
  }'
```

## Stopping the Application

```bash
docker-compose down
```

To completely reset (including data):
```bash
docker-compose down -v
```