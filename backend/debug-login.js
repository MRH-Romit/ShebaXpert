const User = require('./models/User-new');

async function debugLogin() {
  try {
    console.log('🔍 Debugging login process...\n');
    
    const email = 'test@shebaxpert.com';
    const password = 'Test123!';
    
    console.log(`1. Looking for user with email: ${email}`);
    const user = await User.findByEmail(email);
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Name: ${user.firstName} ${user.lastName}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Status: ${user.status}`);
    console.log(`   - Password Hash: ${user.password_hash}`);
    
    console.log(`\n2. Verifying password: "${password}"`);
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    console.log(`   - Password valid: ${isPasswordValid}`);
    
    if (user.status !== 'active') {
      console.log(`❌ Account status is not active: ${user.status}`);
    } else {
      console.log('✅ Account status is active');
    }
    
    console.log('\n📊 Debug completed!');
  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugLogin();
