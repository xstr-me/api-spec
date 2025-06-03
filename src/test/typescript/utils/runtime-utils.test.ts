import { 
  DUMMY_BASE_URL, 
  assertParamExists, 
  setApiKeyToObject, 
  setBasicAuthToObject, 
  setBearerAuthToObject, 
  setOAuthToObject, 
  setSearchParams, 
  serializeDataIfNeeded, 
  toPathString, 
  createRequestFunction 
} from '../../../main/typescript/common';
import { Configuration } from '../../../main/typescript/configuration';
import { BASE_PATH, RequestArgs, RequiredError } from '../../../main/typescript/base';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

// Mock axios for testing
const mockAxios: jest.Mocked<AxiosInstance> = {
  request: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  head: jest.fn(),
  options: jest.fn(),
  defaults: { baseURL: 'https://api.xstr.me' } as any,
  interceptors: {} as any,
  getUri: jest.fn()
} as jest.Mocked<AxiosInstance>;

describe('Runtime Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DUMMY_BASE_URL', () => {
    it('should have a dummy base URL defined', () => {
      expect(DUMMY_BASE_URL).toBe('https://example.com');
    });
  });

  describe('assertParamExists', () => {
    it('should not throw when parameter exists', () => {
      expect(() => assertParamExists('testFunction', 'testParam', 'value')).not.toThrow();
      expect(() => assertParamExists('testFunction', 'testParam', 0)).not.toThrow();
      expect(() => assertParamExists('testFunction', 'testParam', false)).not.toThrow();
    });

    it('should throw RequiredError when parameter is null', () => {
      expect(() => assertParamExists('testFunction', 'testParam', null))
        .toThrow(RequiredError);
    });

    it('should throw RequiredError when parameter is undefined', () => {
      expect(() => assertParamExists('testFunction', 'testParam', undefined))
        .toThrow(RequiredError);
    });

    it('should include function and parameter names in error message', () => {
      try {
        assertParamExists('getHealth', 'userId', null);
      } catch (error) {
        expect(error).toBeInstanceOf(RequiredError);
        expect((error as RequiredError).message).toContain('getHealth');
        expect((error as RequiredError).message).toContain('userId');
      }
    });
  });

  describe('setApiKeyToObject', () => {
    it('should set API key from string', async () => {
      const obj = {};
      const config = new Configuration({ apiKey: 'test-api-key' });
      
      await setApiKeyToObject(obj, 'X-API-Key', config);
      
      expect(obj).toEqual({ 'X-API-Key': 'test-api-key' });
    });

    it('should set API key from function', async () => {
      const obj = {};
      const config = new Configuration({ 
        apiKey: (name: string) => `${name}-key-value` 
      });
      
      await setApiKeyToObject(obj, 'X-API-Key', config);
      
      expect(obj).toEqual({ 'X-API-Key': 'X-API-Key-key-value' });
    });

    it('should not set API key when no configuration', async () => {
      const obj = {};
      
      await setApiKeyToObject(obj, 'X-API-Key');
      
      expect(obj).toEqual({});
    });

    it('should not set API key when no apiKey in configuration', async () => {
      const obj = {};
      const config = new Configuration({});
      
      await setApiKeyToObject(obj, 'X-API-Key', config);
      
      expect(obj).toEqual({});
    });
  });

  describe('setBasicAuthToObject', () => {
    it('should set basic auth with username and password', () => {
      const obj = {};
      const config = new Configuration({ 
        username: 'testuser', 
        password: 'testpass' 
      });
      
      setBasicAuthToObject(obj, config);
      
      expect(obj).toEqual({ 
        auth: { username: 'testuser', password: 'testpass' } 
      });
    });

    it('should set basic auth with only username', () => {
      const obj = {};
      const config = new Configuration({ username: 'testuser' });
      
      setBasicAuthToObject(obj, config);
      
      expect(obj).toEqual({ 
        auth: { username: 'testuser', password: undefined } 
      });
    });

    it('should not set auth when no configuration', () => {
      const obj = {};
      
      setBasicAuthToObject(obj);
      
      expect(obj).toEqual({});
    });

    it('should not set auth when no username or password', () => {
      const obj = {};
      const config = new Configuration({});
      
      setBasicAuthToObject(obj, config);
      
      expect(obj).toEqual({});
    });
  });

  describe('setBearerAuthToObject', () => {
    it('should set bearer token from string', async () => {
      const obj = {};
      const config = new Configuration({ accessToken: 'bearer-token-123' });
      
      await setBearerAuthToObject(obj, config);
      
      expect(obj).toEqual({ 'Authorization': 'Bearer bearer-token-123' });
    });

    it('should set bearer token from function', async () => {
      const obj = {};
      const config = new Configuration({ 
        accessToken: () => Promise.resolve('async-bearer-token') 
      });
      
      await setBearerAuthToObject(obj, config);
      
      expect(obj).toEqual({ 'Authorization': 'Bearer async-bearer-token' });
    });

    it('should not set bearer token when no configuration', async () => {
      const obj = {};
      
      await setBearerAuthToObject(obj);
      
      expect(obj).toEqual({});
    });

    it('should not set bearer token when no accessToken in configuration', async () => {
      const obj = {};
      const config = new Configuration({});
      
      await setBearerAuthToObject(obj, config);
      
      expect(obj).toEqual({});
    });
  });

  describe('setSearchParams', () => {
    it('should set search parameters on URL', () => {
      const url = new URL('https://api.example.com/health');
      const params = { status: 'all', limit: 10 };
      
      setSearchParams(url, params);
      
      expect(url.search).toContain('status=all');
      expect(url.search).toContain('limit=10');
    });

    it('should handle multiple parameter objects', () => {
      const url = new URL('https://api.example.com/search');
      const params1 = { q: 'test' };
      const params2 = { page: 1, size: 20 };
      
      setSearchParams(url, params1, params2);
      
      expect(url.search).toContain('q=test');
      expect(url.search).toContain('page=1');
      expect(url.search).toContain('size=20');
    });

    it('should handle empty parameters', () => {
      const url = new URL('https://api.example.com/health');
      const originalSearch = url.search;
      
      setSearchParams(url, {});
      
      expect(url.search).toBe(originalSearch);
    });
  });

  describe('serializeDataIfNeeded', () => {
    it('should serialize object to JSON', () => {
      const data = { name: 'test', value: 123 };
      const requestOptions = { headers: { 'Content-Type': 'application/json' } };
      const config = new Configuration();
      
      const result = serializeDataIfNeeded(data, requestOptions, config);
      
      expect(result).toBe('{"name":"test","value":123}');
    });

    it('should not serialize string data', () => {
      const data = 'test-string';
      const requestOptions = { headers: { 'Content-Type': 'application/json' } };
      const config = new Configuration();
      
      const result = serializeDataIfNeeded(data, requestOptions, config);
      
      expect(result).toBe('test-string');
    });

    it('should handle undefined data', () => {
      const requestOptions = { headers: { 'Content-Type': 'application/json' } };
      const config = new Configuration();
      
      const result = serializeDataIfNeeded(undefined, requestOptions, config);
      
      expect(result).toBe('{}');
    });
  });

  describe('toPathString', () => {
    it('should return full path with search and hash', () => {
      const url = new URL('https://api.example.com/health?status=all#section1');
      
      const result = toPathString(url);
      
      expect(result).toBe('/health?status=all#section1');
    });

    it('should return path only when no search or hash', () => {
      const url = new URL('https://api.example.com/health');
      
      const result = toPathString(url);
      
      expect(result).toBe('/health');
    });
  });

  describe('createRequestFunction', () => {
    it('should create a request function with axios args', () => {
      const axiosArgs: RequestArgs = {
        url: '/health',
        options: { method: 'GET' }
      };
      
      const requestFunction = createRequestFunction(axiosArgs, mockAxios, BASE_PATH);
      
      expect(typeof requestFunction).toBe('function');
    });

    it('should call axios.request with correct arguments', async () => {
      const axiosArgs: RequestArgs = {
        url: '/health',
        options: { method: 'GET', headers: { 'Accept': 'application/json' } }
      };
      
      mockAxios.request.mockResolvedValueOnce({ data: {}, status: 200 });
      
      const requestFunction = createRequestFunction(axiosArgs, mockAxios, BASE_PATH);
      await requestFunction();
        expect(mockAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        url: 'https://api.xstr.me/health'
      });
    });

    it('should use configuration basePath when provided', async () => {
      const axiosArgs: RequestArgs = {
        url: '/health',
        options: { method: 'GET' }
      };
      const config = new Configuration({ basePath: 'https://custom.api.com/v2' });
      
      mockAxios.request.mockResolvedValueOnce({ data: {}, status: 200 });
      
      const requestFunction = createRequestFunction(axiosArgs, mockAxios, BASE_PATH, config);
      await requestFunction();
      
      expect(mockAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://custom.api.com/v2/health'
      });
    });
  });

  describe('BASE_PATH constant', () => {
    it('should have the correct base path', () => {
      expect(BASE_PATH).toBe('https://api.xstr.me/v1');
    });
  });

  describe('RequiredError', () => {
    it('should create RequiredError with field and message', () => {
      const error = new RequiredError('testField', 'Test error message');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(RequiredError);
      expect(error.name).toBe('RequiredError');
      expect(error.field).toBe('testField');
      expect(error.message).toBe('Test error message');
    });    it('should create RequiredError with only field', () => {
      const error = new RequiredError('testField');
      
      expect(error.field).toBe('testField');
      expect(error.message).toBe('');
    });
  });
});