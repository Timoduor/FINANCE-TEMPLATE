import { config } from 'dotenv';
config(); // Loads environment variables from .env

import { sql } from '@vercel/postgres';

async function testConnection() {
 try {
  const result = await sql`SELECT NOW();`;
  console.log('Database connection successful:', result);
 } catch (error) {
  console.error('Database connection failed:', error);
 }
}

testConnection();
