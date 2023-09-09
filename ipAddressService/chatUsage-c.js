import express from 'express';
import dbConnection from './db.js';

const chatUsageRouter = express.Router();

const incrementMessagesSent = async (visitorId) => {
    // Check if a record for the visitor exists in chat_usage
    const checkQuery = 'SELECT id FROM chat_usage WHERE visitor_id = ?';

    // Insert query to create a record if it doesn't exist
    const insertQuery = 'INSERT INTO chat_usage (visitor_id, messages_sent) VALUES (?, 1)';

    // Update query to increment messages_sent
    const updateQuery = 'UPDATE chat_usage SET messages_sent = messages_sent + 1 WHERE visitor_id = ?';

    try {
        // Check if a record exists for the visitor
        const [rows] = await dbConnection.query(checkQuery, [visitorId]);

        if (rows.length === 0) {
            // If no record exists, create a default record
            await dbConnection.query(insertQuery, [visitorId]);
        } else {
            // If a record exists, increment messages_sent
            await dbConnection.query(updateQuery, [visitorId]);
        }
    } catch (error) {
        // Handle any database errors here
        console.error(error);
        throw error;
    }
};


const nrOfMessagesUsed = async (visitor_id) => {
    const selectQuery = `
      SELECT SUM(messages_sent) AS total_messages_sent
      FROM chat_usage
      WHERE visitor_id = ?;
    `;
    try {
        // Execute the SQL query using the database connection
        const [rows] = await dbConnection.execute(selectQuery, [visitor_id]);

        // The query was successful, and you can access the result
        const totalMessagesSent = rows[0].total_messages_sent;

        return totalMessagesSent;
    } catch (error) {
        // Handle any database errors here
        console.error('Error retrieving total messages sent:', error);
        throw error;
    }
};


const createDefaultChatUsage = async (visitorId) => {
    // Insert query to create a default record
    const insertQuery = 'INSERT INTO chat_usage (visitor_id, messages_sent) VALUES (?, 1)';

    try {
        // Insert the default record
        await dbConnection.query(insertQuery, [visitorId]);
    } catch (error) {
        // Handle any database errors here
        console.error(error);
        throw error;
    }
};


chatUsageRouter.get('/get-messages-sent-by-id', async (req, res) => {
    try {
      // Retrieve the visitor_id from the query parameters
      const { visitor_id } = req.query;
  
      if (!visitor_id) {
        // If the visitor_id is missing in the query parameters, return a 400 Bad Request response
        return res.status(400).json({ error: 'VisitorID is missing in the query parameters' });
      }
  
      // Call the nrOfMessagesUsed function with the retrieved visitor_id
      const messagesSent = await nrOfMessagesUsed(visitor_id);
  
      res.json({ messagesSent });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

chatUsageRouter.post('/increment-messages', async (req, res, next) => {
    try {
        const { visitorId } = req.body;

        if (!visitorId) {
            throw new Error('visitorId is required.');
        }

        // Call the function to increment messages_sent for the specified visitor
        await incrementMessagesSent(visitorId);

        res.status(200).json({ message: 'Message count incremented successfully.' });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});



chatUsageRouter.post('/create-default-chat-usage', async (req, res, next) => {
    try {
        const { visitorId } = req.body;

        if (!visitorId) {
            throw new Error('visitorId is required.');
        }

        // Call the function to create a default chat usage record for the specified visitor
        await createDefaultChatUsage(visitorId);

        res.status(201).json({ message: 'Default chat usage record created successfully.' });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

export default chatUsageRouter;
