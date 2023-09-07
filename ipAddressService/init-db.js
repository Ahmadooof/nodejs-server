import dbConnection from '../db.js';

async function initializeDatabase() {
  try {
    // Connect to the database (connection is automatically managed by the pool)
    console.log('Connected to MySQL database');

    // SQL statement to create the database if it doesn't exist
    const createDatabaseSQL = `
      CREATE DATABASE IF NOT EXISTS chat
    `;

    // Execute the SQL statement to create the database
    await dbConnection.query(createDatabaseSQL);
    console.log('Database "your_database_name" created or already exists');

    // Switch to the newly created database
    await dbConnection.changeUser({ database: 'your_database_name' });

    // SQL statements for table initialization
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ip_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const insertSampleDataSQL = `
      INSERT INTO ip_addresses (ip_address)
      VALUES
        ('192.168.1.100'),
        ('10.0.0.1')
    `;

    // Execute the SQL statements
    await dbConnection.query(createTableSQL);
    console.log('Table "ip_addresses" created successfully');

    await dbConnection.query(insertSampleDataSQL);
    console.log('Sample data inserted successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    // The pool will automatically release the connection
    dbConnection.end();
  }
}

initializeDatabase();
