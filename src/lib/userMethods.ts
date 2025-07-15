import { Pool } from 'pg';

export async function registerUser(db: Pool, userId: string, name: string, branch: string, joiningYear: string, email: string): Promise<void> {
    await db.query(
        `INSERT INTO users (id, pronouns, name, branch, joiningYear, isFresher, email)
         VALUES ($1, NULL, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [userId, name, branch, joiningYear, false, email]
    );
}

export interface User {
    id: string;
    pronouns: string | null;
    name: string;
    branch: string;
    joiningYear: string;
    isFresher: boolean;
    email: string;
}

export async function getUser(db: Pool, userId: string): Promise<User | null> {
    const result = await db.query(
        `SELECT * FROM users WHERE id = $1`,
        [userId]
    );
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}