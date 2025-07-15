import { Pool } from 'pg';
import * as userMethods from './userMethods';

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
                    pronouns TEXT,
                    name TEXT,
                    branch TEXT,
                    joiningYear INTEGER,
                    isFresher BOOLEAN DEFAULT TRUE,
                    email TEXT
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

    async registerUser(userId: string, name: string, branch: string, joiningYear: string, email: string): Promise<void> {
        return userMethods.registerUser(this.dbPool, userId, name, branch, joiningYear, email);
    }

    getUser(userId: string): Promise<any | null> {
        return userMethods.getUser(this.dbPool, userId);
    }

}

export const databaseManager = new DatabaseManager();