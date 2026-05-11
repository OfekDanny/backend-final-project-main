const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./utils/connect-db');
const { logRequest } = require('./utils/pino-logger');

// Load environment variables from .env
dotenv.config();

// Initialize Express and register middleware
const app = express();
app.use(express.json());
app.use(logRequest);

// Connect to the database
connectDb();

// Register all API routes
app.use('/', require('./routes/index'));

// Start the HTTP server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`process-logs listening on port ${port}`));
