const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT token generation
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Register a new user (Sign Up)
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const userId = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'user'
    });
    const token = generateToken(userId, role || 'user');
    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: userId,
        firstName,
        lastName,
        email,
        role: role || 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('User object from DB:', user);
    if (user.status !== 'active') {
      return res.status(401).json({ message: `Account is ${user.status}. Please contact support.` });
    }
    let isPasswordValid;
    try {
      isPasswordValid = await User.verifyPassword(password, user.password_hash);
      console.log('Password valid:', isPasswordValid);
    } catch (err) {
      console.error('Password verification error:', err);
      return res.status(500).json({ message: 'Password verification error' });
    }
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user.id, user.role);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name, // MySQL field
        lastName: user.last_name,   // MySQL field
        email: user.email,
        role: user.role,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};
