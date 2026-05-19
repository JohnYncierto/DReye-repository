/**
 * dbService.js
 * Persists and retrieves screening results.
 * Table schema (run this once to create the table):
 *
 *   CREATE TABLE screenings (
 *     screening_id  TEXT PRIMARY KEY,
 *     patient_name  TEXT NOT NULL,
 *     patient_id    TEXT,
 *     doctor_name   TEXT,
 *     diagnosis     TEXT NOT NULL,
 *     confidence    FLOAT NOT NULL,
 *     notes         TEXT,
 *     image_url     TEXT,
 *     gradcam_url   TEXT,
 *     created_at    TIMESTAMP DEFAULT NOW()
 *   );
 */

//uncomment for RDS(PostgreSQL):

import pg from 'pg';
let pool;
function getPool() {
    if (!pool) {
        pool = new pg.Pool({ 
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
    return pool;
}

export async function saveResult(data) {
    const {rows} = await getPool().query(
        `INSERT INTO screenings
        (screening_id, patient_name, patient_id, doctor_name, diagnosis, notes, image_url, gradcam_url, confidence)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
            data.screeningId, 
            data.patientName, 
            data.patientID, 
            data.doctorName, 
            data.diagnosis, 
            data.notes, 
            data.imageUrl, 
            data.gradcamUrl, 
            data.confidence]
    );
    return rows[0];
}

export async function getResults(search) {
    const {rows} = await getPool().query(
        `SELECT * FROM screenings
        WHERE ($1::text IS NULL OR LOWER(patient_name) LIKE '%' || LOWER($1) || '%')
        ORDER BY created_at DESC`,
        [search || null]
    );
    return rows;
}