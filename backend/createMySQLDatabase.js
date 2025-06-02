const mysql = require('mysql2/promise');
const fs = require('fs').promises;
require('dotenv').config();

async function createDatabase() {
    let connection;
    
    try {
        // First, connect without specifying database to create it
        console.log('🔄 Connecting to MySQL server...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Create database if it doesn't exist
        console.log('🔄 Creating database if it doesn\'t exist...');
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'shebaxpert'}`);
        console.log(`✅ Database '${process.env.DB_NAME || 'shebaxpert'}' created/verified`);
          // Close connection and reconnect with database specified
        await connection.end();
        
        console.log('🔄 Reconnecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'shebaxpert',
            multipleStatements: true
        });
        
        // Read and execute schema.sql
        console.log('🔄 Reading schema.sql...');
        const schema = await fs.readFile('./schema.sql', 'utf8');        // Split the schema into individual statements and clean them
        const statements = schema
            .split(';')
            .map(stmt => {
                // Remove comments and normalize whitespace
                return stmt
                    .split('\n')
                    .filter(line => !line.trim().startsWith('--'))
                    .join('\n')
                    .trim();
            })
            .filter(stmt => stmt.length > 0)
            .filter(stmt => !stmt.toUpperCase().startsWith('USE '))
            .filter(stmt => !stmt.toUpperCase().startsWith('CREATE DATABASE'));
        
        console.log(`🔄 Executing ${statements.length} SQL statements...`);
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    await connection.execute(statement);
                    console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
                } catch (error) {
                    // Skip errors for statements that might fail if tables already exist
                    if (error.message.includes('already exists') || 
                        error.message.includes('duplicate') ||
                        error.message.includes('Unknown database')) {
                        console.log(`⚠️ Skipped statement ${i + 1}: ${error.message}`);
                    } else {
                        console.error(`❌ Error in statement ${i + 1}: ${error.message}`);
                        console.error(`Statement: ${statement.substring(0, 100)}...`);
                    }
                }
            }
        }
        
        console.log('🎉 Database setup completed successfully!');
        console.log('📊 MySQL database is ready for the ShebaXpert application');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 Tip: Check your MySQL credentials in the .env file');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('💡 Tip: Make sure MySQL server is running');
        }
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 MySQL connection closed');
        }
    }
}

// Run the setup
createDatabase();
