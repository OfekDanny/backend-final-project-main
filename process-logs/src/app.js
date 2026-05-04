const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./utils/connect-db');
const { logRequest } = require('./utils/pino-logger');

dotenv.config();

const app = express();
app.use(express.json());
app.use(logRequest);

connectDb();

app.use('/', require('./routes/index'));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`process-logs listening on port ${port}`));
