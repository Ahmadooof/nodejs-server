import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from '../cors.js';
import routes from './ipController.js'

var app = express();

app.use(bodyParser.json());

app.listen(4000, () => {
    // console.log(`dbConnection object:`, dbConnection); // log pool
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // for logging development purposes

app.use(cors);

app.use('/', routes);

// Error handling middleware Customize the error response based on the error type or status code
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({ message });
});
