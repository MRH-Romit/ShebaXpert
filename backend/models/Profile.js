const { pool } = require('../config/db');

class Profile {
  // Get profile by user ID
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
      return rows[0];
    } catch (error) {
      console.error('Error finding profile by user ID:', error);
      throw error;
    }
  }

  // Create a new profile
  static async create(profileData) {
    try {
      const [result] = await pool.query(
        'INSERT INTO profiles (user_id, address, latitude, longitude, service_category, description, availability, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [
          profileData.userId,
          profileData.address,
          profileData.latitude,
          profileData.longitude,
          profileData.serviceCategory,
          profileData.description,
          profileData.availability
        ]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  // Update a profile
  static async update(userId, profileData) {
    try {
      const setClause = [];
      const params = [];
      
      // Only update provided fields
      if (profileData.address !== undefined) {
        setClause.push('address = ?');
        params.push(profileData.address);
      }
      
      if (profileData.latitude !== undefined) {
        setClause.push('latitude = ?');
        params.push(profileData.latitude);
      }
      
      if (profileData.longitude !== undefined) {
        setClause.push('longitude = ?');
        params.push(profileData.longitude);
      }
      
      if (profileData.serviceCategory !== undefined) {
        setClause.push('service_category = ?');
        params.push(profileData.serviceCategory);
      }
      
      if (profileData.description !== undefined) {
        setClause.push('description = ?');
        params.push(profileData.description);
      }
      
      if (profileData.availability !== undefined) {
        setClause.push('availability = ?');
        params.push(profileData.availability);
      }
      
      setClause.push('updated_at = NOW()');
      
      // Add user ID to params array
      params.push(userId);
      
      // Execute update
      const [result] = await pool.query(
        `UPDATE profiles SET ${setClause.join(', ')} WHERE user_id = ?`,
        params
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get nearby service providers
  static async findNearbyProviders(latitude, longitude, radius = 5, category = null) {
    try {
      // Calculate distance using Haversine formula directly in SQL
      // Distance is in kilometers
      let query = `
        SELECT 
          p.*,
          u.name,
          u.phone,
          (
            6371 * acos(
              cos(radians(?)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(?))
              + sin(radians(?)) * sin(radians(p.latitude))
            )
          ) AS distance
        FROM 
          profiles p
        JOIN 
          users u ON p.user_id = u.id
        WHERE 
          u.role = 'service_provider'
      `;
      
      const params = [latitude, longitude, latitude];
      
      if (category) {
        query += ' AND p.service_category = ?';
        params.push(category);
      }
      
      query += ` HAVING distance <= ? ORDER BY distance`;
      params.push(radius);
      
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error finding nearby providers:', error);
      throw error;
    }
  }
}

module.exports = Profile;
