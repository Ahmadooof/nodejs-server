import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from './middlewear/cors.js';
import getClientIP from './middlewear/getClientIP.js';
import usageRoute from './routes/usage.js';
import userRoute from './routes/user.js';
import messagesRoute from './routes/messages.js';

var app = express();

app.use(cors);

app.use(bodyParser.json());

app.listen(4000, () => {
    // console.log(`dbConnection object:`, dbConnection); // log pool
});

app.use(getClientIP)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // for logging development purposes


app.use('/', userRoute)
app.use('/', usageRoute)
app.use('/', messagesRoute);



// Error handling middleware Customize the error response based on the error type or status code
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({ message });
});
