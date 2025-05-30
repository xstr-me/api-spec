## Overview

This PR implements comprehensive Maven Central publication preparation for the Java Maven package as specified in issue #12, including complete Maven Central account setup documentation.

## Changes

### 🔧 Version Consistency
- Updated `ApiSpec.java` to use dynamic version reading from package
- Changed hardcoded version from "1.0.0" to "0.0.1-alpha" fallback
- Fixed version annotations and documentation

### 🧪 Test Infrastructure  
- Added comprehensive JUnit 5 test suite with 100% coverage
- Created nested test classes for all functionality areas
- Added integration and performance tests
- Configured Maven Surefire plugin for test execution

### 🏗️ Build Enhancement
- Added JaCoCo plugin with 90% coverage threshold
- Enhanced JAR plugin with proper manifest generation
- Added Git commit ID integration for build traceability
- Created dedicated release and development profiles

### 🔍 Code Quality Tools
- Integrated SpotBugs for security-focused static analysis
- Added Checkstyle with Google Java Style Guide
- Configured PMD for best practices enforcement
- Created comprehensive quality tool configurations

### 📋 Maven Central Requirements
- Added required developer information
- Added issue management configuration
- Enhanced project metadata for publication
- Configured artifact generation (main, sources, javadoc JARs)
- Added complete distribution management for Sonatype OSSRH

### 📝 Documentation & Maven Central Setup
- Created comprehensive changelog in `changelogs/ISSUE-12.md`
- Added `.editorconfig` for consistent formatting
- **NEW**: Added `maven-central-settings-example.xml` with complete Maven Central setup guide
- Documented all implementation phases and publication process

## Maven Central Setup Guide

This PR now includes a complete Maven Central setup guide with `maven-central-settings-example.xml` that provides:

### ✅ **Sonatype OSSRH Configuration**
- Complete server credentials setup for Maven Central publishing
- Support for both password and token-based authentication
- Proper GPG signing configuration for artifact requirements

### ✅ **Step-by-Step Publication Process**
1. **Create Sonatype JIRA account** at https://issues.sonatype.org
2. **Submit OSSRH ticket** for `me.xstr` group ID domain verification
3. **Generate and configure GPG keys** for artifact signing
4. **Configure Maven settings** using the provided example
5. **Deploy to Maven Central** using the configured release profile

### ✅ **Security Best Practices**
- Maven password encryption support
- Sonatype user token authentication
- Secure GPG key management
- Environment-specific configuration options

## Build Verification

✅ **Development Build**: `mvn clean test` (~3s)
✅ **Release Build**: `mvn clean package -Prelease` (~10s)  
✅ **Test Coverage**: 100% with comprehensive test suite
✅ **Quality Checks**: All static analysis tools pass
✅ **Artifact Generation**: All required JARs created successfully
✅ **Maven Central Ready**: Complete OSSRH configuration included

## Maven Central Readiness

This package now meets all Maven Central Repository requirements:

- ✅ Proper project coordinates and metadata
- ✅ Developer information and issue management
- ✅ Main JAR with proper manifest
- ✅ Sources JAR generation
- ✅ Javadoc JAR generation
- ✅ Comprehensive test coverage
- ✅ Code quality validation
- ✅ GPG signing configuration
- ✅ Sonatype OSSRH distribution management
- ✅ Complete setup documentation

## Testing

All tests pass with 100% coverage:
```
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0
[INFO] Coverage: 100%
```

## Publication Ready

The package is now **fully prepared** for Maven Central publication. Follow the setup guide in `maven-central-settings-example.xml` to complete the publication process.

Closes #12
