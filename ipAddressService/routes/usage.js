import express from 'express';
import { decrementColumnByCondition, getRecordById, incrementColumnByCondition, insertRecord, isRecordExistsByCondition } from '../helpers/database.js';
import { commitTransaction, rollbackTransaction, startTransaction } from '../db/dbConnection.js';

const usageRoute = express.Router();


usageRoute.get('/get-available-messages', async (req, res, next) => {
    const ip_address = req.clientIP

    let connection
    try {
        connection = await startTransaction();
        const user = await getRecordById(connection, 'users', 'ip_address', ip_address)

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const usage = await getRecordById(connection, 'usages', 'user_id', user.id);

        if (!usage) {
            res.status(404).json({ message: 'Usage not found for that user, use endpoint: insert-new-messages' });
            return;
        }

        await commitTransaction(connection);
        res.status(200).json({ availableMessages: usage.nr_of_available_messages });
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        next(error);
    }
});


usageRoute.post('/insert-new-usage-credits', async (req, res, next) => {
    const ip_address = req.clientIP;
    const availableMessagesForUser = 10;

    let connection;
    try {
        connection = await startTransaction();

        const user = await getRecordById(connection, 'users', 'ip_address', ip_address);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        const userInUsages = await isRecordExistsByCondition(connection, 'usages', 'user_id', user.id);
        if (userInUsages) {
            res.status(200).json({ message: 'User already has usage limit created' });
        } else {
            const user = await getRecordById(connection, 'users', 'ip_address', ip_address);

            await insertRecord(connection, 'usages', { user_id: user.id, nr_of_available_messages: availableMessagesForUser });

            await commitTransaction(connection);
            res.status(201).json({ message: 'Available messages inserted successfully.' });
        }
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        next(error);
    }
});


usageRoute.post('/is_usage_credits_exists', async (req, res, next) => {
    const ip_address = req.clientIP;

    let connection;
    try {
        connection = await startTransaction();

        const user = await getRecordById(connection, 'users', 'ip_address', ip_address);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        const usage = await getRecordById(connection, 'usages', 'user_id', user.id);
        if (!usage) {
            res.status(404).json({ message: 'Usage not found for that user, use endpoint: insert-new-messages' });
            return;
        }

        res.status(200).json({ message: 'Usage credits already exist' });
        
        await commitTransaction(connection);
    } catch (error) {
        if (connection) {
            await rollbackTransaction(connection);
        }
        next(error);
    }
});



export default usageRoute;