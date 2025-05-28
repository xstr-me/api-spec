<?php

declare(strict_types=1);

namespace XstrMe\ApiSpec;

use Symfony\Component\Yaml\Yaml;
use InvalidArgumentException;
use RuntimeException;

/**
 * Utility class for accessing the XStr.me API specification in PHP applications.
 * 
 * This class provides convenient methods to load and access the OpenAPI
 * specification that is bundled with this package.
 * 
 * @package XstrMe\ApiSpec
 * @version 1.0.0
 */
final class ApiSpec
{
    private const API_SPEC_PATH = __DIR__ . '/../api-spec.yml';
    
    private static ?array $cachedSpec = null;
    private static ?string $cachedYaml = null;
    
    /**
     * Get the API specification as a PHP array.
     * 
     * @return array The parsed API specification
     * @throws RuntimeException if the API specification cannot be found or parsed
     */
    public static function getApiSpecAsArray(): array
    {
        if (self::$cachedSpec === null) {
            self::$cachedSpec = self::loadAndParseSpec();
        }
        
        return self::$cachedSpec;
    }
    
    /**
     * Get the API specification as YAML string.
     * 
     * @return string The API specification YAML content
     * @throws RuntimeException if the API specification cannot be found
     */
    public static function getApiSpecAsYaml(): string
    {
        if (self::$cachedYaml === null) {
            if (!file_exists(self::API_SPEC_PATH)) {
                throw new RuntimeException(
                    sprintf('API specification not found at: %s', self::API_SPEC_PATH)
                );
            }
            
            $content = file_get_contents(self::API_SPEC_PATH);
            if ($content === false) {
                throw new RuntimeException(
                    sprintf('Failed to read API specification from: %s', self::API_SPEC_PATH)
                );
            }
            
            self::$cachedYaml = $content;
        }
        
        return self::$cachedYaml;
    }
    
    /**
     * Get the API specification as JSON string.
     * 
     * @param int $flags JSON encoding flags
     * @return string The API specification as JSON
     * @throws RuntimeException if the API specification cannot be converted to JSON
     */
    public static function getApiSpecAsJson(int $flags = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES): string
    {
        $spec = self::getApiSpecAsArray();
        
        $json = json_encode($spec, $flags);
        if ($json === false) {
            throw new RuntimeException('Failed to encode API specification as JSON: ' . json_last_error_msg());
        }
        
        return $json;
    }
    
    /**
     * Get the version of the API specification.
     * 
     * @return string API specification version
     */
    public static function getVersion(): string
    {
        $spec = self::getApiSpecAsArray();
        return $spec['info']['version'] ?? '1.0.0';
    }
    
    /**
     * Get the title of the API specification.
     * 
     * @return string API specification title
     */
    public static function getTitle(): string
    {
        $spec = self::getApiSpecAsArray();
        return $spec['info']['title'] ?? 'XStr.me API';
    }
    
    /**
     * Get all available paths from the API specification.
     * 
     * @return array List of API paths
     */
    public static function getPaths(): array
    {
        $spec = self::getApiSpecAsArray();
        return array_keys($spec['paths'] ?? []);
    }
    
    /**
     * Get all available servers from the API specification.
     * 
     * @return array List of API servers
     */
    public static function getServers(): array
    {
        $spec = self::getApiSpecAsArray();
        return $spec['servers'] ?? [];
    }
    
    /**
     * Check if the API specification file is available.
     * 
     * @return bool true if the API specification is available, false otherwise
     */
    public static function isAvailable(): bool
    {
        return file_exists(self::API_SPEC_PATH) && is_readable(self::API_SPEC_PATH);
    }
    
    /**
     * Get a specific path definition from the API specification.
     * 
     * @param string $path The API path (e.g., '/health')
     * @return array|null The path definition or null if not found
     */
    public static function getPathDefinition(string $path): ?array
    {
        $spec = self::getApiSpecAsArray();
        return $spec['paths'][$path] ?? null;
    }
    
    /**
     * Get all schema definitions from the API specification.
     * 
     * @return array All schema definitions
     */
    public static function getSchemas(): array
    {
        $spec = self::getApiSpecAsArray();
        return $spec['components']['schemas'] ?? [];
    }
    
    /**
     * Get a specific schema definition.
     * 
     * @param string $schemaName The name of the schema
     * @return array|null The schema definition or null if not found
     */
    public static function getSchema(string $schemaName): ?array
    {
        $schemas = self::getSchemas();
        return $schemas[$schemaName] ?? null;
    }
    
    /**
     * Clear the internal cache.
     * 
     * @return void
     */
    public static function clearCache(): void
    {
        self::$cachedSpec = null;
        self::$cachedYaml = null;
    }
    
    /**
     * Load and parse the API specification file.
     * 
     * @return array The parsed API specification
     * @throws RuntimeException if the file cannot be found or parsed
     */
    private static function loadAndParseSpec(): array
    {
        if (!file_exists(self::API_SPEC_PATH)) {
            throw new RuntimeException(
                sprintf('API specification not found at: %s', self::API_SPEC_PATH)
            );
        }
        
        try {
            $content = file_get_contents(self::API_SPEC_PATH);
            if ($content === false) {
                throw new RuntimeException(
                    sprintf('Failed to read API specification from: %s', self::API_SPEC_PATH)
                );
            }
            
            $parsed = Yaml::parse($content);
            if (!is_array($parsed)) {
                throw new RuntimeException('Invalid YAML content in API specification');
            }
            
            return $parsed;
        } catch (\Exception $e) {
            throw new RuntimeException(
                sprintf('Failed to parse API specification: %s', $e->getMessage()),
                0,
                $e
            );
        }
    }
}
