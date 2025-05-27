# XStr.me API Specification

This repository contains the OpenAPI specification for XStr.me services, distributed as both Maven and NPM packages.

## Overview

The API specification is available in multiple formats and can be consumed through:
- **Maven Central**: `me.xstr:api-spec:1.0.0`
- **NPM**: `@xstr-me/api-spec@1.0.0`

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

## Development

### Prerequisites

- **Java 11+** (for Maven publishing)
- **Node.js 14+** (for NPM publishing)
- **Maven 3.6+**
- **NPM 6+**

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

### Publishing

#### Prerequisites for Publishing

1. **Maven Central Requirements**:
   - GPG key for signing artifacts
   - Sonatype OSSRH account
   - Configure `~/.m2/settings.xml` with credentials

2. **NPM Requirements**:
   - NPM account with access to `@xstr-me` organization
   - Login with `npm login`

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

#### Combined Publishing

Use the convenience script:
```bash
npm run publish-maven && npm publish
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
├── README.md             # This file
├── LICENSE               # MIT license
├── .github/
│   └── workflows/
│       ├── maven-publish.yml    # Maven publishing workflow
│       └── npm-publish.yml      # NPM publishing workflow
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
- Automated publishing workflows

## Contributors

This project is maintained by the XStr.me team.
