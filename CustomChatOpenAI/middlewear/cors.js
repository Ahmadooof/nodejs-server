import cors from 'cors';

// still in postman we can make request.

const allowedOrigin = 'https://ahmadhome.com'; // http://localhost:3000 reactjs https://ahmadhome.com

const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
};

export default cors(corsOptions);