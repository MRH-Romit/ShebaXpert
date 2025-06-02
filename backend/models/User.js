const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Get a user by ID with role and status information
  static async findById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          u.id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.phone, 
          u.email_verified,
          u.phone_verified,
          u.created_at,
          u.updated_at,
          ur.role_name as role,
          us.status_name as status
        FROM users u
        JOIN user_roles ur ON u.role_id = ur.id
        JOIN user_status us ON u.status_id = us.id
        WHERE u.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Get a user by email with role and status information
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          u.id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.password_hash,
          u.phone, 
          u.email_verified,
          u.phone_verified,
          u.created_at,
          u.updated_at,
          ur.role_name as role,
          us.status_name as status
        FROM users u
        JOIN user_roles ur ON u.role_id = ur.id
        JOIN user_status us ON u.status_id = us.id
        WHERE u.email = ?
      `, [email]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Get a user by phone number with role and status information
  static async findByPhone(phone) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          u.id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.password_hash,
          u.phone, 
          u.email_verified,
          u.phone_verified,
          u.created_at,
          u.updated_at,
          ur.role_name as role,
          us.status_name as status
        FROM users u
        JOIN user_roles ur ON u.role_id = ur.id
        JOIN user_status us ON u.status_id = us.id
        WHERE u.phone = ?
      `, [phone]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by phone:', error);
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Get role ID
      const [roleRows] = await pool.query(
        'SELECT id FROM user_roles WHERE role_name = ?', 
        [userData.role || 'user']
      );
      const roleId = roleRows[0]?.id || 1; // Default to 'user' role
      
      // Insert user data
      const [result] = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, phone, role_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userData.firstName, 
          userData.lastName, 
          userData.email, 
          hashedPassword, 
          userData.phone, 
          roleId
        ]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update a user
  static async update(id, userData) {
    try {
      const setClause = [];
      const params = [];
      
      // Only update provided fields
      if (userData.name) {
        setClause.push('name = ?');
        params.push(userData.name);
      }
      
      if (userData.email) {
        setClause.push('email = ?');
        params.push(userData.email);
      }
      
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        setClause.push('password = ?');
        params.push(hashedPassword);
      }
      
      if (userData.phone) {
        setClause.push('phone = ?');
        params.push(userData.phone);
      }
      
      if (userData.role) {
        setClause.push('role = ?');
        params.push(userData.role);
      }
      
      // Add ID to params array
      params.push(id);
      
      // Execute update
      const [result] = await pool.query(
        `UPDATE users SET ${setClause.join(', ')} WHERE id = ?`,
        params
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete a user
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  // Create email verification token
  static async createEmailVerificationToken(userId) {
    try {
      const token = require('crypto').randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await pool.query(
        'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt]
      );
      
      return token;
    } catch (error) {
      console.error('Error creating email verification token:', error);
      throw error;
    }
  }

  // Verify email with token
  static async verifyEmail(token) {
    try {
      const [rows] = await pool.query(
        `SELECT evt.user_id FROM email_verification_tokens evt 
         WHERE evt.token = ? AND evt.expires_at > NOW() AND evt.used = FALSE`,
        [token]
      );
      
      if (rows.length === 0) {
        return false;
      }
      
      const userId = rows[0].user_id;
      
      // Mark token as used and update user email verification status
      await pool.query('UPDATE email_verification_tokens SET used = TRUE WHERE token = ?', [token]);
      await pool.query('UPDATE users SET email_verified = TRUE WHERE id = ?', [userId]);
      
      return true;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  // Create user session
  static async createSession(userId, sessionToken, refreshToken, expiresAt, ipAddress, userAgent) {
    try {
      await pool.query(
        `INSERT INTO user_sessions (user_id, session_token, refresh_token, expires_at, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, sessionToken, refreshToken, expiresAt, ipAddress, userAgent]
      );
    } catch (error) {
      console.error('Error creating user session:', error);
      throw error;
    }
  }

  // Log login attempt
  static async logLoginAttempt(email, ipAddress, success) {
    try {
      await pool.query(
        'INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, ?)',
        [email, ipAddress, success]
      );
    } catch (error) {
      console.error('Error logging login attempt:', error);
      throw error;
    }
  }
}

module.exports = User;
