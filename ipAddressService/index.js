import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
// import getClientIP from './middlewear/getClientIP.js';
import usageRoute from './routes/usage.js';
import userRoute from './routes/user.js';
import messagesRoute from './routes/messages.js';
import cors from 'cors';

const allowedOrigin = 'https://ahmadhome.com'; // http://localhost:3000 reactjs

const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
};

var app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log('Request Headers:', req.headers);
//     next();
// });
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // for logging development purposes

app.use(cors(corsOptions));

app.get('/', function (req, res) {
  res.send('hello');
})

app.use('/', userRoute)
app.use('/', usageRoute)
app.use('/', messagesRoute);
// app.use(getClientIP)

app.listen(4000, () => {

});

// Error handling middleware Customize the error response based on the error type or status code
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({ message });
});
