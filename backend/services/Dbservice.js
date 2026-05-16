/**
 * dbService.js
 * Persists and retrieves screening results.
 * Currently: uses an in-memory array (resets on server restart).
 *
 * TO SWAP IN AWS DYNAMODB:
 *   1. npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
 *   2. Set env vars: AWS_REGION, DYNAMODB_TABLE_NAME
 *   3. Uncomment the DynamoDB block and remove the mock block.
 *
 * TO SWAP IN AWS RDS (PostgreSQL via pg):
 *   1. npm install pg
 *   2. Set env var: DATABASE_URL
 *   3. Use the RDS block instead.
 * 
 */
//Uncomment for DynamoDB:
/*
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamo = DynamoDBDocumentClient.from(client);

export async function saveResult(data) {
  const item = { ...data, createdAt: new Date().toISOString() }; 
  await dynamo.send(new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: item
  }));
  return item;
}

export async function getResults(search) {
    const {Items} = await dynamo.send(new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
    }));
    if (search) {
        const q = search.toLowerCase();
        return Items.filter((r) => r.patientName.toLowerCase().includes(q) || r.doctorName.toLowerCase().includes(q));
    }
        return Items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
  
*/

//uncomment for RDS(PostgreSQL):
/*
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function saveResult(data) {
    const {rows} = await pool.query(
        'INSERT INTO screenings
            (screening_id, patient_name, patient_id, doctor_name, diagnosis, notes, image_url, prediction, confidence, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *',
        [data.screeningID, data.patientName, data.patientID, data.doctorName, data.diagnosis,
         data.notes, data.imageURL, data.prediction, data.confidence]
        
    );
    return rows[0];
}

export async function getResults(search) {
    const {rows} = await pool.query(
        'SELECT * FROM screenings 
        WHERE ($1:: text IS NULL OR LOWER (patient_name) LIKE '%' || LOWER($1) || '%')
        ORDER BY created_at DESC',
        [search || null]
    );
    return rows;
}
*/

//-- MOCK(active)
const store = [];

export async function saveResult(data) {
    const record = { ...data, createdAt: new Date().toISOString() };
    store.push(record);
    return record;
}

export async function getResults(search) {
    if (!search) return store;
    const q = search.toLowerCase();
    return store.filter((r) => r.patientName.toLowerCase().includes(q) || r.doctorName.toLowerCase().includes(q));
}