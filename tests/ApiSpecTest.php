<?php

declare(strict_types=1);

namespace XstrMe\ApiSpec\Tests;

use PHPUnit\Framework\TestCase;
use XstrMe\ApiSpec\ApiSpec;
use RuntimeException;

/**
 * Test cases for the ApiSpec class.
 */
class ApiSpecTest extends TestCase
{
    protected function setUp(): void
    {
        // Clear cache before each test
        ApiSpec::clearCache();
    }
    
    public function testApiSpecIsAvailable(): void
    {
        $this->assertTrue(ApiSpec::isAvailable(), 'API specification should be available');
    }
    
    public function testGetApiSpecAsArray(): void
    {
        $spec = ApiSpec::getApiSpecAsArray();
        
        $this->assertIsArray($spec);
        $this->assertArrayHasKey('openapi', $spec);
        $this->assertArrayHasKey('info', $spec);
        $this->assertArrayHasKey('paths', $spec);
        $this->assertEquals('3.0.3', $spec['openapi']);
    }
    
    public function testGetApiSpecAsYaml(): void
    {
        $yaml = ApiSpec::getApiSpecAsYaml();
        
        $this->assertIsString($yaml);
        $this->assertStringContainsString('openapi: 3.0.3', $yaml);
        $this->assertStringContainsString('title: XStr.me API', $yaml);
    }
    
    public function testGetApiSpecAsJson(): void
    {
        $json = ApiSpec::getApiSpecAsJson();
        
        $this->assertIsString($json);
        $this->assertJson($json);
        
        $decoded = json_decode($json, true);
        $this->assertIsArray($decoded);
        $this->assertEquals('3.0.3', $decoded['openapi']);
    }
    
    public function testGetVersion(): void
    {
        $version = ApiSpec::getVersion();
        
        $this->assertIsString($version);
        $this->assertEquals('1.0.0', $version);
    }
    
    public function testGetTitle(): void
    {
        $title = ApiSpec::getTitle();
        
        $this->assertIsString($title);
        $this->assertEquals('XStr.me API', $title);
    }
    
    public function testGetPaths(): void
    {
        $paths = ApiSpec::getPaths();
        
        $this->assertIsArray($paths);
        $this->assertContains('/health', $paths);
        $this->assertContains('/version', $paths);
    }
    
    public function testGetServers(): void
    {
        $servers = ApiSpec::getServers();
        
        $this->assertIsArray($servers);
        $this->assertNotEmpty($servers);
        
        foreach ($servers as $server) {
            $this->assertArrayHasKey('url', $server);
            $this->assertArrayHasKey('description', $server);
        }
    }
    
    public function testGetPathDefinition(): void
    {
        $healthPath = ApiSpec::getPathDefinition('/health');
        
        $this->assertIsArray($healthPath);
        $this->assertArrayHasKey('get', $healthPath);
        
        $nonExistentPath = ApiSpec::getPathDefinition('/non-existent');
        $this->assertNull($nonExistentPath);
    }
    
    public function testGetSchemas(): void
    {
        $schemas = ApiSpec::getSchemas();
        
        $this->assertIsArray($schemas);
        $this->assertArrayHasKey('HealthResponse', $schemas);
        $this->assertArrayHasKey('VersionResponse', $schemas);
        $this->assertArrayHasKey('ErrorResponse', $schemas);
    }
    
    public function testGetSchema(): void
    {
        $healthSchema = ApiSpec::getSchema('HealthResponse');
        
        $this->assertIsArray($healthSchema);
        $this->assertArrayHasKey('type', $healthSchema);
        $this->assertEquals('object', $healthSchema['type']);
        
        $nonExistentSchema = ApiSpec::getSchema('NonExistentSchema');
        $this->assertNull($nonExistentSchema);
    }
    
    public function testCacheIsWorking(): void
    {
        // First call should load from file
        $spec1 = ApiSpec::getApiSpecAsArray();
        
        // Second call should use cache
        $spec2 = ApiSpec::getApiSpecAsArray();
        
        $this->assertEquals($spec1, $spec2);
        
        // Clear cache and verify it's cleared
        ApiSpec::clearCache();
        $spec3 = ApiSpec::getApiSpecAsArray();
        
        $this->assertEquals($spec1, $spec3);
    }
    
    public function testGetApiSpecAsJsonWithCustomFlags(): void
    {
        $json = ApiSpec::getApiSpecAsJson(JSON_COMPACT_MACHINE);
        
        $this->assertIsString($json);
        $this->assertJson($json);
        // Should not contain pretty printing (no extra spaces/newlines)
        $this->assertStringNotContainsString('  ', $json);
    }
}
