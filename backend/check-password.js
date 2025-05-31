const DatabaseManager = require('./DatabaseManager');

async function checkTestUserPassword() {
  const db = new DatabaseManager();
  try {
    await db.connect();
    console.log('🔍 Checking test user password hash...\n');
    
    const user = await db.execute('SELECT firstName, lastName, email, password_hash FROM users WHERE email = ?', ['test@shebaxpert.com']);
    
    if (user.length === 0) {
      console.log('❌ Test user not found');
    } else {
      const testUser = user[0];
      console.log('✅ Found test user:');
      console.log(`Name: ${testUser.firstName} ${testUser.lastName}`);
      console.log(`Email: ${testUser.email}`);
      console.log(`Password Hash: ${testUser.password_hash}`);
      
      // Test password verification
      const bcrypt = require('bcrypt');
      const passwords = ['Test123!', 'password123', 'test123', 'testpassword'];
      
      console.log('\n🔑 Testing password verification:');
      for (const password of passwords) {
        try {
          const isValid = await bcrypt.compare(password, testUser.password_hash);
          console.log(`- "${password}": ${isValid ? '✅ VALID' : '❌ Invalid'}`);
        } catch (error) {
          console.log(`- "${password}": ❌ Error - ${error.message}`);
        }
      }
    }
    
    console.log('\n📊 Password check completed!');
  } catch (error) {
    console.error('Error checking password:', error);
  } finally {
    await db.close();
  }
}

checkTestUserPassword();
