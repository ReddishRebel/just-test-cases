const createFastifyStaticPlugin = require('@fastify/static');

/**
 * @param {FastifyInstance} fastify
 * @param {{ publicContext: { publicPath: String } }} options
 */
const createPublicContext = async (fastify, options) => {
  await fastify.register(createFastifyStaticPlugin, {
    root: options.publicContext.publicPath,
    prefix: '/'
  });
};

module.exports = { createPublicContext };

/** @import {FastifyInstance} from 'fastify'; */
