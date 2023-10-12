const requestCounts = {};

function rateLimitMiddleware(req, res, next) {
    const ipAddress = req.clientIP;

    // Set your rate limit and time window (requests per minute in this example)
    const rateLimit = 1;  // 1 requests
    const timeWindow = 2000;  // 2 sec

    // Initialize request count for this IP address
    if (!requestCounts[ipAddress]) {
        requestCounts[ipAddress] = { count: 0, lastRequest: Date.now() };
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - requestCounts[ipAddress].lastRequest;

    // If time window has passed, reset the request count
    if (elapsedTime > timeWindow) {
        requestCounts[ipAddress] = { count: 1, lastRequest: currentTime };
    } else {
        // If time window hasn't passed, increment the request count
        requestCounts[ipAddress].count += 1;
        requestCounts[ipAddress].lastRequest = currentTime;
    }

    // Check if request count exceeds the rate limit
    if (requestCounts[ipAddress].count > rateLimit) {
        return res.status(429).send('Too many requests. Please try again later.');
    }

    next();  // Continue to the next middleware
};

export default rateLimitMiddleware;
