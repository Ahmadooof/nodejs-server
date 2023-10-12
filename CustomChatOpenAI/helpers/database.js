
export async function insertRecord(connection, tableName, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const insertSQL = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;

    const values = Object.values(data);

    try {
        await connection.query(insertSQL, values);
        console.log(`Data inserted into ${tableName} successfully`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Update a column in a database table based on a condition.
 * @param {object} connection - The database connection object.
 * @param {string} tableName - The name of the table to update.
 * @param {string} columnToUpdate - The name of the column to update.
 * @param {any} newValue - The new value to set for the column.
 * @param {string} conditionColumn - The name of the column used for the condition.
 * @param {any} conditionValue - The value to match in the condition column.
 * @returns {Promise<number>} - A promise that resolves with the number of rows updated.
 */
async function updateColumnByCondition(connection, tableName, columnToUpdate, newValue, conditionColumn, conditionValue) {
    const updateQuery = `UPDATE ${tableName} SET ${columnToUpdate} = ? WHERE ${conditionColumn} = ?`;

    try {
        const [result] = await connection.query(updateQuery, [newValue, conditionValue]);
        return result.affectedRows; // Number of rows updated
    } catch (error) {
        console.error(error);
        throw error;
    }
}


/**
 * Decrement a numerical column in a database table by a specified value based on a condition.
 * @param {object} connection - The database connection object.
 * @param {string} tableName - The name of the table to update.
 * @param {string} columnToDecrement - The name of the numerical column to decrement.
 * @param {number} decrementBy - The value by which to decrement the column.
 * @param {string} conditionColumn - The name of the column used for the condition.
 * @param {any} conditionValue - The value to match in the condition column.
 * @returns {Promise<number>} - A promise that resolves with the number of rows updated.
 */
export async function decrementColumnByCondition(connection, tableName, columnToDecrement, decrementBy, conditionColumn, conditionValue) {
    const updateQuery = `UPDATE ${tableName} SET ${columnToDecrement} = ${columnToDecrement} - ? WHERE ${conditionColumn} = ?`;

    try {
        const [result] = await connection.query(updateQuery, [decrementBy, conditionValue]);
        return result.affectedRows; // Number of rows updated
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Increment a numerical column in a database table by a specified value based on a condition.
 * @param {object} connection - The database connection object.
 * @param {string} tableName - The name of the table to update.
 * @param {string} columnToIncrement - The name of the numerical column to increment.
 * @param {number} incrementBy - The value by which to increment the column.
 * @param {string} conditionColumn - The name of the column used for the condition.
 * @param {any} conditionValue - The value to match in the condition column.
 * @returns {Promise<number>} - A promise that resolves with the number of rows updated.
 */
export async function incrementColumnByCondition(connection, tableName, columnToIncrement, incrementBy, conditionColumn, conditionValue) {
    const updateQuery = `UPDATE ${tableName} SET ${columnToIncrement} = ${columnToIncrement} + ? WHERE ${conditionColumn} = ?`;

    try {
        const [result] = await connection.query(updateQuery, [incrementBy, conditionValue]);
        return result.affectedRows; // Number of rows updated
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Get a record from a table by its ID.
 * @param {string} tableName - The name of the table to query.
 * @param {string} idColumnName - The name of the ID column.
 * @param {number} id - The ID value to search for.
 * @returns {Promise<Object|null>} A Promise that resolves to the record if found, or null if not found.
 */
export async function getRecordById(connection, tableName, idColumnName, id) {
    const selectQuery = `SELECT * FROM ${tableName} WHERE ${idColumnName} = ?`;

    try {
        const [rows] = await connection.query(selectQuery, [id]);
        
        // Check if a record was found
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null; // No record found
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


/**
 * Check if a record exists in a table based on a specified condition column.
 * @param {string} tableName - The name of the table to query.
 * @param {string} conditionColumn - The name of the column to check for a specific value.
 * @param {string} conditionValue - The value to check in the condition column.
 * @returns {Promise<boolean>} True if a record exists, false otherwise.
 */
export async function isRecordExistsByCondition(connection, tableName, conditionColumn, conditionValue) {
    const checkQuery = `SELECT COUNT(*) AS count FROM ${tableName} WHERE ${conditionColumn} = ?`;

    try {
        const [rows] = await connection.query(checkQuery, [conditionValue]);
        const count = rows[0].count;
        return count > 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
