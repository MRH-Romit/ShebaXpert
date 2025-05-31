const DatabaseManager = require('./DatabaseManager');

async function checkUserDetails() {
  const db = new DatabaseManager();
  try {
    await db.connect();
    console.log('🔍 Checking test user details...\n');
    
    // Get test user raw data
    const users = await db.execute('SELECT * FROM users WHERE email = ?', ['test@shebaxpert.com']);
    console.log('👤 Test user raw data:', users[0]);
    
    if (users.length > 0) {
      const user = users[0];
      
      // Check role
      console.log(`\n🎭 Checking role_id ${user.role_id}:`);
      const roles = await db.execute('SELECT * FROM user_roles WHERE id = ?', [user.role_id]);
      console.log('Role data:', roles[0]);
      
      // Check status
      console.log(`\n📊 Checking status_id ${user.status_id}:`);
      const statuses = await db.execute('SELECT * FROM user_status WHERE id = ?', [user.status_id]);
      console.log('Status data:', statuses[0]);
      
      // Try the JOIN query manually
      console.log('\n🔗 Testing JOIN query:');
      try {
        const joinResult = await db.execute(`
          SELECT 
            u.id, 
            u.firstName, 
            u.lastName, 
            u.email, 
            u.password_hash,
            u.role_id,
            u.status_id,
            ur.role_name as role,
            us.status_name as status
          FROM users u
          LEFT JOIN user_roles ur ON u.role_id = ur.id
          LEFT JOIN user_status us ON u.status_id = us.id
          WHERE u.email = ?
        `, ['test@shebaxpert.com']);
        console.log('JOIN result:', joinResult[0]);
      } catch (joinError) {
        console.error('JOIN query error:', joinError);
      }
    }
    
  } catch (error) {
    console.error('Error checking user details:', error);
  } finally {
    await db.close();
  }
}

checkUserDetails();
