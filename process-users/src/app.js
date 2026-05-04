const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./utils/connect-db');
const createUser = require('./utils/create-user');
const { logRequest } = require('./utils/pino-logger');

dotenv.config();

const app = express();
app.use(express.json());
app.use(logRequest);

connectDb().then(() => createUser());

app.use('/', require('./routes/index'));

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`process-users listening on port ${port}`));
