import cors from 'cors';

const allowedOrigin = 'https://ahmadhome.com'; // Allow requests from a single domain 

const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
};

export default cors(corsOptions);