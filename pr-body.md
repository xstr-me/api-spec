## Summary

This PR implements comprehensive CI/CD pipeline improvements to fix Maven and npm publishing workflows as requested in issue #43. The implementation includes Maven Central publication setup, enhanced GitHub Actions workflows, security scanning integration, cross-platform testing, and coordinated release management.

## Changes

### Maven Configuration
- Added comprehensive release profile with Maven Central distribution management
- Integrated Nexus staging plugin for streamlined publishing
- Added GPG signing, source and Javadoc generation for Maven Central compliance
- Enhanced POM metadata with required licenses, developers, and SCM information

### GitHub Actions Workflows
- **`ci.yml`**: Enhanced with multi-matrix testing (Java 17/21, Node.js 18/20), security scanning, OpenAPI validation
- **`maven-publish.yml`**: Complete rewrite with validation, security checks, retry mechanisms, dry-run support
- **`npm-publish.yml`**: Complete rewrite with TypeScript regeneration, documentation generation, coordinated publishing
- **`release.yml`**: New coordinated release workflow with semantic versioning and rollback capabilities

### Workspace Management
- Created root `package.json` with npm workspaces configuration
- Added `scripts/sync-versions.js` for version synchronization across Maven and npm
- Added `.releaserc.json` for semantic release configuration
- Enhanced TypeScript package.json scripts for build, test, and documentation workflows

### Security & Validation
- Integrated OWASP dependency vulnerability scanning for Java dependencies
- Added npm audit integration for TypeScript dependencies
- Enhanced OpenAPI specification validation in CI pipeline
- Implemented secure token management for registry publishing

### Documentation
- Created comprehensive `CHANGELOG.md` documenting all pipeline improvements
- Enhanced TypeScript client documentation generation
- Added release notes automation with artifact links

## Testing

- Successfully validated Maven configuration with `mvn validate` (BUILD SUCCESS)
- Verified all workflow files exist and have correct YAML syntax
- Tested workspace configuration and version synchronization utilities

## Breaking Changes

None. This is purely an enhancement to the CI/CD infrastructure without breaking existing functionality.

## Closes

Closes #43
