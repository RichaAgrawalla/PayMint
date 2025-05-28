import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', MONGODB_URI);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    // List all collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log('-', collection.name);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  })
  .finally(() => {
    // Close the connection
    mongoose.connection.close();
    console.log('\nConnection closed.');
  }); 