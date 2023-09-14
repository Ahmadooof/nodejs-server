import cors from 'cors';

const allowedOrigins = ['https://ahmadhome.com']; // http://localhost:3000   https://ahmadhome.com

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the allowedOrigins array
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
};

export default cors(corsOptions);