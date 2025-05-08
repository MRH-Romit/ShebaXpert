const { pool } = require('../config/db');

class Notification {
  // Get notifications for a user
  static async findByUserId(userId, limit = 10, offset = 0) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [userId, limit, offset]
      );
      return rows;
    } catch (error) {
      console.error('Error finding notifications by user ID:', error);
      throw error;
    }
  }

  // Create a new notification
  static async create(notificationData) {
    try {
      const [result] = await pool.query(
        'INSERT INTO notifications (user_id, message, type, reference_id, is_read, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [
          notificationData.userId,
          notificationData.message,
          notificationData.type,
          notificationData.referenceId,
          notificationData.isRead || false
        ]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(id, userId) {
    try {
      const [result] = await pool.query(
        'UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      const [result] = await pool.query(
        'UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false',
        [userId]
      );
      
      return result.affectedRows;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  static async delete(id, userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
        [userId]
      );
      
      return rows[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}

module.exports = Notification;
