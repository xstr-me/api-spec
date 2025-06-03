import { ErrorResponse } from '@/models/ErrorResponse';

describe('ErrorResponse', () => {
  it('should create a valid ErrorResponse object', () => {
    const errorResponse: ErrorResponse = {
      error: 'VALIDATION_ERROR',
      message: 'Invalid input parameters',
      timestamp: '2025-06-03T10:00:00Z',
      path: '/api/v1/test',
      details: {
        field: 'email',
        code: 'INVALID_FORMAT'
      }
    };

    expect(errorResponse).toBeDefined();
    expect(errorResponse.error).toBe('VALIDATION_ERROR');
    expect(errorResponse.message).toBe('Invalid input parameters');
    expect(errorResponse.timestamp).toBe('2025-06-03T10:00:00Z');
    expect(errorResponse.path).toBe('/api/v1/test');
    expect(errorResponse.details).toEqual({
      field: 'email',
      code: 'INVALID_FORMAT'
    });
  });

  it('should handle different error types', () => {
    const errorTypes = ['VALIDATION_ERROR', 'NOT_FOUND', 'INTERNAL_ERROR', 'UNAUTHORIZED'];
    
    errorTypes.forEach(error => {
      const errorResponse: ErrorResponse = {
        error,
        message: 'Test error message',
        timestamp: '2025-06-03T10:00:00Z'
      };
      
      expect(errorResponse.error).toBe(error);
    });
  });

  it('should handle minimal error response', () => {
    const minimalResponse: ErrorResponse = {
      error: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred'
    };

    expect(minimalResponse.timestamp).toBeUndefined();
    expect(minimalResponse.path).toBeUndefined();
    expect(minimalResponse.details).toBeUndefined();
    expect(minimalResponse.error).toBe('UNKNOWN_ERROR');
    expect(minimalResponse.message).toBe('An unexpected error occurred');
  });

  it('should handle complex error details', () => {
    const errorResponse: ErrorResponse = {
      error: 'VALIDATION_ERROR',
      message: 'Multiple validation errors',
      timestamp: '2025-06-03T10:00:00Z',
      path: '/api/v1/users',
      details: {
        fields: ['email', 'password'],
        codes: ['INVALID_FORMAT', 'TOO_SHORT'],
        count: 2
      }
    };

    expect(errorResponse.details).toEqual({
      fields: ['email', 'password'],
      codes: ['INVALID_FORMAT', 'TOO_SHORT'],
      count: 2
    });
  });
});
