# OpenAPI Code Generation Configuration

This document explains the OpenAPI code generation configuration for Spring Boot server development.

## Overview

The project generates **Spring Boot Server** code from the OpenAPI specification, providing a complete foundation for API implementation with modern Spring Boot 3.x features.

## Configuration Approach

The project uses inline configuration in the Maven POM file for optimal compatibility with OpenAPI Generator 7.1.0.

> **Current Implementation**: The configuration is implemented inline in `pom.xml` for 
> maximum compatibility and reliability. All configuration options are centralized in the Maven plugin configuration.

### Benefits of This Approach

1. **Reliability**: Inline configuration eliminates external file dependency issues
2. **Maintainability**: All configuration is in one central location (pom.xml)
3. **Compatibility**: Works consistently across different OpenAPI Generator versions
4. **Simplicity**: No external configuration files to maintain or synchronize

## Generated Artifacts

### Spring Boot Server (`target/generated-sources/src/main/java/`)
- **Purpose**: Server-side controllers and models for implementing the API
- **Generator**: `spring` with `spring-boot` library  
- **Base Package**: `me.xstr.api`
- **Features**:
  - Spring Boot 3.x compatibility
  - Controller interfaces and implementations  
  - Delegate pattern for service implementation
  - Jakarta EE validation annotations
  - SpringDoc OpenAPI integration
  - Bean validation support
  - Modern Java 17+ features

## Package Structure

The generated code follows a clean package structure optimized for Spring Boot development:

### Generated Structure
```
me.xstr.api/
├── controller/
│   ├── ApiUtil.java               # API utilities
│   ├── HealthApi.java             # Health API interface
│   ├── HealthApiController.java   # Health controller implementation
│   ├── HealthApiDelegate.java     # Health service delegate interface
│   ├── InfoApi.java               # Info API interface
│   ├── InfoApiController.java     # Info controller implementation
│   └── InfoApiDelegate.java       # Info service delegate interface
├── model/
│   ├── ErrorResponse.java         # Error response model
│   ├── HealthResponse.java        # Health response model
│   └── VersionResponse.java       # Version response model
├── OpenApiGeneratorApplication.java # Sample Spring Boot application
└── RFC3339DateFormat.java         # Date formatting utilities
```

## Configuration Benefits

### 1. Focused Architecture
- **Single Purpose**: Optimized exclusively for Spring Boot server development
- **Clean Structure**: No client-specific dependencies or configurations

### 2. Spring Boot Integration
- Uses Spring Boot 3.x annotations and patterns
- Generates `@Controller` classes with proper routing
- Includes delegate interfaces for clean service implementation
- SpringDoc integration for automatic API documentation

### 3. Interface-Based Design
- Controller interfaces define the API contract
- Delegate interfaces allow clean service implementation
- Separation of HTTP concerns from business logic

### 4. Modern Java Features
- Jakarta EE annotations (not legacy javax)
- Java 17+ language features
- Bean validation annotations
- Optional support for cleaner code

## Usage Examples

### Service Implementation
```java
@Service
public class HealthService implements HealthApiDelegate {
    @Override
    public ResponseEntity<HealthResponse> getHealth() {
        HealthResponse response = new HealthResponse()            .status(HealthResponse.StatusEnum.UP)
            .timestamp(OffsetDateTime.now())
            .version("0.0.1-alpha");
        return ResponseEntity.ok(response);
    }
}
```

### Spring Boot Application
```java
@SpringBootApplication
public class XstrApplication {
    public static void main(String[] args) {
        SpringApplication.run(XstrApplication.class, args);
    }
}
```

## Maven Configuration

The configuration uses a single execution in the `openapi-generator-maven-plugin`:

- **Spring Server Generation** (`generate-spring-server`)

The generated source directory is automatically added to the compilation path via the `build-helper-maven-plugin`.

## Dependencies

### Required Dependencies
- Spring Boot 3.x (Web & Validation starters)
- SpringDoc OpenAPI (automatic documentation)
- Jakarta validation APIs
- Jackson (JSON processing)

All dependencies are included with appropriate scope management in the Maven POM.

## Build Commands

```bash
# Generate Spring Boot server code only
mvn generate-sources

# Generate and compile
mvn compile

# Full build with tests
mvn clean compile test

# Package the generated sources
mvn clean package
```

## Next Steps

This single-project configuration provides the foundation for:

1. **API Implementation**: Use the generated server interfaces to implement business logic
2. **Spring Boot Integration**: Leverage automatic configuration and dependency injection
3. **Documentation**: Auto-generated API docs via SpringDoc at `/swagger-ui.html`
4. **Testing**: Use generated models for comprehensive API testing

The code generation is now streamlined and optimized exclusively for Spring Boot server development, providing a clean and maintainable foundation for API implementation.
