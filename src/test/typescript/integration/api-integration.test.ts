import { HealthApi } from '../../../main/typescript/me/xstr/api/apis/health-api';
import { InfoApi } from '../../../main/typescript/me/xstr/api/apis/info-api';
import { Configuration } from '../../../main/typescript/configuration';
import { HealthResponse, HealthResponseStatusEnum } from '../../../main/typescript/me/xstr/api/models/health-response';
import { VersionResponse } from '../../../main/typescript/me/xstr/api/models/version-response';
import { ErrorResponse } from '../../../main/typescript/me/xstr/api/models/error-response';
import { AxiosInstance } from 'axios';

describe('API Integration Tests', () => {
  let healthApi: HealthApi;
  let infoApi: InfoApi;
  let mockAxios: jest.Mocked<AxiosInstance>;
  let config: Configuration;

  beforeEach(() => {
    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
      request: jest.fn(),
      defaults: {} as any,
      interceptors: {} as any,
      getUri: jest.fn(),
    } as jest.Mocked<AxiosInstance>;

    config = new Configuration({
      basePath: 'https://api.xstr.me/v1',
      accessToken: 'test-bearer-token'
    });

    healthApi = new HealthApi(config, undefined, mockAxios);
    infoApi = new InfoApi(config, undefined, mockAxios);
  });

  describe('Configuration Integration', () => {
    it('should create APIs with shared configuration', () => {
      expect(healthApi).toBeDefined();
      expect(infoApi).toBeDefined();
      
      // Both APIs should share the same configuration
      expect((healthApi as any).configuration).toBe(config);
      expect((infoApi as any).configuration).toBe(config);
    });

    it('should handle different base paths', () => {
      const customConfig = new Configuration({
        basePath: 'https://custom.api.com/v2'
      });
      
      const customHealthApi = new HealthApi(customConfig, undefined, mockAxios);
      const customInfoApi = new InfoApi(customConfig, undefined, mockAxios);
      
      expect((customHealthApi as any).basePath).toBe('https://custom.api.com/v2');
      expect((customInfoApi as any).basePath).toBe('https://custom.api.com/v2');
    });

    it('should handle authentication configuration', () => {
      const authConfig = new Configuration({
        basePath: 'https://api.xstr.me/v1',
        accessToken: 'integration-test-token',
        username: 'testuser',
        password: 'testpass',
        apiKey: 'test-api-key'
      });
      
      const authHealthApi = new HealthApi(authConfig, undefined, mockAxios);
      const authInfoApi = new InfoApi(authConfig, undefined, mockAxios);
      
      expect((authHealthApi as any).configuration.accessToken).toBe('integration-test-token');
      expect((authInfoApi as any).configuration.username).toBe('testuser');
    });
  });

  describe('Cross-API Workflows', () => {
    it('should handle health check and version info workflow', async () => {
      const mockHealthResponse: HealthResponse = {
        status: HealthResponseStatusEnum.HEALTHY,
        timestamp: '2025-06-03T10:00:00Z',
        version: '1.0.0',
        uptime: '5d 12h 30m'
      };

      const mockVersionResponse: VersionResponse = {
        version: '1.0.0',
        build: '123',
        timestamp: '2025-06-03T10:00:00Z',
        buildNumber: '456',
        buildDate: '2025-06-01T08:00:00Z',
        gitCommit: 'abc123def456',
        environment: 'production'
      };

      mockAxios.request
        .mockResolvedValueOnce({
          data: mockHealthResponse,
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: {}
        })
        .mockResolvedValueOnce({
          data: mockVersionResponse,
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: {}
        });

      // First check health
      const healthResult = await healthApi.getHealth();
      expect(healthResult.data.status).toBe(HealthResponseStatusEnum.HEALTHY);
      expect(healthResult.data.version).toBe('1.0.0');

      // Then get detailed version info
      const versionResult = await infoApi.getVersion();
      expect(versionResult.data.version).toBe('1.0.0');
      expect(versionResult.data.environment).toBe('production');

      // Verify both calls were made
      expect(mockAxios.request).toHaveBeenCalledTimes(2);
    });

    it('should handle error scenarios consistently', async () => {
      const networkError = new Error('Network Error');

      mockAxios.request
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError);

      // Both APIs should handle errors consistently
      await expect(healthApi.getHealth()).rejects.toThrow('Network Error');
      await expect(infoApi.getVersion()).rejects.toThrow('Network Error');

      expect(mockAxios.request).toHaveBeenCalledTimes(2);
    });

    it('should handle service degradation workflow', async () => {
      const unhealthyResponse: HealthResponse = {
        status: HealthResponseStatusEnum.UNHEALTHY,
        timestamp: '2025-06-03T10:00:00Z',
        version: '1.0.0'
      };

      const versionResponse: VersionResponse = {
        version: '1.0.0',
        build: '123',
        timestamp: '2025-06-03T10:00:00Z'
      };

      mockAxios.request
        .mockResolvedValueOnce({
          data: unhealthyResponse,
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'content-type': 'application/json' },
          config: {}
        })
        .mockResolvedValueOnce({
          data: versionResponse,
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: {}
        });

      // Health check shows service is unhealthy
      const healthResult = await healthApi.getHealth();
      expect(healthResult.data.status).toBe(HealthResponseStatusEnum.UNHEALTHY);
      expect(healthResult.status).toBe(503);

      // But version info is still available
      const versionResult = await infoApi.getVersion();
      expect(versionResult.data.version).toBe('1.0.0');
      expect(versionResult.status).toBe(200);
    });
  });

  describe('Request/Response Validation', () => {
    it('should validate request headers are set correctly', async () => {
      const mockResponse: HealthResponse = {
        status: HealthResponseStatusEnum.HEALTHY,
        timestamp: '2025-06-03T10:00:00Z'
      };

      mockAxios.request.mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config: {}
      });

      await healthApi.getHealth();

      // Verify that the request was made with proper headers
      const requestCall = mockAxios.request.mock.calls[0][0];
      expect(requestCall.headers).toBeDefined();
      expect(requestCall.url).toContain('/health');
    });

    it('should handle content type validation', async () => {
      const mockResponse: VersionResponse = {
        version: '1.0.0',
        build: '123',
        timestamp: '2025-06-03T10:00:00Z'
      };

      mockAxios.request.mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: { 
          'content-type': 'application/json; charset=utf-8',
          'x-api-version': '1.0'
        },
        config: {}
      });

      const result = await infoApi.getVersion();
      
      expect(result.data).toEqual(mockResponse);
      expect(result.headers['content-type']).toContain('application/json');
    });

    it('should handle response status codes correctly', async () => {
      const scenarios = [
        { status: 200, statusText: 'OK' },
        { status: 201, statusText: 'Created' },
        { status: 202, statusText: 'Accepted' }
      ];

      for (const scenario of scenarios) {
        mockAxios.request.mockResolvedValueOnce({
          data: { status: HealthResponseStatusEnum.HEALTHY, timestamp: '2025-06-03T10:00:00Z' },
          status: scenario.status,
          statusText: scenario.statusText,
          headers: { 'content-type': 'application/json' },
          config: {}
        });

        const result = await healthApi.getHealth();
        expect(result.status).toBe(scenario.status);
      }
    });
  });

  describe('Error Response Integration', () => {
    it('should handle and parse error responses', async () => {
      const errorResponse: ErrorResponse = {
        error: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        timestamp: '2025-06-03T10:00:00Z',
        path: '/health',
        details: {
          code: 'INVALID_PARAMS',
          field: 'status'
        }
      };

      const axiosError = {
        response: {
          data: errorResponse,
          status: 400,
          statusText: 'Bad Request',
          headers: { 'content-type': 'application/json' }
        },
        message: 'Request failed with status code 400'
      };

      mockAxios.request.mockRejectedValueOnce(axiosError);

      try {
        await healthApi.getHealth();
      } catch (error: any) {
        expect(error.response.data).toEqual(errorResponse);
        expect(error.response.status).toBe(400);
      }
    });

    it('should handle different error types', async () => {
      const errorTypes = [
        { status: 400, error: 'BAD_REQUEST' },
        { status: 401, error: 'UNAUTHORIZED' },
        { status: 403, error: 'FORBIDDEN' },
        { status: 404, error: 'NOT_FOUND' },
        { status: 500, error: 'INTERNAL_SERVER_ERROR' }
      ];

      for (const errorType of errorTypes) {
        mockAxios.request.mockRejectedValueOnce({
          response: {
            data: {
              error: errorType.error,
              message: `HTTP ${errorType.status} Error`,
              timestamp: '2025-06-03T10:00:00Z'
            },
            status: errorType.status
          }
        });

        try {
          await infoApi.getVersion();
          fail(`Expected error for status ${errorType.status}`);
        } catch (error: any) {
          expect(error.response.status).toBe(errorType.status);
          expect(error.response.data.error).toBe(errorType.error);
        }
      }
    });
  });

  describe('Configuration Edge Cases', () => {
    it('should handle missing configuration gracefully', () => {
      const apiWithoutConfig = new HealthApi(undefined, undefined, mockAxios);
      expect(apiWithoutConfig).toBeDefined();
    });

    it('should handle empty configuration', () => {
      const emptyConfig = new Configuration({});
      const apiWithEmptyConfig = new HealthApi(emptyConfig, undefined, mockAxios);
      expect(apiWithEmptyConfig).toBeDefined();
    });

    it('should handle partial configuration', () => {
      const partialConfig = new Configuration({
        basePath: 'https://partial.api.com'
        // Missing other optional properties
      });
      
      const apiWithPartialConfig = new InfoApi(partialConfig, undefined, mockAxios);
      expect((apiWithPartialConfig as any).basePath).toBe('https://partial.api.com');
    });
  });

  describe('Type Safety Integration', () => {
    it('should enforce proper typing across APIs', () => {
      // This test verifies TypeScript compilation and type safety
      expect(typeof healthApi.getHealth).toBe('function');
      expect(typeof infoApi.getVersion).toBe('function');
      
      // Configuration should be properly typed
      const typedConfig: Configuration = new Configuration({
        basePath: 'string',
        accessToken: 'string'
      });
      expect(typedConfig).toBeDefined();
    });

    it('should maintain response type integrity', async () => {
      const healthResponse: HealthResponse = {
        status: HealthResponseStatusEnum.HEALTHY,
        timestamp: '2025-06-03T10:00:00Z'
      };

      const versionResponse: VersionResponse = {
        version: '1.0.0',
        build: '123',
        timestamp: '2025-06-03T10:00:00Z'
      };

      mockAxios.request
        .mockResolvedValueOnce({
          data: healthResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {}
        })
        .mockResolvedValueOnce({
          data: versionResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {}
        });

      const healthResult = await healthApi.getHealth();
      const versionResult = await infoApi.getVersion();

      // TypeScript should enforce proper return types
      expect(healthResult.data.status).toBeDefined();
      expect(versionResult.data.version).toBeDefined();
    });
  });
});