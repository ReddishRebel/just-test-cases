const { DEFAULT_ITEMS_PER_PAGE, PageCursor } = require('../../../shared/pagination');
const { StorageFactory } = require('../../../modules/test-case/infra/storage');

/** @param {AppFastifyType} fastify */
const createApiContext = async fastify => {
  const storage = StorageFactory.createStorage();

  fastify.post(
    '/projects',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name'],
          properties: { name: { type: 'string' } },
          additionalProperties: false
        }
      }
    },
    async request => {
      return storage.createProject(request.body.name);
    }
  );

  fastify.get('/projects', async () => {
    const projects = await storage.getProjects();
    return { projects };
  });

  fastify.get(
    '/projects/:projectID/cases',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            itemsPerPage: { type: 'integer', minimum: 1, maximum: 15, default: DEFAULT_ITEMS_PER_PAGE }
          },
          additionalProperties: false
        },
        params: {
          type: 'object',
          required: ['projectID'],
          properties: {
            projectID: { type: 'string' }
          },
          additionalProperties: false
        }
      }
    },
    async request => {
      const pageCursor = new PageCursor({ page: request.query.page, itemsPerPage: request.query.itemsPerPage });
      return storage.getByProject(request.params.projectID, pageCursor);
    }
  );

  fastify.delete(
    '/projects/:projectID/cases/:caseID',
    {
      schema: {
        params: {
          type: 'object',
          required: ['projectID', 'caseID'],
          properties: {
            projectID: { type: 'string' },
            caseID: { type: 'string' }
          },
          additionalProperties: false
        }
      }
    },
    async request => {
      return storage.removeTestCase(request.params.projectID, request.params.caseID);
    }
  );

  fastify.put(
    '/projects/:projectID/cases',
    {
      schema: {
        body: {
          type: 'object',
          required: ['id', 'title', 'priority', 'description', 'preconditions', 'steps', 'results'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            description: { type: 'string' },
            preconditions: { $ref: '#/$defs/list' },
            steps: { $ref: '#/$defs/list' },
            results: { $ref: '#/$defs/list' }
          },
          additionalProperties: false,
          $defs: {
            list: {
              type: 'array',
              items: {
                anyOf: [
                  { type: 'string' },
                  {
                    type: 'array',
                    items: {
                      anyOf: [
                        { type: 'string' },
                        {
                          type: 'array',
                          items: { type: 'string' }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          }
        },
        params: {
          type: 'object',
          required: ['projectID'],
          properties: {
            projectID: { type: 'string' }
          },
          additionalProperties: false
        }
      }
    },
    async request => {
      return storage.saveTestCase(request.params.projectID, request.body);
    }
  );
};

module.exports = { createApiContext };

/** @import {AppFastifyType} from '../index'; */
