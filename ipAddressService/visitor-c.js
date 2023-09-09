import express from 'express';
import dbConnection from './db.js';

const visitorRouter = express.Router();

// Helper function to insert a visitor
async function insertVisitor(visitorData) {
  const insertSQL = `
    INSERT INTO visitors (ip_address, region, city, postal_code, address)
    VALUES (?, ?, ?, ?, ?);
  `;
  const values = [
    visitorData.ip_address,
    visitorData.region,
    visitorData.city,
    visitorData.postal_code,
    visitorData.address,
  ];
  await dbConnection.query(insertSQL, values);
}

// Helper function to get a visitor by IP address
async function getVisitorByIPAddress(ipAddress) {
  // Define your SQL query to retrieve a visitor by IP address
  const selectQuery = 'SELECT * FROM visitors WHERE ip_address = ?';

  try {
    const [results] = await dbConnection.query(selectQuery, [ipAddress]);

    // Check if a visitor with the specified IP address exists
    if (results.length > 0) {
      // Return the first result (assuming there's only one matching visitor)
      return results[0];
    } else {
      // If no matching visitor is found, return null
      return null;
    }
  } catch (error) {
    // Handle any database errors here
    console.error(error);
    throw error;
  }
}


async function isVisitorExistsByIPAddress(ipAddress) {
  // Define your SQL query to check if a visitor with the given IP address exists
  const checkQuery = 'SELECT COUNT(*) AS count FROM visitors WHERE ip_address = ?';
  
  try {
    const [rows] = await dbConnection.query(checkQuery, [ipAddress]);
    
    // Extract the count from the result
    const count = rows[0].count;
    
    // If count is greater than 0, a visitor with the IP address exists
    return count > 0;
  } catch (error) {
    // Handle any database errors here
    console.error(error);
    throw error;
  }
}


// Helper function to get a visitor by ID
async function getVisitorById(visitorId) {
  const selectSQL = 'SELECT * FROM visitors WHERE id = ?';
  const [results] = await dbConnection.query(selectSQL, [visitorId]);
  return results[0];
}

// Helper function to delete a visitor by ID
async function deleteVisitorById(visitorId) {
  const deleteSQL = 'DELETE FROM visitors WHERE id = ?';
  await dbConnection.query(deleteSQL, [visitorId]);
}

// Helper function to mark a visitor as deleted by ID
async function markVisitorAsDeleted(visitorId) {
  const updateSQL = 'UPDATE visitors SET deleted = true, deleted_on = NOW() WHERE id = ?';
  await dbConnection.query(updateSQL, [visitorId]);
}

visitorRouter.get('/get-visitor-by-ip', async (req, res, next) => {
  try {
    const ip_address = req.headers['x-forwarded-for'] || req.ip;
    if (!ip_address) {
      throw new Error('ip_address is required.');
    }

    // Query the database to get the visitor data based on the IP address
    const visitor = await getVisitorByIPAddress(ip_address);

    if (!visitor) {
      throw new Error('Visitor not found.');
    }

    res.status(200).json({ message: 'Visitor retrieved successfully.', visitor });
  } catch (error) {
    next(error);
  }
});



// Define routes within the router
visitorRouter.post('/insert-visitor', async (req, res, next) => {
  try {
    const { ip_address, region, city, postal_code, address } = req.body;

    if (!ip_address) {
      throw new Error('ip_address is required.');
    }

    // Check if a visitor with the same IP address already exists
    const existingVisitor = await isVisitorExistsByIPAddress(ip_address);

    if (existingVisitor) {
      res.status(400).json({ message: 'Visitor with the same IP address already exists.' });
    } else {
      // Insert the visitor data
      await insertVisitor({ ip_address, region, city, postal_code, address });

      res.status(201).json({ message: 'Visitor inserted successfully.' });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});


visitorRouter.get('/get-visitor/:id', async (req, res, next) => {
  try {
    const visitorId = req.params.id;

    // Retrieve the visitor by ID
    const visitor = await getVisitorById(visitorId);

    if (!visitor) {
      throw new Error('Visitor not found.');
    }

    res.status(200).json({ message: 'Visitor retrieved successfully.', visitor });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

visitorRouter.delete('/delete-visitor/:id', async (req, res, next) => {
  try {
    const visitorId = req.params.id;

    // Delete the visitor by ID
    await deleteVisitorById(visitorId);

    res.status(200).json({ message: 'Visitor deleted successfully.' });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

visitorRouter.put('/mark-visitor-deleted/:id', async (req, res, next) => {
  try {
    const visitorId = req.params.id;

    // Mark the visitor as deleted by ID
    await markVisitorAsDeleted(visitorId);

    res.status(200).json({ message: 'Visitor marked as deleted successfully.' });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

export default visitorRouter;
