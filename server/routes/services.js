import express from 'express';
import Service from '../models/Service.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all services for a user
router.get('/', auth, async (req, res) => {
  try {
    const services = await Service.find({ user: req.user._id }).sort({ title: 1 });
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single service
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (err) {
    console.error('Error fetching service:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new service
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, rate } = req.body;
    
    const newService = new Service({
      title,
      description,
      rate,
      user: req.user._id
    });
    
    const service = await newService.save();
    res.status(201).json(service);
  } catch (err) {
    console.error('Error creating service:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a service
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, rate } = req.body;
    
    // Only update fields that were actually passed
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (rate !== undefined) updates.rate = rate;
    
    // Find and update service
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (err) {
    console.error('Error updating service:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a service
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service removed' });
  } catch (err) {
    console.error('Error deleting service:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;