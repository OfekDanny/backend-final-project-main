const pino = require('pino');
const Log = require('../models/log-model');

const mongoStream = {
  write (line) {
    try {
      const entry = JSON.parse(line);
      Log.create({
        level: pino.levels.labels[entry.level] || String(entry.level),
        message: entry.msg,
        endpoint: entry.endpoint || null,
        method: entry.method || null
      }).catch(() => {});
    } catch (_) {}
  }
};

const logger = pino({ level: 'info' }, mongoStream);

const logRequest = (req, _res, next) => {
  logger.info({ method: req.method, endpoint: req.path }, 'incoming request');
  next();
};

module.exports = { logger, logRequest };
