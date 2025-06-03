import { HealthResponse } from '../../../main/typescript/me/xstr/api/models/health-response';

describe('HealthResponse', () => {
  it('should create a valid HealthResponse object', () => {
    const healthResponse: HealthResponse = {
      status: 'OK',
      timestamp: '2025-06-03T10:00:00Z',
      checks: {
        database: 'OK',
        cache: 'OK'
      }
    };

    expect(healthResponse).toBeDefined();
    expect(healthResponse.status).toBe('OK');
    expect(healthResponse.timestamp).toBe('2025-06-03T10:00:00Z');
    expect(healthResponse.checks).toEqual({
      database: 'OK',
      cache: 'OK'
    });
  });

  it('should handle different status values', () => {
    const statuses = ['OK', 'WARNING', 'ERROR', 'UNKNOWN'];
    
    statuses.forEach(status => {
      const healthResponse: HealthResponse = {
        status,
        timestamp: '2025-06-03T10:00:00Z',
        checks: {}
      };
      
      expect(healthResponse.status).toBe(status);
    });
  });

  it('should handle optional properties', () => {
    const minimalResponse: HealthResponse = {
      status: 'OK',
      timestamp: '2025-06-03T10:00:00Z'
    };

    expect(minimalResponse.checks).toBeUndefined();
    expect(minimalResponse.status).toBe('OK');
  });
});
