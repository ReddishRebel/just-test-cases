const envalid = require('envalid');
const path = require('path');

const env = envalid.cleanEnv(process.env, {
  PUBLIC_PATH: envalid.str({ default: undefined }),
  PORT: envalid.port({ default: 8000 }),
  HOST: envalid.host({ default: '127.0.0.1' }),
  LOG_APP_NAME: envalid.str({ default: '@just-test-cases/server' }),
  LOG_LEVEL: envalid.str({ default: 'info' }),
  NODE_ENV: envalid.str({ default: 'production' }),
  STORAGE_FILE_PATH: envalid.str({ default: path.resolve(process.cwd(), 'data') })
});

module.exports = {
  publicPath: env.PUBLIC_PATH,
  host: env.HOST,
  port: env.PORT,
  logger: {
    appName: env.LOG_APP_NAME,
    level: env.LOG_LEVEL
  },
  environment: env.NODE_ENV,
  storage: {
    file: {
      path: env.STORAGE_FILE_PATH
    }
  }
};
