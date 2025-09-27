/**
 * Database Connection Service
 * 
 * This handles connecting to our PostgreSQL database and manages
 * the database lifecycle for the apartment listing application.
 */

import { PrismaClient } from '@prisma/client';

// Create our database connection
const prisma = new PrismaClient();

// Test that we can connect to the database
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Clean up database connection when shutting down
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};

// Export the database connection for use in other files
export { prisma };

// Make sure we close the database connection when the app shuts down
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});
