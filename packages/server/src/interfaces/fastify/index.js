const config = require('../../config');
const { createApiContext } = require('./contexts/api');
const createFastify = require('fastify');
const { createLogger } = require('../../shared/logger');
const { createPublicContext } = require('./contexts/public');

const logger = createLogger({ module: 'interfaces/fastify/index.js' });

class FastifyInterface {
  /** @type {FastifyInstance | null} */
  #server = null;

  /** @returns {Promise<void>} */
  async start() {
    if (this.#server !== null) {
      throw new Error('An interface that has already been started cannot be started again.');
    }

    this.#server = createFastify({
      loggerInstance: logger,
      ajv: {
        customOptions: {
          coerceTypes: true,
          useDefaults: true,
          removeAdditional: false
        }
      }
    });
    await this.#server.register(createApiContext, { prefix: '/api' });

    if (config.publicPath) {
      await this.#server.register(createPublicContext, { publicContext: { publicPath: config.publicPath } });
    }

    return new Promise((resolve, reject) => {
      if (this.#server !== null) {
        this.#server.listen({ port: config.port, host: config.host }, error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        reject(new Error('Unable to start fastify server because of this. #server not initialized.'));
      }
    });
  }

  async stop() {
    if (this.#server !== null) {
      await this.#server.close();
      this.#server = null;
    }
  }
}

module.exports = new FastifyInterface();

/** @import {FastifyInstance, RawServerBase, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyBaseLogger} from 'fastify'; */
/** @import {JsonSchemaToTsProvider} from '@fastify/type-provider-json-schema-to-ts'; */

/**
 * @template {RawServerBase} [RawServer=RawServerDefault] . Default is `RawServerDefault`
 * @template {RawRequestDefaultExpression<RawServer>} [RawRequest=RawRequestDefaultExpression<RawServer>] Default is
 *   `RawRequestDefaultExpression<RawServer>`
 * @template {RawReplyDefaultExpression<RawServer>} [RawReply=RawReplyDefaultExpression<RawServer>] Default is
 *   `RawReplyDefaultExpression<RawServer>`
 * @template {FastifyBaseLogger} [Logger=FastifyBaseLogger] Default is `FastifyBaseLogger`
 * @typedef {FastifyInstance<RawServer, RawRequest, RawReply, Logger, JsonSchemaToTsProvider>} AppFastifyType
 */
