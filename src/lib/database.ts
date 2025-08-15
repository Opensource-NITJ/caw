import { Pool } from 'pg';
import * as userMethods from './userMethods';
import * as admissionMethods from './admissionMethods';

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
            
            await this.dbPool.query(`
                CREATE TABLE IF NOT EXISTS admission_updates (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    degree TEXT NOT NULL,
                    link TEXT NOT NULL,
                    new_page BOOLEAN NOT NULL,
                    is_new BOOLEAN NOT NULL,
                    visible BOOLEAN NOT NULL,
                    order_num INTEGER NOT NULL,
                    visibility_changed_at TEXT,
                    update_logs JSONB NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    __v INTEGER NOT NULL,
                    source_of_info JSONB,
                    acknowledged BOOLEAN NOT NULL DEFAULT FALSE
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
    
    upsertAdmissionUpdate(item: any) {
        return admissionMethods.upsertAdmissionUpdate(this.dbPool, item);
    }

    getUnacknowledgedAdmissionUpdates() {
        return admissionMethods.getUnacknowledged(this.dbPool);
    }

    acknowledgeAdmissionUpdate(id: string) {
        return admissionMethods.acknowledgeUpdate(this.dbPool, id);
    }

    getAllAdmissionUpdates() {
        return admissionMethods.getAllUpdates(this.dbPool);
    }

}

export const databaseManager = new DatabaseManager();