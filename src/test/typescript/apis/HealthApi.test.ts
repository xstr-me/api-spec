import { HealthApi } from '../../../main/typescript/me/xstr/api/apis/health-api';
import { Configuration } from '../../../main/typescript/configuration';
import { HealthResponse, HealthResponseStatusEnum } from '../../../main/typescript/me/xstr/api/models/health-response';
import { AxiosInstance } from 'axios';

describe('HealthApi', () => {
  let healthApi: HealthApi;
  let mockAxios: jest.Mocked<AxiosInstance>;

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

    const config = new Configuration({
      basePath: 'https://api.xstr.me',
    });
    healthApi = new HealthApi(config, undefined, mockAxios);
  });

  describe('getHealth', () => {
    it('should successfully get health status', async () => {
      const mockHealthResponse: HealthResponse = {
        status: HealthResponseStatusEnum.HEALTHY,
        timestamp: '2025-06-03T10:00:00Z',
        version: '1.0.0',
        uptime: '5d 12h 30m'
      };

      mockAxios.request.mockResolvedValueOnce({
        data: mockHealthResponse,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config: {}
      });

      const result = await healthApi.getHealth();
      
      expect(result.data).toEqual(mockHealthResponse);
      expect(mockAxios.request).toHaveBeenCalledTimes(1);
    });

    it('should handle unhealthy status', async () => {
      const mockHealthResponse: HealthResponse = {
        status: HealthResponseStatusEnum.UNHEALTHY,
        timestamp: '2025-06-03T10:00:00Z',
        version: '1.0.0'
      };

      mockAxios.request.mockResolvedValueOnce({
        data: mockHealthResponse,
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'content-type': 'application/json' },
        config: {}
      });

      const result = await healthApi.getHealth();
      
      expect(result.data.status).toBe(HealthResponseStatusEnum.UNHEALTHY);
      expect(mockAxios.request).toHaveBeenCalledTimes(1);
    });    it('should handle health API errors', async () => {
      mockAxios.request.mockRejectedValueOnce(new Error('Internal Server Error'));

      await expect(healthApi.getHealth()).rejects.toThrow('Internal Server Error');
      expect(mockAxios.request).toHaveBeenCalledTimes(1);
    });

    it('should handle network errors', async () => {
      mockAxios.request.mockRejectedValueOnce(new Error('Network Error'));

      await expect(healthApi.getHealth()).rejects.toThrow('Network Error');
      expect(mockAxios.request).toHaveBeenCalledTimes(1);
    });

    it('should handle minimal health response', async () => {
      const minimalHealthResponse: HealthResponse = {
        status: HealthResponseStatusEnum.HEALTHY,
        timestamp: '2025-06-03T10:00:00Z'
      };

      mockAxios.request.mockResolvedValueOnce({
        data: minimalHealthResponse,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config: {}
      });

      const result = await healthApi.getHealth();
      
      expect(result.data.status).toBe(HealthResponseStatusEnum.HEALTHY);
      expect(result.data.timestamp).toBe('2025-06-03T10:00:00Z');
      expect(result.data.version).toBeUndefined();
      expect(result.data.uptime).toBeUndefined();
      expect(mockAxios.request).toHaveBeenCalledTimes(1);
    });
  });
});