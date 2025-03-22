const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('restaurant', 'name logo')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name logo deliveryTime')
      .populate('user', 'fullName');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { 
      user, 
      restaurant, 
      items, 
      subtotal, 
      deliveryFee, 
      total, 
      deliveryAddress, 
      paymentMethod,
      specialInstructions 
    } = req.body;

    // Create the order
    const newOrder = new Order({
      user,
      restaurant,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      status: 'pending',
      estimatedDeliveryTime: '30-45 min' // This could be dynamic based on restaurant
    });

    // Save the order
    const savedOrder = await newOrder.save();

    // Update user's orders array
    await User.findByIdAndUpdate(user, {
      $push: { orders: savedOrder._id }
    });

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cancel an order
router.patch('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow cancellation if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Cannot cancel order that is already being prepared or delivered' 
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 