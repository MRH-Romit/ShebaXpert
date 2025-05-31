const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

console.log('🔄 Setting up ShebaXpert SQLite database...');

async function createDatabase() {
    return new Promise((resolve, reject) => {
        const dbPath = './shebaxpert.db';
        
        // Remove existing database
        try {
            require('fs').unlinkSync(dbPath);
            console.log('🗑️ Removed existing database');
        } catch (err) {
            // File doesn't exist, that's fine
        }
        
        const db = new sqlite3.Database(dbPath, async (err) => {
            if (err) {
                reject(err);
                return;
            }

            console.log('✅ Connected to SQLite database');

            try {
                // Create tables step by step
                await runQuery(db, `
                    CREATE TABLE user_roles (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        role_name TEXT NOT NULL UNIQUE,
                        description TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `);

                await runQuery(db, `
                    CREATE TABLE user_status (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        status_name TEXT NOT NULL UNIQUE,
                        description TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `);

                await runQuery(db, `
                    CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        firstName TEXT NOT NULL,
                        lastName TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        phone TEXT,
                        password_hash TEXT NOT NULL,
                        role_id INTEGER NOT NULL DEFAULT 2,
                        status_id INTEGER NOT NULL DEFAULT 1,
                        email_verified INTEGER DEFAULT 0,
                        last_login DATETIME,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (role_id) REFERENCES user_roles(id),
                        FOREIGN KEY (status_id) REFERENCES user_status(id)
                    )
                `);

                await runQuery(db, `
                    CREATE TABLE user_sessions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        session_token TEXT NOT NULL UNIQUE,
                        expires_at DATETIME NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                `);

                await runQuery(db, `
                    CREATE TABLE password_reset_tokens (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        token TEXT NOT NULL UNIQUE,
                        expires_at DATETIME NOT NULL,
                        used INTEGER DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                `);

                await runQuery(db, `
                    CREATE TABLE email_verification_tokens (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        token TEXT NOT NULL UNIQUE,
                        expires_at DATETIME NOT NULL,
                        used INTEGER DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                `);

                await runQuery(db, `
                    CREATE TABLE login_attempts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT NOT NULL,
                        ip_address TEXT,
                        success INTEGER DEFAULT 0,
                        attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                        user_agent TEXT
                    )
                `);

                console.log('✅ All tables created successfully');

                // Insert default data
                await runQuery(db, `
                    INSERT INTO user_roles (role_name, description) VALUES 
                    ('admin', 'System Administrator'),
                    ('user', 'Regular User'),
                    ('service_provider', 'Service Provider'),
                    ('moderator', 'Content Moderator')
                `);

                await runQuery(db, `
                    INSERT INTO user_status (status_name, description) VALUES 
                    ('active', 'Active User'),
                    ('inactive', 'Inactive User'),
                    ('suspended', 'Suspended User'),
                    ('pending_verification', 'Pending Email Verification')
                `);

                console.log('✅ Default data inserted');

                // Create test user
                const hashedPassword = await bcrypt.hash('Test123!', 12);
                
                await runQuery(db, `
                    INSERT INTO users (firstName, lastName, email, phone, password_hash, email_verified) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `, ['Test', 'User', 'test@shebaxpert.com', '+8801712345678', hashedPassword, 1]);

                console.log('✅ Test user created!');

                // Create indexes
                await runQuery(db, 'CREATE INDEX idx_users_email ON users(email)');
                await runQuery(db, 'CREATE INDEX idx_users_role_id ON users(role_id)');
                await runQuery(db, 'CREATE INDEX idx_users_status_id ON users(status_id)');
                await runQuery(db, 'CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id)');
                await runQuery(db, 'CREATE INDEX idx_user_sessions_token ON user_sessions(session_token)');

                console.log('✅ Indexes created');

                // Verify setup
                const tables = await runQuery(db, "SELECT name FROM sqlite_master WHERE type='table'");
                console.log('📊 Tables created:');
                tables.forEach(table => console.log(`   - ${table.name}`));

                const userCount = await runQuery(db, 'SELECT COUNT(*) as count FROM users');
                console.log(`👤 Users in database: ${userCount[0].count}`);

                db.close();
                resolve();

            } catch (error) {
                console.error('❌ Error during setup:', error);
                db.close();
                reject(error);
            }
        });
    });
}

function runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        if (sql.trim().toLowerCase().startsWith('select')) {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        } else {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        }
    });
}

createDatabase().then(() => {
    console.log('🎉 SQLite database setup completed successfully!');
    console.log('📧 Test login: test@shebaxpert.com');
    console.log('🔑 Test password: Test123!');
    console.log('📁 Database file: shebaxpert.db');
}).catch((error) => {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
});
