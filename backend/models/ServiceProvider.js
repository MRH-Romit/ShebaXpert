const { pool } = require('../config/db');

class ServiceProvider {
  // Create a new service provider
  static async create(serviceProviderData) {
    try {
      const {
        userId,
        fullName,
        serviceCategory,
        gender,
        location,
        workDescription,
        nidDocumentPath = null,
        photoPath = null
      } = serviceProviderData;

      const [result] = await pool.query(`
        INSERT INTO service_providers 
        (user_id, full_name, service_category, gender, location, work_description, nid_document_path, photo_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [userId, fullName, serviceCategory, gender, location, workDescription, nidDocumentPath, photoPath]);

      return result.insertId;
    } catch (error) {
      console.error('Error creating service provider:', error);
      throw error;
    }
  }

  // Find service provider by user ID
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          sp.*,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.email_verified,
          u.phone_verified
        FROM service_providers sp
        JOIN users u ON sp.user_id = u.id
        WHERE sp.user_id = ?
      `, [userId]);
      return rows[0];
    } catch (error) {
      console.error('Error finding service provider by user ID:', error);
      throw error;
    }
  }

  // Find service provider by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          sp.*,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.email_verified,
          u.phone_verified
        FROM service_providers sp
        JOIN users u ON sp.user_id = u.id
        WHERE sp.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding service provider by ID:', error);
      throw error;
    }
  }

  // Update service provider files
  static async updateFiles(userId, nidDocumentPath, photoPath) {
    try {
      const [result] = await pool.query(`
        UPDATE service_providers 
        SET nid_document_path = ?, photo_path = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [nidDocumentPath, photoPath, userId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating service provider files:', error);
      throw error;
    }
  }

  // Update verification status
  static async updateVerificationStatus(userId, status) {
    try {
      const [result] = await pool.query(`
        UPDATE service_providers 
        SET verification_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [status, userId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw error;
    }
  }

  // Get all service providers by category
  static async findByCategory(category, limit = 10, offset = 0) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          sp.*,
          u.first_name,
          u.last_name,
          u.phone
        FROM service_providers sp
        JOIN users u ON sp.user_id = u.id
        WHERE sp.service_category = ? AND sp.verification_status = 'verified' AND sp.is_available = TRUE
        ORDER BY sp.average_rating DESC, sp.total_jobs DESC
        LIMIT ? OFFSET ?
      `, [category, limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error finding service providers by category:', error);
      throw error;
    }
  }

  // Get all service providers by location
  static async findByLocation(location, limit = 10, offset = 0) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          sp.*,
          u.first_name,
          u.last_name,
          u.phone
        FROM service_providers sp
        JOIN users u ON sp.user_id = u.id
        WHERE sp.location LIKE ? AND sp.verification_status = 'verified' AND sp.is_available = TRUE
        ORDER BY sp.average_rating DESC, sp.total_jobs DESC
        LIMIT ? OFFSET ?
      `, [`%${location}%`, limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error finding service providers by location:', error);
      throw error;
    }
  }

  // Update availability
  static async updateAvailability(userId, isAvailable) {
    try {
      const [result] = await pool.query(`
        UPDATE service_providers 
        SET is_available = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [isAvailable, userId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  }

  // Update rating (usually called after job completion)
  static async updateRating(userId, newRating) {
    try {
      await pool.query(`
        UPDATE service_providers 
        SET 
          average_rating = (
            (average_rating * total_jobs + ?) / (total_jobs + 1)
          ),
          total_jobs = total_jobs + 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [newRating, userId]);

      return true;
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  }
}

module.exports = ServiceProvider;
