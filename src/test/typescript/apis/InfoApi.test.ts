import { InfoApi } from '../../../main/typescript/src/apis/InfoApi';
import { Configuration } from '../../../main/typescript/src/runtime';
import { VersionResponse } from '../../../main/typescript/src/models/VersionResponse';

describe('InfoApi', () => {
  let infoApi: InfoApi;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'https://api.xstr.me',
    });
    infoApi = new InfoApi(config);
    mockFetch.mockClear();
  });
  describe('getVersion', () => {
    it('should successfully get version information', async () => {
      const mockVersionResponse: VersionResponse = {
        version: '1.0.0',
        build: '123',
        timestamp: new Date('2025-06-03T10:00:00Z')
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockVersionResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      const result = await infoApi.getVersion();
      
      expect(result).toEqual(mockVersionResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.xstr.me/info/version',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });

    it('should handle version API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not Found' }),
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      await expect(infoApi.getVersion()).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle malformed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => { throw new Error('Invalid JSON'); },
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      await expect(infoApi.getVersion()).rejects.toThrow('Invalid JSON');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
