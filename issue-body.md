## Description

Implement comprehensive Java client code generation from the existing OpenAPI specification (`api-spec.yml`) using Maven OpenAPI Generator plugin. This will enable automatic generation of type-safe Java client libraries that can be used by Java applications to interact with the XStr.me API.

## Requirements

### Core Features
- [x] Maven OpenAPI Generator plugin integration
- [x] Java client library generation with OkHttp + Gson stack
- [x] Type-safe API client classes for all endpoints
- [x] Model classes for all request/response objects
- [x] Comprehensive error handling and HTTP status management
- [x] Configuration management for client setup
- [x] Bean validation support for model objects

### Technical Specifications
- **OpenAPI Generator Version**: 7.1.0+
- **Java Version**: Java 8+ compatibility
- **HTTP Client**: OkHttp 4.x
- **JSON Processing**: Gson + Jackson for comprehensive support
- **Build Tool**: Maven integration
- **Package Structure**: `me.xstr.api.client.*`

### Generated Components Required
1. **API Client Classes**:
   - `HealthApi.java` - Health check endpoints
   - `InfoApi.java` - Version and info endpoints
   - `ApiClient.java` - Main HTTP client configuration
   - `Configuration.java` - Client configuration management

2. **Model Classes**:
   - `HealthResponse.java` - Health check response model
   - `VersionResponse.java` - Version info response model
   - `ErrorResponse.java` - Error response model
   - Proper enum support for status values

## Acceptance Criteria

### Build & Generation
- [x] Maven plugin successfully generates Java client code on `mvn generate-sources`
- [x] Generated code compiles without errors
- [x] All API endpoints from OpenAPI spec are represented as Java methods
- [x] Generated models match OpenAPI schema definitions exactly

### Code Quality
- [x] Generated code follows Java naming conventions
- [x] Proper JavaDoc documentation for all public methods
- [x] Type safety for all API calls and responses
- [x] Comprehensive error handling with proper HTTP status mapping

### Integration
- [x] Generated code integrates seamlessly with Maven build lifecycle
- [x] VS Code tasks created for easy code generation
- [x] Example usage code demonstrates real-world usage patterns
- [x] Test code verifies generated client functionality

## Expected Outcome

After implementation, developers will be able to:
1. Run `mvn generate-sources` to generate latest Java client
2. Use type-safe Java classes to interact with XStr.me API
3. Integrate generated client into Java applications seamlessly
4. Benefit from automatic updates when API specification changes
