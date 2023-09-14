import dbConnection from './dbConnection.js';

// stored procedures.
export async function triggerInit(table_schema) {
  try {
    const [tables] = await dbConnection.query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.tables
      WHERE table_schema = ?`, [table_schema]);

    for (const table of tables) {
      const triggerQuery = `
        CREATE TRIGGER update_timestamp_${table.TABLE_NAME}
        BEFORE UPDATE ON ${table.TABLE_NAME}
        FOR EACH ROW
        BEGIN
          SET NEW.updated_at = NOW();
        END;    
      `;

      await dbConnection.query(triggerQuery);
      console.log(`Trigger for table ${table.TABLE_NAME} created successfully`);
    }

  } catch (err) {
    console.error('Error initializing triggers', err);
  }
}
