import express from 'express';
import { getRecordById, insertRecord, isRecordExistsByCondition } from '../helpers/database.js';
import { commitTransaction, rollbackTransaction, startTransaction } from '../db/dbConnection.js';

const userRoute = express.Router();

userRoute.post('/user/withDefaultMessages', async (req, res, next) => {
    const ip_address = req.clientIP;
    const availableMessages = 10

    let connection;
    try {
        connection = await startTransaction();

        const userExists = await isRecordExistsByCondition(connection, 'users', 'ip_address', ip_address)

        if (userExists) {
            const user = await getRecordById(connection, 'users', 'ip_address', ip_address);
            const usage = await getRecordById(connection, 'usages', 'user_id', user.id);
            res.status(200).json({ availableMessages: usage.nr_of_available_messages, message: 'User already exists.' });
        } else {
            await insertRecord(connection, 'users', { ip_address });
            const user = await getRecordById(connection, 'users', 'ip_address', ip_address);
            await insertRecord(connection, 'usages', { user_id: user.id, nr_of_available_messages: availableMessages });
            res.status(201).json({ availableMessages: availableMessages, message: 'User with default messages created.' });
        }
        commitTransaction(connection)
    }
    catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        next(error);
    }
});


export default userRoute;
