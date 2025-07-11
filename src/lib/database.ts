import { Pool } from 'pg';

export class DatabaseManager {
    private dbPool: Pool;

    constructor() {

        this.dbPool = new Pool({
            user: process.env.dbUser,
            host: process.env.dbHost,
            database: process.env.dbName,
            password: process.env.dbPassword,
            port: Number(process.env.dbPort),
        });

        this.initializeSchema();
    }

    async initializeSchema() {
        try {

            await this.dbPool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    pronouns TEXT
                );
            `);

        } catch (err) {
            console.error("Failed to initialize schema:", err);
            throw err;
        }
    }

    get client() {
        return this.dbPool;
    }

}

export const databaseManager = new DatabaseManager();