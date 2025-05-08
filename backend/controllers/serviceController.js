const Profile = require('../models/Profile');
const facebookApi = require('../config/facebookApi');
const openaiSummary = require('../utils/summarizer');
const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const pdf = require('html-pdf');

// Get all service categories
exports.getCategories = async (req, res) => {
  try {
    // For now, we'll return a static list of categories
    // In the future, this would come from the database
    const categories = [
      { id: 'plumbing', name: 'প্লাম্বিং' },
      { id: 'electrical', name: 'ইলেকট্রিক্যাল' },
      { id: 'painting', name: 'পেইন্টিং' },
      { id: 'ac', name: 'এসি সার্ভিসিং' },
      { id: 'cleaning', name: 'ক্লিনিং' },
      { id: 'carpentry', name: 'কার্পেন্ট্রি' },
      { id: 'moving', name: 'হোম শিফটিং' },
    ];
    
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get service providers by category
exports.getProvidersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { latitude, longitude, radius } = req.query;
    
    let providers;
    
    if (latitude && longitude) {
      // If location is provided, get nearby providers
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = radius ? parseFloat(radius) : 5; // Default 5km radius
      
      providers = await Profile.findNearbyProviders(lat, lng, rad, category);
    } else {
      // Otherwise, just filter by category
      // This is a simplified query - in a real app, you'd paginate results
      const [rows] = await pool.query(`
        SELECT p.*, u.name, u.phone
        FROM profiles p
        JOIN users u ON p.user_id = u.id
        WHERE p.service_category = ? AND u.role = 'service_provider'
        LIMIT 50
      `, [category]);
      
      providers = rows;
    }
    
    res.status(200).json({ providers });
  } catch (error) {
    console.error('Get providers by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate AI summary of service provider
exports.generateSummary = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Get provider details
    const provider = await Profile.findByUserId(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    // Get user details
    const user = await User.findById(providerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate summary using OpenAI
    const summary = await openaiSummary.generateProviderSummary({
      name: user.name,
      phone: user.phone,
      address: provider.address,
      service: provider.serviceCategory,
      description: provider.description,
      availability: provider.availability
    });
    
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Post service provider to Facebook
exports.postToFacebook = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { message, generateSummary } = req.body;
    
    // Get provider details
    const provider = await Profile.findByUserId(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    // Get user details
    const user = await User.findById(providerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let postMessage = message;
    
    // If summary generation is requested
    if (generateSummary) {
      // Generate summary using OpenAI
      const summary = await openaiSummary.generateProviderSummary({
        name: user.name,
        phone: user.phone,
        address: provider.address,
        service: provider.serviceCategory,
        description: provider.description,
        availability: provider.availability
      });
      
      postMessage = summary;
    }
    
    // Add contact info if not included
    if (!postMessage.includes(user.phone)) {
      postMessage += `\n\nযোগাযোগ: ${user.phone}`;
    }
    
    // Add app link
    postMessage += `\n\nআরো বিস্তারিত জানতে সেবাXpert অ্যাপ ডাউনলোড করুন।`;
    
    // Post to Facebook
    const result = await facebookApi.postToPage(postMessage);
    
    res.status(200).json({ 
      message: 'Posted to Facebook successfully',
      postId: result.id
    });
  } catch (error) {
    console.error('Post to Facebook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate PDF for offline use
exports.generatePDF = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Get provider details
    const provider = await Profile.findByUserId(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    // Get user details
    const user = await User.findById(providerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create HTML for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>সেবাXpert - ${user.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #4CAF50; }
          .details { margin-bottom: 20px; }
          .details h2 { color: #333; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">সেবাXpert</div>
            <p>পেশাদার সেবা প্রদানকারী</p>
          </div>
          
          <div class="details">
            <h2>${user.name}</h2>
            <div class="detail-row">
              <span class="label">সেবা:</span> ${provider.serviceCategory}
            </div>
            <div class="detail-row">
              <span class="label">ফোন:</span> ${user.phone}
            </div>
            <div class="detail-row">
              <span class="label">ঠিকানা:</span> ${provider.address || 'অনির্দিষ্ট'}
            </div>
            <div class="detail-row">
              <span class="label">উপলব্ধতা:</span> ${provider.availability || 'সপ্তাহের সব দিন, সকাল ৯টা থেকে রাত ৮টা'}
            </div>
            <div class="detail-row">
              <span class="label">বিবরণ:</span> ${provider.description || 'কোন বিবরণ নেই'}
            </div>
          </div>
          
          <div class="footer">
            <p>এই তথ্য সংগ্রহ করা হয়েছে সেবাXpert প্ল্যাটফর্ম থেকে।</p>
            <p>© ${new Date().getFullYear()} সেবাXpert - সকল স্বত্ব সংরক্ষিত</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Generate PDF filename
    const filename = `provider_${providerId}_${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '..', 'public', 'downloads', filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Generate PDF
    pdf.create(htmlContent, { format: 'A4' }).toFile(filepath, (err, result) => {
      if (err) {
        console.error('PDF generation error:', err);
        return res.status(500).json({ message: 'Error generating PDF' });
      }
      
      // Return download URL
      const downloadUrl = `/downloads/${filename}`;
      res.status(200).json({
        message: 'PDF generated successfully',
        downloadUrl
      });
    });
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
