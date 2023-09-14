import express from 'express';
import { getRecordById, insertRecord, isRecordExistsByCondition } from '../helpers/database.js';
import { commitTransaction, rollbackTransaction, startTransaction } from '../db/dbConnection.js';

const userRoute = express.Router();

userRoute.post('/insert-user', async (req, res, next) => {
    const ip_address = req.clientIP;    

    let connection;
    try {
        connection = await startTransaction();

        const userExists = await isRecordExistsByCondition(connection, 'users', 'ip_address', ip_address);

        if (userExists) {
            res.status(200).json({ message: 'User already exists.' });
        } else {
            await insertRecord(connection, 'users', { ip_address });

            await commitTransaction(connection);
            res.status(201).json({ message: 'Uesr, inserted successfully.' });
        }
    }
     catch (error) {
        // Rollback the transaction in case of an error
        if (connection) {
            await rollbackTransaction(connection);
        }
        next(error);
    }
});

userRoute.post('/is-user-exists', async (req, res, next) => {
    try {
        const ip_address = req.clientIP;
        let connection = await startTransaction();

        const userExists = await isRecordExistsByCondition(connection, 'users', 'ip_address', ip_address);

        if (userExists) {
            res.status(200).json({ message: 'User already exists.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } 
    catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        next(error);
    }
});


export default userRoute;
