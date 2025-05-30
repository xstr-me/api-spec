import { ApiSpec, createApiSpec, getPackageVersion } from '../../src/typescript/index';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import '../jest.d.ts';

describe('ApiSpec', () => {
  const testSpecPath = path.join(__dirname, '../fixtures/test-spec.yml');
  const invalidSpecPath = path.join(__dirname, '../fixtures/invalid-spec.yml');
  
  beforeAll(() => {
    // Create test fixtures directory
    const fixturesDir = path.join(__dirname, '../fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }

    // Create a valid test OpenAPI spec
    const validSpec = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
        description: 'Test API specification'
      },
      servers: [
        {
          url: 'https://api.test.com',
          description: 'Test server'
        }
      ],
      paths: {
        '/users': {
          get: {
            operationId: 'getUsers',
            summary: 'Get all users',
            responses: {
              '200': {
                description: 'List of users'
              }
            }
          },
          post: {
            operationId: 'createUser',
            summary: 'Create a new user',
            responses: {
              '201': {
                description: 'User created'
              }
            }
          }
        },
        '/users/{id}': {
          get: {
            operationId: 'getUserById',
            summary: 'Get user by ID',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              '200': {
                description: 'User details'
              }
            }
          }
        }
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' }
            },
            required: ['id', 'name', 'email']
          },
          Error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    };

    fs.writeFileSync(testSpecPath, yaml.dump(validSpec));

    // Create an invalid test spec
    const invalidSpec = {
      // Missing required fields
      info: {
        title: 'Invalid API'
        // Missing version
      }
      // Missing paths
    };

    fs.writeFileSync(invalidSpecPath, yaml.dump(invalidSpec));
  });

  afterAll(() => {
    // Clean up test fixtures
    const fixturesDir = path.join(__dirname, '../fixtures');
    if (fs.existsSync(fixturesDir)) {
      fs.rmSync(fixturesDir, { recursive: true, force: true });
    }
  });

  describe('Constructor', () => {
    it('should create instance with default config', () => {
      const apiSpec = new ApiSpec();
      expect(apiSpec).toBeInstanceOf(ApiSpec);
      expect(apiSpec.isLoaded()).toBe(false);
    });

    it('should create instance with custom config', () => {
      const config = {
        specPath: testSpecPath,
        validateOnLoad: false,
        format: 'yaml' as const
      };
      const apiSpec = new ApiSpec(config);
      expect(apiSpec).toBeInstanceOf(ApiSpec);
    });
  });

  describe('load()', () => {    it('should load valid YAML specification', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      const spec = await apiSpec.load();
      
      expect(spec).toBeValidOpenAPI();
      expect(spec.info.title).toBe('Test API');
      expect(spec.info.version).toBe('1.0.0');
      expect(apiSpec.isLoaded()).toBe(true);
    });

    it('should throw error for non-existent file', async () => {
      const apiSpec = new ApiSpec({ specPath: '/non/existent/path.yml' });
      
      await expect(apiSpec.load()).rejects.toThrow('API specification file not found');
    });

    it('should throw error for invalid specification when validation enabled', async () => {
      const apiSpec = new ApiSpec({ 
        specPath: invalidSpecPath,
        validateOnLoad: true 
      });
      
      await expect(apiSpec.load()).rejects.toThrow();
    });

    it('should load invalid specification when validation disabled', async () => {
      const apiSpec = new ApiSpec({ 
        specPath: invalidSpecPath,
        validateOnLoad: false 
      });
      
      const spec = await apiSpec.load();
      expect(spec).toBeDefined();
      expect(apiSpec.isLoaded()).toBe(true);
    });
  });

  describe('getSpec()', () => {
    it('should return null when not loaded', () => {
      const apiSpec = new ApiSpec();
      expect(apiSpec.getSpec()).toBeNull();
    });    it('should return loaded specification', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      const spec = apiSpec.getSpec();
      expect(spec).toBeValidOpenAPI();
      expect(spec?.info.title).toBe('Test API');
    });
  });

  describe('getVersion()', () => {
    it('should return null when not loaded', () => {
      const apiSpec = new ApiSpec();
      expect(apiSpec.getVersion()).toBeNull();
    });

    it('should return API version when loaded', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      expect(apiSpec.getVersion()).toBe('1.0.0');
    });
  });

  describe('getTitle()', () => {
    it('should return null when not loaded', () => {
      const apiSpec = new ApiSpec();
      expect(apiSpec.getTitle()).toBeNull();
    });

    it('should return API title when loaded', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      expect(apiSpec.getTitle()).toBe('Test API');
    });
  });

  describe('getPaths()', () => {
    it('should return empty array when not loaded', () => {
      const apiSpec = new ApiSpec();
      expect(apiSpec.getPaths()).toEqual([]);
    });

    it('should return all paths when loaded', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      const paths = apiSpec.getPaths();
      expect(paths).toContain('/users');
      expect(paths).toContain('/users/{id}');
      expect(paths).toHaveLength(2);
    });
  });

  describe('getPath()', () => {
    it('should return null for non-existent path', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      expect(apiSpec.getPath('/non-existent')).toBeNull();
    });

    it('should return path configuration', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      const pathConfig = apiSpec.getPath('/users');
      expect(pathConfig).toBeDefined();
      expect(pathConfig.get).toBeDefined();
      expect(pathConfig.post).toBeDefined();
    });
  });

  describe('getMethodsForPath()', () => {
    it('should return empty array for non-existent path', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      expect(apiSpec.getMethodsForPath('/non-existent')).toEqual([]);
    });

    it('should return all HTTP methods for path', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      const methods = apiSpec.getMethodsForPath('/users');
      expect(methods).toContain('get');
      expect(methods).toContain('post');
      expect(methods).toHaveLength(2);
    });
  });

  describe('getServers()', () => {
    it('should return empty array when not loaded', () => {
      const apiSpec = new ApiSpec();
      expect(apiSpec.getServers()).toEqual([]);
    });

    it('should return server configurations', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
        const servers = apiSpec.getServers();
      expect(servers).toHaveLength(1);
      expect(servers[0]?.url).toBe('https://api.test.com');
      expect(servers[0]?.description).toBe('Test server');
    });
  });

  describe('getSchema()', () => {
    it('should return null for non-existent schema', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      expect(apiSpec.getSchema('NonExistent')).toBeNull();
    });

    it('should return schema definition', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      const schema = apiSpec.getSchema('User');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('object');
      expect(schema.properties.id).toBeDefined();
      expect(schema.properties.name).toBeDefined();
      expect(schema.properties.email).toBeDefined();
    });
  });

  describe('getSchemaNames()', () => {
    it('should return empty array when not loaded', () => {
      const apiSpec = new ApiSpec();
      expect(apiSpec.getSchemaNames()).toEqual([]);
    });

    it('should return all schema names', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();
      
      const schemaNames = apiSpec.getSchemaNames();
      expect(schemaNames).toContain('User');
      expect(schemaNames).toContain('Error');
      expect(schemaNames).toHaveLength(2);
    });
  });

  describe('toJSON()', () => {
    it('should throw error when not loaded', () => {
      const apiSpec = new ApiSpec();
      expect(() => apiSpec.toJSON()).toThrow('No specification loaded');
    });

    it('should return compact JSON string', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();      const json = apiSpec.toJSON();
      expect(typeof json).toBe('string');
      expect(() => JSON.parse(json)).not.toThrow();
      expect(json).not.toContain('\n'); // Compact format
    });

    it('should return pretty JSON string when requested', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();      const json = apiSpec.toJSON(true);
      expect(typeof json).toBe('string');
      expect(() => JSON.parse(json)).not.toThrow();
      expect(json).toContain('\n'); // Pretty format
    });
  });

  describe('toYAML()', () => {
    it('should throw error when not loaded', () => {
      const apiSpec = new ApiSpec();
      expect(() => apiSpec.toYAML()).toThrow('No specification loaded');
    });

    it('should return YAML string', async () => {
      const apiSpec = new ApiSpec({ specPath: testSpecPath });
      await apiSpec.load();      const yamlString = apiSpec.toYAML();
      expect(typeof yamlString).toBe('string');
      expect(() => yaml.load(yamlString)).not.toThrow();
    });
  });
});

describe('createApiSpec()', () => {
  const testSpecPath = path.join(__dirname, '../fixtures/create-test-spec.yml');
  
  beforeAll(() => {
    const fixturesDir = path.join(__dirname, '../fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }

    const spec = {
      openapi: '3.0.0',
      info: { title: 'Factory Test API', version: '1.0.0' },
      paths: {}
    };

    fs.writeFileSync(testSpecPath, yaml.dump(spec));
  });

  afterAll(() => {
    if (fs.existsSync(testSpecPath)) {
      fs.unlinkSync(testSpecPath);
    }
  });

  it('should create and load API specification', async () => {
    const apiSpec = await createApiSpec({ specPath: testSpecPath });
    
    expect(apiSpec).toBeInstanceOf(ApiSpec);
    expect(apiSpec.isLoaded()).toBe(true);
    expect(apiSpec.getTitle()).toBe('Factory Test API');
  });
  it('should create with default configuration', async () => {
    // Should successfully load the default api-spec.yml file
    const apiSpec = await createApiSpec();
    expect(apiSpec).toBeDefined();
    expect(apiSpec.getTitle()).toBe('XStr.me API');
  });
});

describe('getPackageVersion()', () => {
  it('should return package version', () => {
    const version = getPackageVersion();
    expect(typeof version).toBe('string');
    expect(version.length).toBeGreaterThan(0);
  });
});
