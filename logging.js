import morgan from 'morgan'; // Logging middleware
import { use } from './server'; // Import the Express app

use(morgan(':method :url :status :res[content-length] - :response-time ms')); // for logging development purposes
