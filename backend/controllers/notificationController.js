const Notification = require('../models/Notification');
const facebookApi = require('../config/facebookApi');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit, offset } = req.query;
    
    // Get notifications
    const notifications = await Notification.findByUserId(
      userId,
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0
    );
    
    // Get unread count
    const unreadCount = await Notification.getUnreadCount(userId);
    
    res.status(200).json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;
    
    // Mark as read
    const result = await Notification.markAsRead(notificationId, userId);
    
    if (result) {
      res.status(200).json({ message: 'Notification marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Mark all as read
    const count = await Notification.markAllAsRead(userId);
    
    res.status(200).json({
      message: 'All notifications marked as read',
      count
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;
    
    // Delete
    const result = await Notification.delete(notificationId, userId);
    
    if (result) {
      res.status(200).json({ message: 'Notification deleted' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check Facebook comments and create notifications
exports.checkFacebookComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Get new comments
    const comments = await facebookApi.getComments(postId);
    
    // Process each comment - in a real app you'd need to track which ones you've already processed
    let notificationCount = 0;
    
    for (const comment of comments) {
      // Find service provider associated with this post
      // Note: This requires storing post IDs in your database when they're created
      // This is simplified here - you'd need to implement proper tracking
      const serviceProviderId = await getProviderIdByPostId(postId);
      
      if (serviceProviderId) {
        // Create notification
        await Notification.create({
          userId: serviceProviderId,
          message: `New comment from ${comment.from.name}: "${comment.message}"`,
          type: 'facebook_comment',
          referenceId: comment.id,
          isRead: false
        });
        
        notificationCount++;
      }
    }
    
    res.status(200).json({
      message: `Created ${notificationCount} new notifications`,
      commentCount: comments.length
    });
  } catch (error) {
    console.error('Check Facebook comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function - in a real app this would query your database
// This is a placeholder
async function getProviderIdByPostId(postId) {
  // In a real implementation, you would:
  // 1. Look up the post ID in your database to find which provider it's for
  // 2. Return the provider's user ID
  
  return null; // Placeholder
}
