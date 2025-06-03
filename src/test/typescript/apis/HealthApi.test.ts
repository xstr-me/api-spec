import { HealthApi } from '../../../main/typescript/src/apis/HealthApi';
import { Configuration } from '../../../main/typescript/src/runtime';
import { HealthResponse } from '../../../main/typescript/src/models/HealthResponse';

describe('HealthApi', () => {
  let healthApi: HealthApi;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'https://api.xstr.me',
    });
    healthApi = new HealthApi(config);
    mockFetch.mockClear();
  });

  describe('getHealth', () => {
    it('should successfully get health status', async () => {
      const mockHealthResponse: HealthResponse = {
        status: 'healthy' as any,
        timestamp: new Date('2025-06-03T10:00:00Z'),
        version: '1.0.0',
        uptime: '10h 30m'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockHealthResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      const result = await healthApi.getHealth();
      
      expect(result).toEqual(mockHealthResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.xstr.me/health',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' }),
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      await expect(healthApi.getHealth()).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(healthApi.getHealth()).rejects.toThrow('Network error');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
