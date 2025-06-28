const { pool } = require('./config/db');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    console.log('🔄 Creating admin user...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // First, ensure admin role exists
    let [roles] = await pool.execute('SELECT id FROM user_roles WHERE role_name = ?', ['admin']);
    let adminRoleId;
    
    if (roles.length === 0) {
      console.log('📝 Creating admin role...');
      const [result] = await pool.execute(
        'INSERT INTO user_roles (role_name, description) VALUES (?, ?)', 
        ['admin', 'System administrator']
      );
      adminRoleId = result.insertId;
    } else {
      adminRoleId = roles[0].id;
      console.log('✅ Admin role already exists');
    }
    
    // Check if admin user already exists
    const [existingAdmin] = await pool.execute(
      'SELECT id FROM users WHERE email = ?', 
      ['admin@shebaxpert.com']
    );
    
    if (existingAdmin.length > 0) {
      console.log('⚠️ Admin user already exists');
      console.log('📧 Email: admin@shebaxpert.com');
      console.log('🔒 Password: admin123');
      return;
    }
    
    // Create admin user
    const [result] = await pool.execute(`
      INSERT INTO users (first_name, last_name, email, password_hash, role_id, status_id, email_verified) 
      VALUES (?, ?, ?, ?, ?, 1, 1)
    `, ['Admin', 'User', 'admin@shebaxpert.com', hashedPassword, adminRoleId]);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@shebaxpert.com');
    console.log('🔒 Password: admin123');
    console.log('🆔 User ID:', result.insertId);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdminUser();
