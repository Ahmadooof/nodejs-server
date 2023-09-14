import express from 'express';
import bodyParser from 'body-parser';
import cors from './cors.js';
import morgan from 'morgan';
import getClientIP from './middlewear/getClientIP.js';
import usageRoute from './routes/usage.js';
import userRoute from './routes/user.js';
import messagesRoute from './routes/messages.js';

var app = express();

app.use(bodyParser.json());


app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // for logging development purposes

app.use(cors);


app.use('/', userRoute)
app.use('/', usageRoute)
app.use('/', messagesRoute);
app.use(getClientIP)

app.listen(4000, () => {

});

// Error handling middleware Customize the error response based on the error type or status code
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({ message });
});
