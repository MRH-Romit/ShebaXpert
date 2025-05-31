const DatabaseManager = require('./DatabaseManager');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

class DatabaseInitializer {
    constructor() {
        this.db = new DatabaseManager();
    }

    async initializeDatabase() {
        try {
            await this.db.connect();
            
            const dbType = this.db.getDbType();
            console.log(`🔄 Initializing ${dbType.toUpperCase()} database...`);

            // Read appropriate schema file
            const schemaFile = dbType === 'mysql' ? 'schema.sql' : 'schema-sqlite.sql';
            const schema = await fs.readFile(schemaFile, 'utf8');
            
            // Split and execute SQL statements
            const statements = schema
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            for (const statement of statements) {
                try {
                    await this.db.execute(statement);
                } catch (error) {
                    // Some statements might fail if tables already exist, that's okay
                    if (!error.message.includes('already exists') && 
                        !error.message.includes('duplicate') &&
                        !error.message.includes('DROP')) {
                        console.log(`⚠️ Warning executing statement: ${error.message}`);
                    }
                }
            }

            console.log(`✅ ${dbType.toUpperCase()} database initialized successfully!`);
            console.log(`📊 Database type: ${dbType}`);
            
            if (dbType === 'sqlite') {
                console.log(`📁 Database file: ./shebaxpert.db`);
                console.log(`ℹ️ Using SQLite as fallback - consider fixing MySQL for production`);
            }

        } catch (error) {
            console.error('❌ Database initialization failed:', error.message);
            throw new Error('Unable to initialize database');
        } finally {
            await this.db.close();
        }
    }

    async createTestUser() {
        try {
            await this.db.connect();
            
            const dbType = this.db.getDbType();
            console.log(`🔄 Creating test user in ${dbType.toUpperCase()}...`);

            // Check if test user already exists
            const existingUser = await this.db.execute(
                'SELECT id FROM users WHERE email = ?', 
                ['test@shebaxpert.com']
            );

            if (existingUser.length > 0) {
                console.log('👤 Test user already exists, skipping creation');
                return;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash('Test123!', 12);

            // Insert test user
            await this.db.execute(`
                INSERT INTO users (firstName, lastName, email, phone, password_hash, email_verified) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                'Test',
                'User', 
                'test@shebaxpert.com',
                '+8801712345678',
                hashedPassword,
                1
            ]);

            console.log('✅ Test user created successfully!');
            console.log('📧 Email: test@shebaxpert.com');
            console.log('🔑 Password: Test123!');

        } catch (error) {
            console.error('❌ Failed to create test user:', error.message);
            throw error;
        } finally {
            await this.db.close();
        }
    }

    async verifyDatabase() {
        try {
            await this.db.connect();
            
            const dbType = this.db.getDbType();
            console.log(`🔍 Verifying ${dbType.toUpperCase()} database structure...`);

            // Check if all tables exist
            const tables = ['user_roles', 'user_status', 'users', 'user_sessions', 
                          'password_reset_tokens', 'email_verification_tokens', 'login_attempts'];

            for (const table of tables) {
                try {
                    const query = dbType === 'mysql' 
                        ? `SELECT COUNT(*) as count FROM ${table} LIMIT 1`
                        : `SELECT COUNT(*) as count FROM ${table} LIMIT 1`;
                    
                    const result = await this.db.execute(query);
                    const count = dbType === 'mysql' ? result[0].count : result[0].count;
                    console.log(`✅ Table '${table}': ${count} records`);
                } catch (error) {
                    console.log(`❌ Table '${table}': ${error.message}`);
                }
            }

            // Check user roles and status data
            const roles = await this.db.execute('SELECT * FROM user_roles');
            const statuses = await this.db.execute('SELECT * FROM user_status');
            
            console.log(`📊 User roles: ${roles.length} entries`);
            console.log(`📊 User statuses: ${statuses.length} entries`);

            // Check test user
            const testUser = await this.db.execute(
                'SELECT firstName, lastName, email FROM users WHERE email = ?',
                ['test@shebaxpert.com']
            );

            if (testUser.length > 0) {
                console.log(`👤 Test user: ${testUser[0].firstName} ${testUser[0].lastName} (${testUser[0].email})`);
            } else {
                console.log('👤 No test user found');
            }

            console.log(`✅ Database verification completed for ${dbType.toUpperCase()}`);

        } catch (error) {
            console.error('❌ Database verification failed:', error.message);
            throw error;
        } finally {
            await this.db.close();
        }
    }

    async resetDatabase() {
        try {
            await this.db.connect();
            
            const dbType = this.db.getDbType();
            console.log(`🔄 Resetting ${dbType.toUpperCase()} database...`);
            
            // Drop all tables in reverse dependency order
            const dropTables = [
                'login_attempts',
                'email_verification_tokens', 
                'password_reset_tokens',
                'user_sessions',
                'users',
                'user_status',
                'user_roles'
            ];

            for (const table of dropTables) {
                try {
                    await this.db.execute(`DROP TABLE IF EXISTS ${table}`);
                    console.log(`🗑️ Dropped table: ${table}`);
                } catch (error) {
                    console.log(`⚠️ Could not drop table ${table}: ${error.message}`);
                }
            }

            console.log(`✅ ${dbType.toUpperCase()} database reset completed`);

        } catch (error) {
            console.error('❌ Database reset failed:', error.message);
            throw error;
        } finally {
            await this.db.close();
        }
    }
}

// Command line interface
async function runCommand(command) {
    const db = new DatabaseInitializer();
    
    try {
        switch (command) {
            case 'init':
                await db.initializeDatabase();
                break;
            case 'test-user':
                await db.createTestUser();
                break;
            case 'verify':
                await db.verifyDatabase();
                break;
            case 'reset':
                console.log('⚠️ This will delete all data. Are you sure? (This is automated - proceeding...)');
                await db.resetDatabase();
                break;
            default:
                console.log('Available commands: init, test-user, verify, reset');
                console.log('Usage: node initDb.js <command>');
                process.exit(1);
        }
    } catch (error) {
        console.error('Command failed:', error.message);
        process.exit(1);
    }
}

// Main execution
if (require.main === module) {
    const command = process.argv[2];
    if (!command) {
        console.log('🚀 ShebaXpert Database Manager');
        console.log('Available commands:');
        console.log('  init      - Initialize database schema');
        console.log('  test-user - Create test user');
        console.log('  verify    - Verify database structure');
        console.log('  reset     - Reset database (removes all data)');
        console.log('');
        console.log('Usage: node initDb.js <command>');
        console.log('');
        console.log('💡 The system will automatically fallback to SQLite if MySQL is not available');
        process.exit(1);
    }
    
    runCommand(command);
}

module.exports = { DatabaseInitializer };
