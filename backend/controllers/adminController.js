const { pool } = require('../config/db');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get user statistics
    const [userStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN ur.role_name = 'user' THEN 1 ELSE 0 END) as regular_users,
        SUM(CASE WHEN ur.role_name = 'service_provider' THEN 1 ELSE 0 END) as service_providers,
        SUM(CASE WHEN us.status_name = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN us.status_name = 'pending' THEN 1 ELSE 0 END) as pending_users
      FROM users u
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      LEFT JOIN user_status us ON u.status_id = us.id
    `);

    // Get service provider statistics
    const [providerStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_providers,
        SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END) as verified_providers,
        SUM(CASE WHEN verification_status = 'pending' THEN 1 ELSE 0 END) as pending_verification,
        SUM(CASE WHEN verification_status = 'rejected' THEN 1 ELSE 0 END) as rejected_providers,
        AVG(average_rating) as avg_rating
      FROM service_providers
    `);

    // Get recent registrations (last 30 days)
    const [recentUsers] = await pool.execute(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    // Get login attempts statistics
    const [loginStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_attempts,
        SUM(success) as successful_logins,
        COUNT(*) - SUM(success) as failed_attempts
      FROM login_attempts 
      WHERE attempted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    res.status(200).json({
      success: true,
      data: {
        users: userStats[0],
        providers: providerStats[0] || {
          total_providers: 0,
          verified_providers: 0,
          pending_verification: 0,
          rejected_providers: 0,
          avg_rating: 0
        },
        recentRegistrations: recentUsers,
        loginActivity: loginStats[0]
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [users] = await pool.execute(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        ur.role_name as role,
        us.status_name as status,
        u.email_verified,
        u.phone_verified,
        u.created_at,
        u.updated_at
      FROM users u
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      LEFT JOIN user_status us ON u.status_id = us.id
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_records: total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Get all service providers
const getServiceProviders = async (req, res) => {
  try {
    const [providers] = await pool.execute(`
      SELECT 
        sp.*,
        u.email,
        u.phone,
        ur.role_name,
        us.status_name
      FROM service_providers sp
      LEFT JOIN users u ON sp.user_id = u.id
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      LEFT JOIN user_status us ON u.status_id = us.id
      ORDER BY sp.created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('Error fetching service providers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service providers'
    });
  }
};

// Get database tables and counts
const getDatabaseInfo = async (req, res) => {
  try {
    const tables = [
      'users',
      'user_roles', 
      'user_status',
      'profiles',
      'notifications',
      'user_sessions',
      'password_reset_tokens',
      'email_verification_tokens',
      'login_attempts',
      'service_providers'
    ];

    const tableInfo = [];

    for (const table of tables) {
      try {
        const [countResult] = await pool.execute(`SELECT COUNT(*) as count FROM ${table}`);
        const [structureResult] = await pool.execute(`DESCRIBE ${table}`);
        
        tableInfo.push({
          table_name: table,
          record_count: countResult[0].count,
          columns: structureResult.length,
          structure: structureResult
        });
      } catch (error) {
        console.error(`Error querying table ${table}:`, error.message);
        tableInfo.push({
          table_name: table,
          record_count: 0,
          columns: 0,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        database_name: process.env.DB_NAME || 'shebaxpert',
        tables: tableInfo,
        total_tables: tableInfo.length
      }
    });
  } catch (error) {
    console.error('Error fetching database info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching database information'
    });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { statusName } = req.body;

    // Get status ID
    const [statusResult] = await pool.execute(
      'SELECT id FROM user_status WHERE status_name = ?',
      [statusName]
    );

    if (statusResult.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const statusId = statusResult[0].id;

    // Update user status
    await pool.execute(
      'UPDATE users SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [statusId, userId]
    );

    res.status(200).json({
      success: true,
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
};

// Verify service provider
const verifyServiceProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { verificationStatus } = req.body;

    await pool.execute(
      'UPDATE service_providers SET verification_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [verificationStatus, providerId]
    );

    res.status(200).json({
      success: true,
      message: 'Service provider verification status updated'
    });
  } catch (error) {
    console.error('Error updating provider verification:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating verification status'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getServiceProviders,
  getDatabaseInfo,
  updateUserStatus,
  verifyServiceProvider
};
