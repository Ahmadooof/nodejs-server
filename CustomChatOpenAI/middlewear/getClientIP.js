function getClientIP(req, res, next) {
    // Check for IP address in X-Forwarded-For header (common for reverse proxies)
    const forwardedFor = req.headers['x-forwarded-for'];

    // If the X-Forwarded-For header is present, use the first IP in the list (client's IP)
    if (forwardedFor) {
        const ips = forwardedFor.split(',');
        req.clientIP = ips[0].trim();
    } else {
        // If the X-Forwarded-For header is not present, use the remote address
        req.clientIP = req.connection.remoteAddress;
    }

    next();
}

export default getClientIP;
