const { pool } = require('./config/db');

async function getUserStatistics() {
    try {
        console.log('📊 Fetching User Statistics...\n');

        // 1. Total Users
        const [totalResult] = await pool.execute('SELECT COUNT(*) AS total_users FROM users');
        console.log(`👥 Total Users: ${totalResult[0].total_users}`);

        // 2. Users by Role
        const [roleResult] = await pool.execute(`
            SELECT role, COUNT(*) AS count 
            FROM users 
            GROUP BY role
        `);
        console.log('\n👤 Users by Role:');
        roleResult.forEach(row => {
            console.log(`  ${row.role}: ${row.count}`);
        });

        // 3. Users by Status
        const [statusResult] = await pool.execute(`
            SELECT status, COUNT(*) AS count 
            FROM users 
            GROUP BY status
        `);
        console.log('\n🟢 Users by Status:');
        statusResult.forEach(row => {
            console.log(`  ${row.status}: ${row.count}`);
        });

        // 4. Verification Statistics
        const [verificationResult] = await pool.execute(`
            SELECT 
                COUNT(*) AS total_users,
                SUM(email_verified) AS email_verified_count,
                SUM(phone_verified) AS phone_verified_count,
                COUNT(*) - SUM(email_verified) AS email_not_verified,
                COUNT(*) - SUM(phone_verified) AS phone_not_verified
            FROM users
        `);
        const verification = verificationResult[0];
        console.log('\n✅ Verification Status:');
        console.log(`  Email Verified: ${verification.email_verified_count}/${verification.total_users}`);
        console.log(`  Email Not Verified: ${verification.email_not_verified}/${verification.total_users}`);
        console.log(`  Phone Verified: ${verification.phone_verified_count}/${verification.total_users}`);
        console.log(`  Phone Not Verified: ${verification.phone_not_verified}/${verification.total_users}`);

        // 5. Recent Users (last 30 days)
        const [recentResult] = await pool.execute(`
            SELECT COUNT(*) AS recent_users
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);
        console.log(`\n📅 New Users (Last 30 days): ${recentResult[0].recent_users}`);

        // 6. Registration Trends (last 7 days)
        const [trendsResult] = await pool.execute(`
            SELECT 
                DATE(created_at) AS registration_date,
                COUNT(*) AS users_registered
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY registration_date DESC
        `);
        console.log('\n📈 Registration Trends (Last 7 days):');
        if (trendsResult.length > 0) {
            trendsResult.forEach(row => {
                console.log(`  ${row.registration_date}: ${row.users_registered} users`);
            });
        } else {
            console.log('  No registrations in the last 7 days');
        }

        // 7. Comprehensive Statistics
        const [comprehensiveResult] = await pool.execute(`
            SELECT 
                COUNT(*) AS total_users,
                COUNT(CASE WHEN role = 'user' THEN 1 END) AS regular_users,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) AS admin_users,
                COUNT(CASE WHEN role = 'provider' THEN 1 END) AS service_providers,
                COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_users,
                COUNT(CASE WHEN status = 'inactive' THEN 1 END) AS inactive_users,
                COUNT(CASE WHEN email_verified = 1 THEN 1 END) AS verified_emails,
                COUNT(CASE WHEN phone_verified = 1 THEN 1 END) AS verified_phones,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) AS today_registrations,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) AS week_registrations
            FROM users
        `);
        const stats = comprehensiveResult[0];
        
        console.log('\n📋 Comprehensive Statistics:');
        console.log(`  Total Users: ${stats.total_users}`);
        console.log(`  Regular Users: ${stats.regular_users}`);
        console.log(`  Admin Users: ${stats.admin_users}`);
        console.log(`  Service Providers: ${stats.service_providers}`);
        console.log(`  Active Users: ${stats.active_users}`);
        console.log(`  Inactive Users: ${stats.inactive_users}`);
        console.log(`  Verified Emails: ${stats.verified_emails}`);
        console.log(`  Verified Phones: ${stats.verified_phones}`);
        console.log(`  Today's Registrations: ${stats.today_registrations}`);
        console.log(`  This Week's Registrations: ${stats.week_registrations}`);

        // 8. Sample User Data
        const [sampleResult] = await pool.execute(`
            SELECT id, first_name, last_name, email, role, status, created_at
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        console.log('\n👤 Recent Users (Sample):');
        sampleResult.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.first_name} ${user.last_name} (${user.email}) - ${user.role} - ${user.status}`);
        });

    } catch (error) {
        console.error('❌ Error fetching user statistics:', error);
    } finally {
        await pool.end();
    }
}

// Add this function to get specific user details
async function getUserDetails(userId) {
    try {
        const [result] = await pool.execute(`
            SELECT * FROM users WHERE id = ?
        `, [userId]);
        
        if (result.length > 0) {
            console.log('User Details:', result[0]);
            return result[0];
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

// Run the statistics
if (require.main === module) {
    getUserStatistics();
}

module.exports = { getUserStatistics, getUserDetails };
