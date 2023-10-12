import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbConnection = createPool({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true
});

export async function startTransaction() {
  const connection = await dbConnection.getConnection();
  await connection.beginTransaction();
  return connection;
}

// Function to commit a transaction and release the connection
export async function commitTransaction(connection) {
  await connection.commit();
  connection.release();
}

// Function to rollback a transaction and release the connection
export async function rollbackTransaction(connection) {
  await connection.rollback();
  connection.release();
}


export default dbConnection;
