const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

class DatabaseManager {
    constructor() {
        this.connection = null;
        this.dbType = 'sqlite';
    }

    async connect() {
        await this.connectSQLite();
        console.log('✅ Connected to SQLite database');
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

    getDbType() {
        return this.dbType;
    }

    async execute(query, params = []) {
        if (this.dbType === 'sqlite') {
            const sqliteQuery = this.convertToSQLite(query);
            if (sqliteQuery.toLowerCase().trim().startsWith('select')) {
                return await this.connection.all(sqliteQuery, params);
            } else {
                await this.connection.run(sqliteQuery, params);
                return { lastID: this.connection.lastID };
            }
        }
        throw new Error('No valid database connection');
    }

    async close() {
        if (this.connection && this.dbType === 'sqlite') {
            await promisify(this.connection.close.bind(this.connection))();
        }
    }

    convertToSQLite(query) {
        // Optionally convert MySQL-specific syntax to SQLite
        return query.replace(/`/g, '');
    }
}

module.exports = DatabaseManager;
