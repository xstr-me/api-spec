import { VersionResponse } from '../../../main/typescript/me/xstr/api/models/version-response';

describe('VersionResponse', () => {
  it('should create a valid VersionResponse object', () => {
    const versionResponse: VersionResponse = {
      version: '1.0.0',
      buildNumber: '123',
      buildDate: '2025-06-03T10:00:00Z',
      gitCommit: 'abc123def',
      environment: 'production'
    };

    expect(versionResponse).toBeDefined();
    expect(versionResponse.version).toBe('1.0.0');
    expect(versionResponse.buildNumber).toBe('123');
    expect(versionResponse.buildDate).toBe('2025-06-03T10:00:00Z');
    expect(versionResponse.gitCommit).toBe('abc123def');
    expect(versionResponse.environment).toBe('production');
  });

  it('should handle different environment values', () => {
    const environments = ['development', 'staging', 'production'];
    
    environments.forEach(environment => {
      const versionResponse: VersionResponse = {
        version: '1.0.0',
        buildNumber: '123',
        buildDate: '2025-06-03T10:00:00Z',
        gitCommit: 'abc123def',
        environment
      };
      
      expect(versionResponse.environment).toBe(environment);
    });
  });

  it('should handle semantic version formats', () => {
    const versions = ['1.0.0', '2.1.3', '0.0.1-alpha', '1.2.3-beta.1'];
    
    versions.forEach(version => {
      const versionResponse: VersionResponse = {
        version,
        buildNumber: '123',
        buildDate: '2025-06-03T10:00:00Z',
        gitCommit: 'abc123def',
        environment: 'production'
      };
      
      expect(versionResponse.version).toBe(version);
    });
  });

  it('should handle optional properties', () => {
    const minimalResponse: VersionResponse = {
      version: '1.0.0'
    };

    expect(minimalResponse.buildNumber).toBeUndefined();
    expect(minimalResponse.buildDate).toBeUndefined();
    expect(minimalResponse.gitCommit).toBeUndefined();
    expect(minimalResponse.environment).toBeUndefined();
    expect(minimalResponse.version).toBe('1.0.0');
  });
});
