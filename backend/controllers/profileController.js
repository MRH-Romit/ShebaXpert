const Profile = require('../models/Profile');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

// Get profile by user ID
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    
    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get profile info
    const profile = await Profile.findByUserId(userId);
    
    // Remove sensitive data
    const { password, ...userData } = user;
    
    res.status(200).json({
      user: userData,
      profile: profile || {}
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profileData = {
      userId,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      serviceCategory: req.body.serviceCategory,
      description: req.body.description,
      availability: req.body.availability
    };
    
    // Check if profile exists
    const existingProfile = await Profile.findByUserId(userId);
    
    let result;
    if (existingProfile) {
      // Update existing profile
      result = await Profile.update(userId, profileData);
    } else {
      // Create new profile
      result = await Profile.create(profileData);
    }
    
    if (result) {
      // Get updated profile
      const updatedProfile = await Profile.findByUserId(userId);
      res.status(200).json({
        message: 'Profile updated successfully',
        profile: updatedProfile
      });
    } else {
      res.status(400).json({ message: 'Failed to update profile' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Find nearby service providers
exports.findNearbyProviders = async (req, res) => {
  try {
    const { latitude, longitude, radius, category } = req.query;
    
    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Convert to numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = radius ? parseFloat(radius) : 5; // Default 5km radius
    
    // Get nearby providers
    const providers = await Profile.findNearbyProviders(lat, lng, rad, category);
    
    res.status(200).json({ providers });
  } catch (error) {
    console.error('Find nearby providers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get service provider profile
exports.getServiceProviderProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is service provider
    if (user.role !== 'service_provider') {
      return res.status(403).json({ message: 'Access denied. User is not a service provider.' });
    }
    
    // Get service provider specific info
    const serviceProvider = await ServiceProvider.findByUserId(userId);
    
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider profile not found' });
    }
    
    // Remove sensitive data and format response
    const { password_hash, ...userData } = user;
    
    res.status(200).json({
      id: userData.id,
      fullName: serviceProvider.full_name,
      email: userData.email,
      phone: userData.phone,
      location: serviceProvider.location,
      serviceCategory: serviceProvider.service_category,
      gender: serviceProvider.gender,
      workDescription: serviceProvider.work_description,
      profileImage: serviceProvider.photo_path,
      nidDocument: serviceProvider.nid_document_path,
      experience: serviceProvider.experience_years || '১',
      emailVerified: userData.email_verified,
      phoneVerified: userData.phone_verified,
      status: serviceProvider.status,
      rating: serviceProvider.rating,
      totalJobs: serviceProvider.total_jobs,
      createdAt: serviceProvider.created_at
    });
  } catch (error) {
    console.error('Get service provider profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
