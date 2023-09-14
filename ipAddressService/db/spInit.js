import dbConnection from './dbConnection.js';

// stored procedures.
export async function spInit(table_schema) {
  try {
    let createProcedure = '', readProcedure = '', updateProcedure = '', deleteProcedure = ''

    const [tables] = await dbConnection.query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.tables
       WHERE table_schema = '${table_schema}' `);
    console.log(tables)

    for (const table of tables) {
      const [columns] = await dbConnection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
       WHERE table_schema =  '${table_schema}' AND TABLE_NAME = '${table.TABLE_NAME}'`);

      let inputParameters = '', insertValues = '', updateSetValues = '', columnsToInsert = []
      for (const column of columns) {
        if (column.IS_NULLABLE === "NO" && column.COLUMN_NAME !== "id") {
          let dataType = column.DATA_TYPE;
          if (dataType === 'VARCHAR' || dataType === 'varchar') {
            dataType += '(255)';
          }
          inputParameters += `IN p_${column.COLUMN_NAME} ${dataType}, `;
          insertValues += `p_${column.COLUMN_NAME}, `;
          updateSetValues += `${column.COLUMN_NAME} = p_${column.COLUMN_NAME}, `;
          columnsToInsert.push(column)
        }
      }
      inputParameters = inputParameters.slice(0, -2); // Remove the trailing comma and space
      insertValues = insertValues.slice(0, -2); // Remove the trailing comma and space
      updateSetValues = updateSetValues.slice(0, -2); // Remove the trailing comma and space

      createProcedure = `
      CREATE PROCEDURE Insert_${table.TABLE_NAME}(${inputParameters}) 
        BEGIN 
          INSERT INTO ${table.TABLE_NAME} (${columnsToInsert.map(column => column.COLUMN_NAME).join(', ')}) 
          VALUES (${insertValues}); 
        END;
        `;

      readProcedure = `
      CREATE PROCEDURE SELECT_${table.TABLE_NAME}() 
        BEGIN 
          SELECT * FROM ${table.TABLE_NAME}; 
        END;
        `;

      deleteProcedure = `
      CREATE PROCEDURE Delete_${table.TABLE_NAME}(IN id_to_delete INT) 
      BEGIN 
        UPDATE ${table.TABLE_NAME}
        SET deleted = true
        WHERE id = id_to_delete; 
      END;      
        `;

      // updateProcedure = `
      // CREATE PROCEDURE Update_${table.TABLE_NAME}(IN p_id INT, ${inputParameters}) 
      //   BEGIN 
      //     UPDATE ${table.TABLE_NAME} 
      //     SET ${updateSetValues} 
      //     WHERE id = p_id; 
      //   END;`;

      await dbConnection.query(createProcedure);
      await dbConnection.query(readProcedure);
      await dbConnection.query(deleteProcedure);
      // await dbConnection.query(updateProcedure);
    }
  } catch (err) {
    console.error('Error initializing db:', err);
  }
}


