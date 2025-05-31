const User = require('../models/User-new');
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

// Register a new user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ 
        message: 'All fields are required',
        required: ['firstName', 'lastName', 'email', 'password', 'phone']
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const userId = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'user'  // Default role is 'user'
    });
    
    // Create email verification token
    const verificationToken = await User.createEmailVerificationToken(userId);
    
    // Generate JWT token
    const token = generateToken(userId, role || 'user');
    
    // Log the registration
    await User.logLoginAttempt(email, req.ip, true);
    
    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      token,
      user: {
        id: userId,
        firstName,
        lastName,
        email,
        role: role || 'user'
      },
      emailVerificationRequired: true
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
    
    // Validate input
    if (!email || !password) {
      await User.logLoginAttempt(email || 'unknown', req.ip, false);
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      await User.logLoginAttempt(email, req.ip, false);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user account is active
    if (user.status !== 'active') {
      await User.logLoginAttempt(email, req.ip, false);
      return res.status(401).json({ 
        message: `Account is ${user.status}. Please contact support.` 
      });
    }
    
    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      await User.logLoginAttempt(email, req.ip, false);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken(user.id, user.role);
    
    // Log successful login
    await User.logLoginAttempt(email, req.ip, true);
    
    // Create session (optional for enhanced security)
    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    const refreshToken = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await User.createSession(
      user.id, 
      sessionToken, 
      refreshToken, 
      expiresAt, 
      req.ip, 
      req.get('User-Agent')
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Email verification
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }
    
    const isVerified = await User.verifyEmail(token);
    
    if (isVerified) {
      res.status(200).json({ 
        message: 'Email verified successfully',
        verified: true
      });
    } else {
      res.status(400).json({ 
        message: 'Invalid or expired verification token',
        verified: false
      });
    }
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userData } = user;
    
    res.status(200).json({ user: userData });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Get user
    const user = await User.findById(req.userId);
    
    // Verify current password
    const isPasswordValid = await User.verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    await User.update(req.userId, { password: newPassword });
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
