import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/users.js';
import clientRoutes from './routes/clients.js';
import serviceRoutes from './routes/services.js';
import invoiceRoutes from './routes/invoices.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://richa:richa@paymint.jbefpzh.mongodb.net/?retryWrites=true&w=majority&appName=PayMint')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/invoices', invoiceRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('PayMint API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});