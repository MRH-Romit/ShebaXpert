const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Get a user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Get a user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Insert user data
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        [userData.name, userData.email, hashedPassword, userData.phone, userData.role || 'user']
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
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
