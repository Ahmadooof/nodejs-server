import express from 'express';
import dbConnection from '../db.js';

const router = express.Router();


// Helper function to check if an IP address exists
async function checkIfIpAddressExists(ipAddress) {
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM ip_addresses WHERE ip_address = ?';
  const [results] = await dbConnection.query(checkIfExistsSQL, [ipAddress]);
  return results[0].count > 0;
}

// Helper function to insert an IP address
async function insertIpAddress(ipAddress) {
  const insertSQL = 'INSERT INTO ip_addresses (ip_address) VALUES (?)';
  await dbConnection.query(insertSQL, [ipAddress]);
}

// Helper function to retrieve an IP address by ID
async function retrieveIpAddressById(ipAddressId) {
  const retrieveSQL = 'SELECT * FROM ip_addresses WHERE id = ?';
  const [results] = await dbConnection.query(retrieveSQL, [ipAddressId]);
  return results.length > 0 ? results[0].ip_address : null;
}

// Define routes within the router
router.post('/insert-ip', async (req, res, next) => {
  try {
    const { ipAddress } = req.body;

    if (!ipAddress) {
      throw new Error('IP address is required.');
    }

    // Check if the IP address already exists
    const exists = await checkIfIpAddressExists(ipAddress);

    if (exists) {
      throw new Error('IP address already exists.');
    }

    // Insert the IP address if it doesn't exist
    await insertIpAddress(ipAddress);

    res.status(201).json({ message: 'IP address inserted successfully.' });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/get-ip/:id', async (req, res, next) => {
  try {
    const ipAddressId = req.params.id;

    // Retrieve the IP address by ID
    const ipAddress = await retrieveIpAddressById(ipAddressId);

    if (ipAddress === null) {
      throw new Error('IP address not found.');
    }

    res.status(200).json({ message: 'IP address retrieved successfully.', ipAddress });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

export default router;
