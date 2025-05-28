# XStr.me API Specification

This repository contains the OpenAPI specification for XStr.me services, distributed as Maven, NPM, Composer, and PyPI packages.

## Overview

The API specification is available in multiple formats and can be consumed through:
- **Maven Central**: `me.xstr:api-spec:1.0.0`
- **NPM**: `@xstr-me/api-spec@1.0.0`
- **Packagist**: `xstr-me/api-spec:^1.0`
- **PyPI**: `xstr-me-api-spec==1.0.0`

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

### Python/PyPI

```bash
pip install xstr-me-api-spec
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

#### In Python/PyPI projects:
```python
from xstr_me_api_spec import ApiSpec

# Get the specification as dictionary
spec = ApiSpec.get_api_spec_as_dict()

# Get as YAML string
yaml_content = ApiSpec.get_api_spec_as_yaml()

# Get as JSON string
json_content = ApiSpec.get_api_spec_as_json()

# Get specific information
version = ApiSpec.get_api_version()
title = ApiSpec.get_api_title()
description = ApiSpec.get_api_description()
servers = ApiSpec.get_servers()
paths = ApiSpec.get_paths()

# Get formatted JSON with indentation
formatted_json = ApiSpec.get_api_spec_as_json(indent=2)
```

## Development

### Prerequisites

- **Java 11+** (for Maven publishing)
- **Node.js 14+** (for NPM publishing)
- **PHP 8.1+** (for Composer publishing)
- **Python 3.8+** (for PyPI publishing)
- **Maven 3.6+**
- **NPM 6+**
- **Composer 2.0+**
- **pip 21.0+**

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

4. Install Python dependencies:
```bash
pip install -r requirements-dev.txt
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

#### Python validation and testing:
```bash
# Install dependencies
pip install -r requirements-dev.txt

# Run tests
python -m pytest

# Run tests with coverage
python -m pytest --cov=xstr_me_api_spec --cov-report=term-missing

# Type checking with MyPy
python -m mypy src/python/xstr_me_api_spec

# Code formatting with Black
python -m black src/python/ tests/python/

# Linting with Flake8
python -m flake8 src/python/ tests/python/

# Build package
python -m build

# Run all Python checks
python -m pytest && python -m mypy src/python/xstr_me_api_spec && python -m flake8 src/python/ tests/python/
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

4. **PyPI Requirements**:
   - PyPI account
   - API token configured
   - Login with `twine` or configure credentials

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

#### PyPI Publishing

1. Build the package:
```bash
python -m build
```

2. Upload to PyPI:
```bash
# Upload to test PyPI first
python -m twine upload --repository testpypi dist/*

# Upload to production PyPI
python -m twine upload dist/*
```

#### Combined Publishing

Use the convenience script:
```bash
npm run publish-maven && npm publish
# For PHP, just push tags - Packagist auto-updates
# For Python: python -m build && python -m twine upload dist/*
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
├── pyproject.toml        # Python packaging configuration
├── requirements.txt      # Python runtime dependencies
├── requirements-dev.txt  # Python development dependencies
├── pytest.ini           # Python test configuration
├── README.md             # This file
├── LICENSE               # MIT license
├── src/                  # Source code
│   ├── ApiSpec.php       # PHP utility class
│   ├── python/           # Python package
│   │   └── xstr_me_api_spec/
│   │       ├── __init__.py
│   │       ├── api_spec.py
│   │       └── api-spec.yml
│   ├── Symfony/          # Symfony integration
│   └── main/java/        # Java source code
├── tests/                # Tests
│   ├── ApiSpecTest.php   # PHP tests
│   ├── python/           # Python tests
│   │   ├── __init__.py
│   │   └── test_api_spec.py
│   └── Symfony/          # Symfony tests
├── bin/                  # PHP command-line tools
├── .github/
│   └── workflows/
│       ├── maven-publish.yml    # Maven publishing workflow
│       ├── npm-publish.yml      # NPM publishing workflow
│       ├── php-ci.yml           # PHP CI and Packagist workflow
│       └── python-ci.yml        # Python CI and PyPI workflow
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
- **NEW: Python/PyPI distribution support with comprehensive API access**
- Automated publishing workflows for all four platforms

## Contributors

This project is maintained by the XStr.me team.
