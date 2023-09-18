import express from 'express';
import { decrementColumnByCondition, getRecordById, incrementColumnByCondition, insertRecord } from '../helpers/database.js';
import { commitTransaction, rollbackTransaction, startTransaction } from '../db/dbConnection.js';
import { customOpenAI } from '../helpers/customOpenAI.js';

const messagesRoute = express.Router();


messagesRoute.post('/send-message', async (req, res, next) => {
  const ip_address = req.clientIP;
  const userMessage = req.body.userMessage;
  console.log(userMessage)
  let connection
  try {
    connection = await startTransaction();

    const user = await getRecordById(connection, 'users', 'ip_address', ip_address);

    if (!user)
      return res.status(200).json({ message: 'User not found.' });


    const usage = await getRecordById(connection, 'usages', 'user_id', user.id);

    if (!usage)
      return res.status(200).json({ message: 'Usage not found for that user' });


    if (usage.nr_of_available_messages > 0) {
      const responseText = await customOpenAI(userMessage);

      await insertRecord(connection, 'messages', {
        user_id: user.id,
        user_message: userMessage,
        ai_message: responseText
      });

      await incrementColumnByCondition(connection, 'usages', 'nr_of_sent_messages', 1, 'user_id', user.id);
      await decrementColumnByCondition(connection, 'usages', 'nr_of_available_messages', 1, 'user_id', user.id);
      const newUsage = await getRecordById(connection, 'usages', 'user_id', user.id);
      console.log(newUsage)
      res.status(200).json({ response: responseText, availableMessages: newUsage.nr_of_available_messages });

    }
    else
      return res.status(429).json({ message: 'No available messages for the user.' });


    await commitTransaction(connection);
  } catch (error) {
    if (connection) {
      await rollbackTransaction(connection);
    }
    next(error);
  }
});


export default messagesRoute;
