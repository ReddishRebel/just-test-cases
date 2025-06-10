const { createLogger } = require('./shared/logger');
const interfaces = require('./interfaces');

const logger = createLogger({ module: 'index.js' });

const catchUnhandled = error => {
  logger.fatal(error, 'An unhandled exception/rejection was encountered while the application was running.');
  process.exit(1);
};

const main = async () => {
  try {
    for (const iface of interfaces) {
      await iface.start();
    }
  } catch (error) {
    logger.fatal(error, 'Unable to start application.');
  }
};

process.once('uncaughtException', catchUnhandled);
process.once('unhandledRejection', catchUnhandled);

main();
