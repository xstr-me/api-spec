import { InfoApi } from '../../../main/typescript/me/xstr/api/apis/info-api';
import { Configuration } from '../../../main/typescript/configuration';
import { VersionResponse } from '../../../main/typescript/me/xstr/api/models/version-response';
import { AxiosInstance } from 'axios';

describe('InfoApi', () => {
  let infoApi: InfoApi;
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
    infoApi = new InfoApi(config, undefined, mockAxios);
  });

  describe('getVersion', () => {
    it('should successfully get version information', async () => {
      const mockVersionResponse: VersionResponse = {
        version: '1.0.0',
        build: '123',
        timestamp: '2025-06-03T10:00:00Z'
      };

      mockAxios.request.mockResolvedValueOnce({
        data: mockVersionResponse,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config: {}
      });

      const result = await infoApi.getVersion();
      
      expect(result.data).toEqual(mockVersionResponse);
      expect(mockAxios.request).toHaveBeenCalledTimes(1);
    });    it('should handle version API errors', async () => {
      mockAxios.request.mockRejectedValueOnce(new Error('Not Found'));

      await expect(infoApi.getVersion()).rejects.toThrow('Not Found');
      expect(mockAxios.request).toHaveBeenCalledTimes(1);
    });

    it('should handle malformed response', async () => {
      mockAxios.request.mockRejectedValueOnce(new Error('Invalid JSON'));

      await expect(infoApi.getVersion()).rejects.toThrow('Invalid JSON');
      expect(mockAxios.request).toHaveBeenCalledTimes(1);
    });
  });
});
