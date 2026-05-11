const pino = require('pino');
const Log = require('../models/Log');

// Custom write stream that persists each log line to MongoDB
const mongoStream = {
  write (line) {
    try {
      // Parse the JSON log line emitted by pino
      const entry = JSON.parse(line);
      // Persist the parsed log entry to MongoDB
      Log.create({
        level: pino.levels.labels[entry.level] || String(entry.level),
        message: entry.msg,
        endpoint: entry.endpoint || null,
        method: entry.method || null
      // Ignore write errors to avoid breaking the request pipeline
      }).catch(() => {});
    } catch (_) {}
  }
};

// Create the pino logger instance using the MongoDB stream
const logger = pino({ level: 'info' }, mongoStream);

// Express middleware – logs every incoming request
const logRequest = (req, _res, next) => {
  logger.info({ method: req.method, endpoint: req.path }, 'incoming request');
  next();
};

module.exports = { logger, logRequest };
