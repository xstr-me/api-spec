<?php

declare(strict_types=1);

/*
 * This file is used to validate the OpenAPI specification using PHP.
 * Run with: php bin/validate-spec.php
 */

require_once __DIR__ . '/../vendor/autoload.php';

use XstrMe\ApiSpec\ApiSpec;
use cebe\openapi\Reader;
use cebe\openapi\spec\OpenApi;

echo "🔍 Validating XStr.me API Specification...\n\n";

try {
    // Check if API spec is available
    if (!ApiSpec::isAvailable()) {
        echo "❌ Error: API specification file not found!\n";
        exit(1);
    }
    
    echo "✅ API specification file found\n";
    
    // Load and parse the specification
    $yamlContent = ApiSpec::getApiSpecAsYaml();
    $specArray = ApiSpec::getApiSpecAsArray();
    
    echo "✅ YAML parsing successful\n";
    echo "✅ Array conversion successful\n";
    
    // Validate with cebe/openapi
    $openApi = Reader::readFromYaml($yamlContent);
    
    if (!($openApi instanceof OpenApi)) {
        echo "❌ Error: Invalid OpenAPI specification format\n";
        exit(1);
    }
    
    echo "✅ OpenAPI 3.0 format validation successful\n";
    
    // Basic content validation
    $version = ApiSpec::getVersion();
    $title = ApiSpec::getTitle();
    $paths = ApiSpec::getPaths();
    $servers = ApiSpec::getServers();
    $schemas = ApiSpec::getSchemas();
    
    echo "\n📋 Specification Details:\n";
    echo "   Title: {$title}\n";
    echo "   Version: {$version}\n";
    echo "   OpenAPI Version: {$specArray['openapi']}\n";
    echo "   Paths: " . count($paths) . " endpoint(s)\n";
    echo "   Servers: " . count($servers) . " server(s)\n";
    echo "   Schemas: " . count($schemas) . " schema(s)\n";
    
    echo "\n🔗 Available Endpoints:\n";
    foreach ($paths as $path) {
        $pathDef = ApiSpec::getPathDefinition($path);
        $methods = array_keys($pathDef);
        echo "   {$path} [" . implode(', ', array_map('strtoupper', $methods)) . "]\n";
    }
    
    echo "\n🌐 Available Servers:\n";
    foreach ($servers as $server) {
        echo "   {$server['url']} - {$server['description']}\n";
    }
    
    echo "\n📊 Available Schemas:\n";
    foreach (array_keys($schemas) as $schemaName) {
        echo "   {$schemaName}\n";
    }
    
    // Test JSON conversion
    $jsonContent = ApiSpec::getApiSpecAsJson();
    if (json_decode($jsonContent) === null) {
        echo "\n❌ Error: JSON conversion failed\n";
        exit(1);
    }
    
    echo "\n✅ JSON conversion successful\n";
    
    echo "\n🎉 All validations passed! The API specification is valid and ready to use.\n";
    
} catch (Exception $e) {
    echo "\n❌ Validation failed: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
