const config = require('../config');
const { isModuleAvailable } = require('./common');
const { pino } = require('pino');

const { randomUUID } = require('node:crypto');
const { threadId } = require('node:worker_threads');

const getStdoutTransport = level => ({ target: 'pino/file', level, options: { destination: 1 } });

const transports = {
  development(level) {
    const targets = [];
    const pretty = isModuleAvailable('pino-pretty');
    if (pretty) {
      targets.push({
        target: 'pino-pretty',
        level,
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true
        }
      });
    } else {
      targets.push(getStdoutTransport(level));
    }
    return { targets };
  },

  production(level) {
    return { targets: [getStdoutTransport(level)] };
  }
};

const mixins = {
  development(context, level) {
    return {
      label: pino.levels.labels[level],
      app: config.logger.appName
    };
  },

  production(context, level) {
    const currentDate = new Date();
    return {
      id: randomUUID(),
      localTime: currentDate.toISOString(),
      time: currentDate.getTime(),
      threadId,
      app: config.logger.appName,
      label: pino.levels.labels[level]
    };
  }
};

const options = {
  development: {
    level: config.logger.level,
    mixin: mixins.development,
    transport: transports.development(config.logger.level)
  },
  production: {
    level: config.logger.level,
    mixin: mixins.production,
    transport: transports.production(config.logger.level)
  },
  test: { level: 'silent' }
};

const pinoTransport = pino(options[config.environment]);

/**
 * @param {Record<String, any>} context
 * @returns {Logger}
 */
const createLogger = (context = {}) => {
  return pinoTransport.child(context);
};

module.exports = { createLogger };

/** @import {Logger as PinoLogger} from 'pino'; */
/** @typedef {PinoLogger} Logger */
