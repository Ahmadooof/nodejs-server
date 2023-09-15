import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import getClientIP from './middlewear/getClientIP.js';
// import usageRoute from './routes/usage.js';
import userRoute from './routes/user.js';
import messagesRoute from './routes/messages.js';
import cors from './middlewear/cors.js';
import rateLimitMiddleware from './middlewear/rateLimit.js';

var app = express();

app.use(bodyParser.json());

app.use(cors);

app.use((req, res, next) => {
    console.log('Request Headers:', req.headers);
    next();
});
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // for logging development purposes


app.get('/', function (req, res) {
  res.send('hello world');
})

app.use(getClientIP) // order matter, this should be before routes, to get client ip from headers.

app.use(rateLimitMiddleware);

app.use('/', userRoute)
// app.use('/', usageRoute)
app.use('/', messagesRoute);

app.listen(4000, () => {

});

// Error handling middleware Customize the error response based on the error type or status code
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({ message });
});