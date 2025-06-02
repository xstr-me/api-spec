# OpenAPI Code Generation Configuration

This document explains the enhanced OpenAPI code generation configuration implemented for Spring Boot integration.

## Overview

The project now generates both **Java Client** and **Spring Boot Server** code from the OpenAPI specification, providing a complete foundation for API development.

## Generated Artifacts

### 1. Java Client (`target/generated-sources/java-client/`)
- **Purpose**: HTTP client for consuming the XStr.me API
- **Generator**: `java` with `okhttp-gson` library
- **Package**: `me.xstr.api.client`
- **Features**:
  - OkHttp-based HTTP client
  - Gson JSON serialization
  - Jakarta EE annotations
  - Bean validation support
  - Java 8+ time API support

### 2. Spring Boot Server (`target/generated-sources/spring-server/`)
- **Purpose**: Server-side controllers and models for implementing the API
- **Generator**: `spring` with `spring-boot` library  
- **Package**: `me.xstr.api.server`
- **Features**:
  - Spring Boot 3.x compatibility
  - Controller interfaces and implementations
  - Delegate pattern for service implementation
  - Jakarta EE validation
  - SpringDoc OpenAPI integration
  - Bean validation support

## Generated Structure

### Client Structure
```
me.xstr.api.client/
├── api/
│   ├── HealthApi.java          # Health check API client
│   └── InfoApi.java            # Version info API client
├── model/
│   ├── ErrorResponse.java      # Error response model
│   ├── HealthResponse.java     # Health response model
│   └── VersionResponse.java    # Version response model
├── auth/                       # Authentication classes
└── ApiClient.java              # Main HTTP client
```

### Server Structure  
```
me.xstr.api.server/
├── controller/
│   ├── HealthApi.java              # Health API interface
│   ├── HealthApiController.java    # Health controller implementation
│   ├── HealthApiDelegate.java      # Health service delegate interface
│   ├── InfoApi.java                # Info API interface
│   ├── InfoApiController.java      # Info controller implementation
│   └── InfoApiDelegate.java        # Info service delegate interface
├── model/
│   ├── ErrorResponse.java          # Server-side error model
│   ├── HealthResponse.java         # Server-side health model
│   └── VersionResponse.java        # Server-side version model
├── config/                         # Spring configuration
└── OpenApiGeneratorApplication.java # Sample Spring Boot application
```

## Configuration Benefits

### 1. Separate Concerns
- **Client**: For external applications consuming the API
- **Server**: For implementing the API service

### 2. Spring Boot Integration
- Uses Spring Boot 3.x annotations and patterns
- Generates `@Controller` classes with proper routing
- Includes delegate interfaces for clean service implementation
- SpringDoc integration for API documentation

### 3. Interface-Based Design
- Controller interfaces define the API contract
- Delegate interfaces allow clean service implementation
- Separation of HTTP concerns from business logic

### 4. Modern Java Features
- Jakarta EE annotations (not legacy javax)
- Java 8+ time API support
- Bean validation annotations
- Optional support for cleaner code

## Usage Examples

### Client Usage
```java
ApiClient client = new ApiClient();
client.setBasePath("http://localhost:8080/v1");

HealthApi healthApi = new HealthApi(client);
HealthResponse health = healthApi.getHealth();
```

### Server Implementation
```java
@Service
public class HealthService implements HealthApiDelegate {
    @Override
    public ResponseEntity<HealthResponse> getHealth() {
        HealthResponse response = new HealthResponse()
            .status(HealthResponse.StatusEnum.UP)
            .timestamp(OffsetDateTime.now())
            .version("1.0.0");
        return ResponseEntity.ok(response);
    }
}
```

## Maven Configuration

The enhanced configuration includes two separate executions in the `openapi-generator-maven-plugin`:

1. **Java Client Generation** (`generate-java-client`)
2. **Spring Server Generation** (`generate-spring-server`)

Both generated source directories are automatically added to the compilation path via the `build-helper-maven-plugin`.

## Dependencies

### Required for Client
- Jackson (JSON processing)
- OkHttp (HTTP client)
- Gson (alternative JSON processing)

### Required for Server
- Spring Boot 3.x
- SpringDoc OpenAPI
- Jakarta validation
- Hibernate validator

All dependencies are included with `provided` scope, allowing consuming applications to choose their own versions.

## Build Commands

```bash
# Generate code only
mvn generate-sources

# Generate and compile
mvn compile

# Full build
mvn clean compile
```

## Next Steps

This configuration provides the foundation for:

1. **API Implementation**: Use the generated server interfaces to implement business logic
2. **Client SDKs**: Package the client code for distribution
3. **Documentation**: Auto-generated API docs via SpringDoc
4. **Testing**: Use generated models for API testing

The code generation is now optimized for Spring Boot development while maintaining compatibility with the existing Java client generation for external consumers.
