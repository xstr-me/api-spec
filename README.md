# XStr.me API Specification

This repository contains the OpenAPI specification for XStr.me services, distributed as Maven, NPM, and Composer packages.

## Overview

The API specification is available in multiple formats and can be consumed through:
- **Maven Central**: `me.xstr:api-spec:1.0.0`
- **NPM**: `@xstr-me/api-spec@1.0.0`
- **Packagist**: `xstr-me/api-spec:^1.0`

## Installation

### Maven

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>me.xstr</groupId>
    <artifactId>api-spec</artifactId>
    <version>1.0.0</version>
</dependency>
```

### NPM

```bash
npm install @xstr-me/api-spec
```

### Yarn

```bash
yarn add @xstr-me/api-spec
```

### Composer

```bash
composer require xstr-me/api-spec
```

## Usage

### Accessing the Specification

#### In Java/Maven projects:
```java
// Load from classpath
InputStream apiSpec = getClass().getResourceAsStream("/api-spec.yml");
```

#### In Node.js/NPM projects:
```javascript
const fs = require('fs');
const path = require('path');

// Load the API spec
const apiSpecPath = require.resolve('@xstr-me/api-spec/api-spec.yml');
const apiSpec = fs.readFileSync(apiSpecPath, 'utf8');
```

#### Direct file access:
```javascript
const apiSpec = require('@xstr-me/api-spec');
// The main field points to api-spec.yml
```

#### In PHP/Composer projects:
```php
use XstrMe\ApiSpec\ApiSpec;

// Get the specification as array
$spec = ApiSpec::getApiSpecAsArray();

// Get as YAML string
$yaml = ApiSpec::getApiSpecAsYaml();

// Get as JSON string
$json = ApiSpec::getApiSpecAsJson();

// Get specific information
$version = ApiSpec::getVersion();
$title = ApiSpec::getTitle();
$paths = ApiSpec::getPaths();
$servers = ApiSpec::getServers();

// Get schema definitions
$schemas = ApiSpec::getSchemas();
$healthSchema = ApiSpec::getSchema('HealthResponse');
```

#### Symfony Integration:
```php
// Register the bundle in config/bundles.php
XstrMe\ApiSpec\Symfony\XstrMeApiSpecBundle::class => ['all' => true],

// In your controller or service
public function __construct(
    private ApiSpec $apiSpec
) {}

public function getApiInfo(): array
{
    return [
        'title' => $this->apiSpec->getTitle(),
        'version' => $this->apiSpec->getVersion(),
        'paths' => $this->apiSpec->getPaths(),
    ];
}
```

## Development

### Prerequisites

- **Java 11+** (for Maven publishing)
- **Node.js 14+** (for NPM publishing)
- **PHP 8.1+** (for Composer publishing)
- **Maven 3.6+**
- **NPM 6+**
- **Composer 2.0+**

### Setup

1. Clone the repository:
```bash
git clone https://github.com/xstr-me/api-spec.git
cd api-spec
```

2. Install NPM dependencies:
```bash
npm install
```

3. Install PHP dependencies:
```bash
composer install
```

### Validation and Testing

#### Validate OpenAPI specification:
```bash
npm run validate
```

#### Lint the specification:
```bash
npm run lint
```

#### Run all tests:
```bash
npm test
```

#### Generate documentation:
```bash
npm run generate-docs
```

#### PHP validation and testing:
```bash
# Install dependencies
composer install

# Validate API specification
composer run-script validate-spec

# Run PHPStan analysis
composer run-script analyse

# Run PHPUnit tests
composer run-script test

# Run all PHP checks
composer run-script all
```

### Publishing

#### Prerequisites for Publishing

1. **Maven Central Requirements**:
   - GPG key for signing artifacts
   - Sonatype OSSRH account
   - Configure `~/.m2/settings.xml` with credentials

2. **NPM Requirements**:
   - NPM account with access to `@xstr-me` organization
   - Login with `npm login`

3. **Packagist Requirements**:
   - Packagist account
   - Repository webhook configured
   - Package submitted to Packagist

#### Maven Central Publishing

1. Configure your `~/.m2/settings.xml`:
```xml
<settings>
  <servers>
    <server>
      <id>ossrh</id>
      <username>your-sonatype-username</username>
      <password>your-sonatype-password</password>
    </server>
  </servers>
</settings>
```

2. Deploy to Maven Central:
```bash
mvn clean deploy
```

#### NPM Publishing

1. Login to NPM:
```bash
npm login
```

2. Publish to NPM:
```bash
npm publish
```

#### Packagist Publishing

Packagist automatically updates when you push tags to GitHub (if webhook is configured):

1. Create and push a tag:
```bash
git tag v1.1.0
git push origin v1.1.0
```

2. Manual trigger (if needed):
```bash
# Packagist will auto-update via webhook
# Or manually trigger update on Packagist website
```

#### Combined Publishing

Use the convenience script:
```bash
npm run publish-maven && npm publish
# For PHP, just push tags - Packagist auto-updates
```

## API Documentation

The API specification includes:

- **Health endpoints**: Service health checks
- **Version endpoints**: API version information
- **Authentication**: JWT Bearer token support
- **Error handling**: Standardized error responses

### Key Endpoints

- `GET /health` - Health check
- `GET /version` - API version information

## Directory Structure

```
├── api-spec.yml           # Main OpenAPI specification
├── pom.xml               # Maven configuration
├── package.json          # NPM configuration
├── composer.json         # PHP/Composer configuration
├── README.md             # This file
├── LICENSE               # MIT license
├── src/                  # Source code
│   ├── ApiSpec.php       # PHP utility class
│   ├── Symfony/          # Symfony integration
│   └── main/java/        # Java source code
├── tests/                # PHP tests
├── bin/                  # PHP command-line tools
├── .github/
│   └── workflows/
│       ├── maven-publish.yml    # Maven publishing workflow
│       ├── npm-publish.yml      # NPM publishing workflow
│       └── php-ci.yml           # PHP CI and Packagist workflow
└── docs/                 # Generated documentation
    └── index.html        # ReDoc documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes to `api-spec.yml`
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release with basic health and version endpoints
- Maven Central and NPM distribution support
- **NEW: PHP/Composer distribution support with Symfony integration**
- Automated publishing workflows for all three platforms

## Contributors

This project is maintained by the XStr.me team.
