/**
 * Apartment Listing API Server
 * 
 * This is the main entry point for our backend API that handles
 * apartment listings, search, and management functionality.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './services/database';
import apartmentRoutes from './routes/apartments';

// Load configuration from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Set up middleware
app.use(cors({
  origin: CORS_ORIGIN,      // Allow requests from our frontend
  credentials: true,        // Allow cookies and auth headers
}));

app.use(express.json({ limit: '10mb' }));        // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Simple health check to verify the API is running
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Apartment Listing API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount all apartment-related routes
app.use('/api/apartments', apartmentRoutes);

// Handle requests to unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Handle any errors that occur in our application
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

// Initialize and start the server
const startServer = async () => {
  try {
    // Make sure we can connect to the database
    await connectDatabase();
    
    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start everything up
startServer();
