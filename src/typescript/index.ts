import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * XStr.me API Specification Package
 * 
 * Provides TypeScript interfaces and utilities for working with the XStr.me API specification.
 */

export interface ApiSpecConfig {
  specPath?: string;
  validateOnLoad?: boolean;
  format?: 'yaml' | 'json';
}

export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
    responses?: Record<string, any>;
    parameters?: Record<string, any>;
    examples?: Record<string, any>;
    requestBodies?: Record<string, any>;
    headers?: Record<string, any>;
    securitySchemes?: Record<string, any>;
    links?: Record<string, any>;
    callbacks?: Record<string, any>;
  };
}

/**
 * Main API Specification class for TypeScript/JavaScript applications
 */
export class ApiSpec {
  private spec: OpenApiSpec | null = null;
  private specPath: string;
  private config: ApiSpecConfig;

  constructor(config: ApiSpecConfig = {}) {
    this.config = {
      specPath: config.specPath || path.join(__dirname, '../../api-spec.yml'),
      validateOnLoad: config.validateOnLoad ?? true,
      format: config.format || 'yaml',
      ...config
    };
    this.specPath = this.config.specPath!;
  }

  /**
   * Load the API specification from file
   */
  public async load(): Promise<OpenApiSpec> {
    try {
      if (!fs.existsSync(this.specPath)) {
        throw new Error(`API specification file not found: ${this.specPath}`);
      }

      const content = fs.readFileSync(this.specPath, 'utf8');
      
      if (this.config.format === 'yaml' || this.specPath.endsWith('.yml') || this.specPath.endsWith('.yaml')) {
        this.spec = yaml.load(content) as OpenApiSpec;
      } else {
        this.spec = JSON.parse(content) as OpenApiSpec;
      }

      if (this.config.validateOnLoad) {
        this.validateSpec();
      }

      return this.spec;
    } catch (error) {
      throw new Error(`Failed to load API specification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the loaded API specification
   */
  public getSpec(): OpenApiSpec | null {
    return this.spec;
  }

  /**
   * Get API version from specification
   */
  public getVersion(): string | null {
    return this.spec?.info?.version || null;
  }

  /**
   * Get API title from specification
   */
  public getTitle(): string | null {
    return this.spec?.info?.title || null;
  }

  /**
   * Get all available paths from the specification
   */
  public getPaths(): string[] {
    if (!this.spec?.paths) {
      return [];
    }
    return Object.keys(this.spec.paths);
  }

  /**
   * Get path configuration for a specific endpoint
   */
  public getPath(path: string): any | null {
    return this.spec?.paths?.[path] || null;
  }

  /**
   * Get all HTTP methods for a specific path
   */
  public getMethodsForPath(path: string): string[] {
    const pathConfig = this.getPath(path);
    if (!pathConfig) {
      return [];
    }
    return Object.keys(pathConfig).filter(key => 
      ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'].includes(key.toLowerCase())
    );
  }

  /**
   * Get server URLs from specification
   */
  public getServers(): Array<{ url: string; description?: string }> {
    return this.spec?.servers || [];
  }

  /**
   * Get schema definition by name
   */
  public getSchema(name: string): any | null {
    return this.spec?.components?.schemas?.[name] || null;
  }

  /**
   * Get all available schema names
   */
  public getSchemaNames(): string[] {
    if (!this.spec?.components?.schemas) {
      return [];
    }
    return Object.keys(this.spec.components.schemas);
  }

  /**
   * Basic validation of the OpenAPI specification
   */
  private validateSpec(): void {
    if (!this.spec) {
      throw new Error('No specification loaded');
    }

    if (!this.spec.openapi) {
      throw new Error('Missing required field: openapi');
    }

    if (!this.spec.info) {
      throw new Error('Missing required field: info');
    }

    if (!this.spec.info.title) {
      throw new Error('Missing required field: info.title');
    }

    if (!this.spec.info.version) {
      throw new Error('Missing required field: info.version');
    }

    if (!this.spec.paths) {
      throw new Error('Missing required field: paths');
    }
  }

  /**
   * Convert specification to JSON string
   */
  public toJSON(pretty: boolean = false): string {
    if (!this.spec) {
      throw new Error('No specification loaded. Call load() first.');
    }
    return JSON.stringify(this.spec, null, pretty ? 2 : 0);
  }

  /**
   * Convert specification to YAML string
   */
  public toYAML(): string {
    if (!this.spec) {
      throw new Error('No specification loaded. Call load() first.');
    }
    return yaml.dump(this.spec);
  }

  /**
   * Check if the specification is loaded
   */
  public isLoaded(): boolean {
    return this.spec !== null;
  }
}

/**
 * Default export for convenience
 */
export default ApiSpec;

/**
 * Factory function to create and load an API specification
 */
export async function createApiSpec(config?: ApiSpecConfig): Promise<ApiSpec> {
  const apiSpec = new ApiSpec(config);
  await apiSpec.load();
  return apiSpec;
}

/**
 * Get package version
 */
export function getPackageVersion(): string {
  const packagePath = path.join(__dirname, '../../package.json');
  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    return packageJson.version || 'unknown';
  } catch {
    return 'unknown';
  }
}
