import express from 'express';
import Client from '../models/Client.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all clients for a user
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user.id });
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid user ID format' });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error while fetching clients' });
    }
  }
});

// Get a single client
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (err) {
    console.error('Error fetching client:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new client
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, company, address, phone } = req.body;
    
    // Check if client with same email already exists for this user
    const existingClient = await Client.findOne({
      email,
      user: req.user._id
    });
    
    if (existingClient) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }
    
    const newClient = new Client({
      name,
      email,
      company,
      address,
      phone,
      user: req.user._id
    });
    
    const client = await newClient.save();
    res.status(201).json(client);
  } catch (err) {
    console.error('Error creating client:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a client
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, company, address, phone } = req.body;
    
    // Check if client with same email already exists (excluding the current client)
    if (email) {
      const existingClient = await Client.findOne({
        email,
        user: req.user._id,
        _id: { $ne: req.params.id }
      });
      
      if (existingClient) {
        return res.status(400).json({ message: 'Another client with this email already exists' });
      }
    }
    
    // Only update fields that were actually passed
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (company !== undefined) updates.company = company;
    if (address !== undefined) updates.address = address;
    if (phone !== undefined) updates.phone = phone;
    
    // Find and update client
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates },
      { new: true }
    );
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (err) {
    console.error('Error updating client:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ message: 'Client removed' });
  } catch (err) {
    console.error('Error deleting client:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;