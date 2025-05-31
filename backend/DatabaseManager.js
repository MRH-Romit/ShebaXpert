const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
require('dotenv').config();

class DatabaseManager {
    constructor() {
        this.connection = null;
        this.dbType = null;
    }

    async connect() {
        // Try MySQL first
        try {
            await this.connectMySQL();
            console.log('✅ Connected to MySQL database');
            return;
        } catch (error) {
            console.log(`⚠️ MySQL connection failed: ${error.message}`);
            console.log('🔄 Falling back to SQLite...');
        }

        // Fallback to SQLite
        try {
            await this.connectSQLite();
            console.log('✅ Connected to SQLite database (fallback mode)');
        } catch (error) {
            console.error('❌ Both MySQL and SQLite connections failed');
            throw error;
        }
    }

    async connectMySQL() {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'shebaxpert',
            connectTimeout: 5000
        };

        this.connection = await mysql.createConnection(config);
        this.dbType = 'mysql';
    }

    async connectSQLite() {
        return new Promise((resolve, reject) => {
            const dbPath = './shebaxpert.db';
            this.connection = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.dbType = 'sqlite';
                    // Promisify sqlite methods
                    this.connection.run = promisify(this.connection.run.bind(this.connection));
                    this.connection.get = promisify(this.connection.get.bind(this.connection));
                    this.connection.all = promisify(this.connection.all.bind(this.connection));
                    resolve();
                }
            });
        });
    }

    async execute(query, params = []) {
        if (this.dbType === 'mysql') {
            const [rows] = await this.connection.execute(query, params);
            return rows;        } else if (this.dbType === 'sqlite') {
            // Convert MySQL syntax to SQLite where needed
            const sqliteQuery = this.convertToSQLite(query);
            
            if (sqliteQuery.toLowerCase().trim().startsWith('select')) {
                return await this.connection.all(sqliteQuery, params);
            } else {
                await this.connection.run(sqliteQuery, params);
                return { affectedRows: this.connection.changes };
            }
        }
    }

    convertToSQLite(query) {
        // Convert MySQL specific syntax to SQLite
        return query
            .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
            .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
            .replace(/ON UPDATE CURRENT_TIMESTAMP/gi, '')
            .replace(/ENGINE=InnoDB/gi, '')
            .replace(/DEFAULT CHARSET=utf8mb4/gi, '')
            .replace(/COLLATE=utf8mb4_unicode_ci/gi, '')
            .replace(/`/g, '"'); // Replace backticks with double quotes for SQLite
    }

    async close() {
        if (this.connection) {
            if (this.dbType === 'mysql') {
                await this.connection.end();
            } else if (this.dbType === 'sqlite') {
                this.connection.close();
            }
        }
    }

    getDbType() {
        return this.dbType;
    }
}

module.exports = DatabaseManager;
