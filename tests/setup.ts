/**
 * Jest Test Setup Configuration
 * 
 * This file is executed once before all test suites.
 * It sets up custom matchers, global test utilities, and test environment configuration.
 */

import 'jest-extended';
import 'jest-extended/all';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Custom Jest matchers for API Spec testing
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidOpenAPI(): R;
      toHaveRequiredOpenAPIFields(): R;
      toBeValidPath(): R;
      toBeValidHttpMethod(): R;
      // jest-extended string matchers
      toBeString(): R;
    }
  }
  
  var testUtils: {
    createMinimalOpenAPISpec: () => any;
    createSampleOpenAPISpec: () => any;
    createInvalidOpenAPISpec: () => any;
  };
}

/**
 * Custom matcher: toBeValidOpenAPI
 * Validates that an object is a valid OpenAPI specification
 */
expect.extend({
  toBeValidOpenAPI(received: any) {
    const pass = 
      received !== null &&
      typeof received === 'object' &&
      typeof received.openapi === 'string' &&
      received.openapi.startsWith('3.') &&
      typeof received.info === 'object' &&
      typeof received.info.title === 'string' &&
      typeof received.info.version === 'string';

    if (pass) {
      return {
        message: () => `Expected object not to be a valid OpenAPI specification`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected object to be a valid OpenAPI specification with openapi version, info.title, and info.version`,
        pass: false,
      };
    }
  },

  toHaveRequiredOpenAPIFields(received: any) {
    const requiredFields = ['openapi', 'info'];
    const missingFields = requiredFields.filter(field => !(field in received));
    
    const pass = missingFields.length === 0;

    if (pass) {
      return {
        message: () => `Expected object to be missing required OpenAPI fields`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected object to have required OpenAPI fields: ${missingFields.join(', ')}`,
        pass: false,
      };
    }
  },

  toBeValidPath(received: string) {
    const pass = typeof received === 'string' && received.startsWith('/');

    if (pass) {
      return {
        message: () => `Expected "${received}" not to be a valid API path`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected "${received}" to be a valid API path (should start with "/")`,
        pass: false,
      };
    }
  },

  toBeValidHttpMethod(received: string) {
    const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];
    const pass = typeof received === 'string' && validMethods.includes(received.toLowerCase());

    if (pass) {
      return {
        message: () => `Expected "${received}" not to be a valid HTTP method`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected "${received}" to be a valid HTTP method (${validMethods.join(', ')})`,
        pass: false,
      };
    }
  },
});

/**
 * Global test utilities
 */
global.testUtils = {
  /**
   * Creates a minimal valid OpenAPI specification for testing
   */
  createMinimalOpenAPISpec: () => ({
    openapi: '3.0.3',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    paths: {},
  }),

  /**
   * Creates a sample OpenAPI specification with paths for testing
   */
  createSampleOpenAPISpec: () => ({
    openapi: '3.0.3',
    info: {
      title: 'Sample API',
      version: '1.0.0',
      description: 'A sample API specification for testing',
    },
    servers: [
      {
        url: 'https://api.example.com/v1',
        description: 'Production server',
      },
    ],
    paths: {
      '/users': {
        get: {
          summary: 'List users',
          operationId: 'listUsers',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/users/{id}': {
        get: {
          summary: 'Get user by ID',
          operationId: 'getUserById',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
            '404': {
              description: 'User not found',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'name', 'email'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
      },
    },
  }),

  /**
   * Creates an invalid OpenAPI specification for testing error cases
   */
  createInvalidOpenAPISpec: () => ({
    // Missing required 'openapi' field
    info: {
      title: 'Invalid API',
      version: '1.0.0',
    },
    paths: {},
  }),
};

/**
 * Configure test environment
 */
beforeAll(() => {
  // Ensure test directories exist
  const testDirs = [
    path.join(__dirname, '../coverage'),
    path.join(__dirname, '../.nyc_output')
  ];
  
  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  
  // Configure longer timeout for integration tests
  jest.setTimeout(30000);
});

afterAll(() => {
  // Clean up test environment
  delete process.env.NODE_ENV;
});

/**
 * Global error handling for unhandled promise rejections in tests
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In test environment, we want to know about unhandled rejections
  throw reason;
});

export {};