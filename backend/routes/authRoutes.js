// Authentication routes
const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, logout } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', register);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', login);

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
router.post('/logout', auth, logout);

// @desc    Get current user profile
// @route   GET /api/v1/auth/profile
// @access  Private
router.get('/profile', auth, getProfile);

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
router.put('/profile', auth, updateProfile);

module.exports = router;