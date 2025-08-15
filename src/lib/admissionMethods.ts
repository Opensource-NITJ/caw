import { Pool } from 'pg';

export async function upsertAdmissionUpdate(db: Pool, item: any): Promise<void> {
    try {
        const existsResult = await db.query('SELECT 1 FROM admission_updates WHERE id = $1', [item._id]);
        const sourceOfInfo = item.sourceOfInfo ? JSON.stringify(item.sourceOfInfo) : null;
        const updateLogs = JSON.stringify(item.updateLogs || []);
        const visibilityChangedAt = item.visibilityChangedAt || null;

        if (existsResult.rows.length === 0) {
            const insertQuery = `
                INSERT INTO admission_updates (
                    id, title, degree, link, new_page, is_new, visible, order_num,
                    visibility_changed_at, update_logs, created_at, updated_at, __v,
                    source_of_info, acknowledged
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, FALSE)
                RETURNING id
            `;
            const insertResult = await db.query(insertQuery, [
                item._id, item.title, item.degree, item.link, item.newPage, item.new, item.visible, item.order,
                visibilityChangedAt, updateLogs, item.createdAt, item.updatedAt, item.__v, sourceOfInfo
            ]);
        } else {
            const updateQuery = `
                UPDATE admission_updates SET
                    title = $2, degree = $3, link = $4, new_page = $5, is_new = $6, visible = $7, order_num = $8,
                    visibility_changed_at = $9, update_logs = $10, created_at = $11, updated_at = $12, __v = $13,
                    source_of_info = $14
                WHERE id = $1
                RETURNING id
            `;
            const updateResult = await db.query(updateQuery, [
                item._id, item.title, item.degree, item.link, item.newPage, item.new, item.visible, item.order,
                visibilityChangedAt, updateLogs, item.createdAt, item.updatedAt, item.__v, sourceOfInfo
            ]);
        }
    } catch (error) {
        console.error(`Error upserting record ${item._id}:`, error);
        throw error;
    }
}

export async function getUnacknowledged(db: Pool): Promise<any[]> {
    try {
        const { rows } = await db.query(
            'SELECT * FROM admission_updates WHERE acknowledged = FALSE ORDER BY created_at ASC'
        );
        return rows;
    } catch (error) {
        console.error('Error fetching unacknowledged records:', error);
        throw error;
    }
}

export async function acknowledgeUpdate(db: Pool, id: string): Promise<void> {
    try {
        const result = await db.query('UPDATE admission_updates SET acknowledged = TRUE WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            console.warn(`No record found to acknowledge with id: ${id}`);
        } else {
            console.log(`Acknowledged record: ${id}`);
        }
    } catch (error) {
        console.error(`Error acknowledging record ${id}:`, error);
        throw error;
    }
}

export async function getAllUpdates(db: Pool): Promise<any[]> {
    try {
        const { rows } = await db.query('SELECT * FROM admission_updates');
        return rows;
    } catch (error) {
        console.error('Error fetching all admission updates:', error);
        throw error;
    }
}