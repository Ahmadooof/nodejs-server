import dbConnection from './dbConnection.js';

export async function callStoredProcedure(storedProcedureName, inputData, outputParameters = {}) {
    try {
        const inputPlaceholders = Object.keys(inputData).map(() => '?').join(', ');
        const inputValues = Object.values(inputData);

        const outputPlaceholders = Object.keys(outputParameters).map((key) => `@${key}`).join(', ');

        const query = `CALL ${storedProcedureName}(${inputPlaceholders}${outputPlaceholders ? `, ${outputPlaceholders}` : ''})`;

        const result = await dbConnection.query(query, [...inputValues, ...Object.values(outputParameters)]);

        return result[0];
    } catch (error) {
        throw error;
    }
}
