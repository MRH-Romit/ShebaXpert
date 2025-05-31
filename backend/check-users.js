const DatabaseManager = require('./DatabaseManager');

async function checkUsers() {
  const db = new DatabaseManager();
  try {
    await db.connect();
    console.log('🔍 Checking users in database...\n');
    
    const users = await db.execute('SELECT id, firstName, lastName, email, phone FROM users');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log('✅ Found users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user.id}`);
      });
    }
    
    console.log('\n📊 Database check completed!');
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await db.close();
  }
}

checkUsers();
