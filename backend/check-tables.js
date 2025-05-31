const DatabaseManager = require('./DatabaseManager');

async function checkTables() {
  const db = new DatabaseManager();
  try {
    await db.connect();
    console.log('🔍 Checking database tables and data...\n');
    
    // Check if tables exist
    const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📊 Tables in database:');
    tables.forEach(table => console.log(`   - ${table.name}`));
      // Check users table structure
    console.log('\n🏗️ Users table structure:');
    const userColumns = await db.execute("PRAGMA table_info(users)");
    if (Array.isArray(userColumns)) {
      userColumns.forEach(col => console.log(`   - ${col.name} (${col.type})`));
    } else {
      console.log('   - Error getting columns or unexpected format');
    }
    
    // Check users data
    console.log('\n👤 Users in database:');
    const users = await db.execute('SELECT id, firstName, lastName, email FROM users');
    users.forEach(user => console.log(`   - ${user.id}: ${user.firstName} ${user.lastName} (${user.email})`));
    
    // Check user_roles
    console.log('\n🎭 User roles:');
    const roles = await db.execute('SELECT id, role_name FROM user_roles');
    roles.forEach(role => console.log(`   - ${role.id}: ${role.role_name}`));
    
    // Check user_status
    console.log('\n📊 User status:');
    const statuses = await db.execute('SELECT id, status_name FROM user_status');
    statuses.forEach(status => console.log(`   - ${status.id}: ${status.status_name}`));
    
    // Try the exact query used in findByEmail
    console.log('\n🔍 Testing findByEmail query:');
    const testQuery = `
      SELECT 
        u.id, 
        u.firstName, 
        u.lastName, 
        u.email, 
        u.password_hash,
        u.phone, 
        u.email_verified,
        u.created_at,
        u.updated_at,
        ur.role_name as role,
        us.status_name as status
      FROM users u
      JOIN user_roles ur ON u.role_id = ur.id
      JOIN user_status us ON u.status_id = us.id
      WHERE u.email = ?
    `;
    
    const result = await db.execute(testQuery, ['test@shebaxpert.com']);
    console.log(`Found ${result.length} users with email test@shebaxpert.com`);
    if (result.length > 0) {
      console.log('User data:', result[0]);
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await db.close();
  }
}

checkTables();
