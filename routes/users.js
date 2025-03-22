const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.get('/me', auth, authController.getCurrentUser);
router.put('/me', auth, authController.updateProfile);
router.post('/addresses', auth, authController.addAddress);
router.delete('/addresses/:addressId', auth, authController.deleteAddress);
router.post('/favorites', auth, authController.toggleFavorite);

module.exports = router; 