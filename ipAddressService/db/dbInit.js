import dbConnection from './dbConnection.js';

export async function dbInit() {
  try {
    // Connect to the MySQL server (connection is automatically managed by the pool)
    console.log('Connecting to MySQL server...');

    // SQL statements for table initialization
    const forAllTables = `
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted BOOLEAN DEFAULT false,
      deleted_on TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `;

    
    const createuserTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        region VARCHAR(255),
        city VARCHAR(255),
        postal_code VARCHAR(10),
        address VARCHAR(255),
        ${forAllTables}
      );    
    `;

    const createChatUsageTable = `
      CREATE TABLE IF NOT EXISTS usages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        nr_of_sent_messages INT DEFAULT 0,
        nr_of_available_messages INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id),
        ${forAllTables}
      );
    `;

    const createChatMessageTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        user_message TEXT NOT NULL,
        ai_message TEXT NOT NULL,
        message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        ${forAllTables}
      );    
    `;

    // Execute the SQL statements
    await dbConnection.query(createuserTable);
    await dbConnection.query(createChatUsageTable);
    await dbConnection.query(createChatMessageTable);

    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error initializing db:', err);
  }
}

// dbInit();