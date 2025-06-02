const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// JWT token generation
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/service-providers');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'nidDocument') {
      // Allow PDF, JPG, JPEG, PNG for NID documents
      if (file.mimetype.match(/^(application\/pdf|image\/(jpeg|jpg|png))$/)) {
        cb(null, true);
      } else {
        cb(new Error('NID document must be PDF, JPG, JPEG, or PNG'), false);
      }
    } else if (file.fieldname === 'photo') {
      // Allow only images for photos
      if (file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Photo must be JPG, JPEG, or PNG'), false);
      }
    } else {
      cb(new Error('Unexpected field'), false);
    }
  }
});

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
    if (process.env.NODE_ENV !== 'production') {
      console.log('User object from DB:', user);
    }
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

// Register a new service provider
exports.registerServiceProvider = async (req, res) => {
  try {
    const { fullName, phone, email, location, serviceCategory, gender, workDescription, password } = req.body;

    // Validate required fields
    if (!fullName || !phone || !location || !serviceCategory || !gender || !workDescription || !password) {
      return res.status(400).json({ message: 'সকল প্রয়োজনীয় তথ্য পূরণ করুন' });
    }

    // Validate phone number format (11 digits for Bangladesh)
    if (!/^[0-9]{11}$/.test(phone)) {
      return res.status(400).json({ message: 'সঠিক ফোন নম্বর দিন (১১ সংখ্যার)' });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({ message: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' });
    }

    // Check if user with this phone already exists
    const existingUser = await User.findByEmail(email || phone);
    if (existingUser) {
      return res.status(400).json({ message: 'এই ফোন নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একাউন্ট আছে' });
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Create user account with service_provider role
    const userId = await User.create({
      firstName,
      lastName,
      email: email || phone, // Use phone as email if email not provided
      password,
      phone,
      role: 'service_provider'
    });

    // Create service provider profile
    const serviceProviderId = await ServiceProvider.create({
      userId,
      fullName,
      serviceCategory,
      gender,
      location,
      workDescription
    });

    const token = generateToken(userId, 'service_provider');

    res.status(201).json({
      message: 'সেবা প্রদানকারী সফলভাবে নিবন্ধিত হয়েছেন',
      token,
      user: {
        id: userId,
        firstName,
        lastName,
        email: email || phone,
        phone,
        role: 'service_provider',
        serviceProviderId
      }
    });

  } catch (error) {
    console.error('Service provider registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'এই ফোন নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একাউন্ট আছে' });
    }
    res.status(500).json({ message: 'সার্ভার ত্রুটি হয়েছে' });
  }
};

// Upload service provider files
exports.uploadServiceProviderFiles = [
  upload.fields([{ name: 'nidDocument', maxCount: 1 }, { name: 'photo', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Check if service provider exists
      const serviceProvider = await ServiceProvider.findByUserId(userId);
      if (!serviceProvider) {
        return res.status(404).json({ message: 'সেবা প্রদানকারী পাওয়া যায়নি' });
      }

      let nidDocumentPath = null;
      let photoPath = null;

      // Process uploaded files
      if (req.files) {
        if (req.files.nidDocument && req.files.nidDocument[0]) {
          nidDocumentPath = req.files.nidDocument[0].filename;
        }
        if (req.files.photo && req.files.photo[0]) {
          photoPath = req.files.photo[0].filename;
        }
      }

      // Update service provider with file paths
      if (nidDocumentPath || photoPath) {
        await ServiceProvider.updateFiles(userId, nidDocumentPath, photoPath);
      }

      res.status(200).json({
        message: 'ফাইল সফলভাবে আপলোড হয়েছে',
        files: {
          nidDocument: nidDocumentPath,
          photo: photoPath
        }
      });

    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: 'ফাইল আপলোডে সমস্যা হয়েছে' });
    }
  }
];
