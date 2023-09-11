import dbConnection from './db.js';

async function initializeDatabase() {
  try {
    // Connect to the MySQL server (connection is automatically managed by the pool)
    console.log('Connected to MyyyyySQL server');

    // SQL statements for table initialization
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS visitors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ip_address VARCHAR(45),
      region VARCHAR(255),
      city VARCHAR(255),
      postal_code VARCHAR(10),
      address VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted BOOLEAN DEFAULT false,
      deleted_on TIMESTAMP
    );    
    `;

    const createChat_usageTable = `
    CREATE TABLE IF NOT EXISTS chat_usage (
      id INT AUTO_INCREMENT PRIMARY KEY,
      visitor_id INT UNIQUE,
      messages_sent INT DEFAULT 0,
      FOREIGN KEY (visitor_id) REFERENCES visitors(id)
    );
    `;

    const chat_message = `
    CREATE TABLE IF NOT EXISTS chat_message (
      id INT AUTO_INCREMENT PRIMARY KEY,
      visitor_id INT,
      visitor_message TEXT,
      ai_message TEXT,
      message_number INT DEFAULT 0,
      message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );    
    `;
    


    

  //   const insertSampleDataSQL = `
  //   INSERT INTO visitors (ip_address, region, city, postal_code, address)
  //   VALUES
  //     ('192.168.1.100', 'Region 1', 'City A', '12345', '123 Main St'),
  //     ('10.0.0.1', 'Region 2', 'City B', '54321', '456 Elm St');
  // `;


    // Execute the SQL statements
    await dbConnection.query(createTableSQL);
    await dbConnection.query(createChat_usageTable);
    await dbConnection.query(chat_message);

    // await dbConnection.query(insertSampleDataSQL);

    // console.log('Sample data inserted successfully');
  } catch (err) {
    console.error('Error initializing db:', err);
  } finally {
    // The pool will automatically release the connection
    dbConnection.end();
  }
}

initializeDatabase();
