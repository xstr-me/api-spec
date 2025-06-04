# Spring Server Configuration Fix

## Summary

Fixed the OpenAPI Generator Spring server configuration to prevent duplicate file generation in the Maven `target/` directory.

## Problem

The OpenAPI Generator was creating Java source files in both:
- `src/main/java/` (correct location)
- `target/` directory (unwanted location)

This violated Maven conventions where the `target/` directory should only contain compiled artifacts, not source code.

## Solution

### Changes Made

1. **Added `sourceFolder` property** to `spring-server.json`:
   ```json
   "additionalProperties": {
     "sourceFolder": "src/main/java",
     // ... other properties
   }
   ```

2. **Fixed JSON formatting** issues in the configuration file

3. **Updated `outputDir`** to use proper path format (`"./"` instead of `"."`)

### Configuration Details

- **File**: `openapi-generator-config/spring-server.json`
- **Generator**: `spring` with `spring-boot` library
- **Source Folder**: Explicitly set to `src/main/java`
- **Output Directory**: Project root (`./`)

## Results

✅ **Before Fix**:
- 13 Java files in `src/main/java/` (correct)
- Java source files also generated in `target/` (incorrect)

✅ **After Fix**:
- 13 Java files in `src/main/java/` (correct)
- 0 Java source files in `target/` (correct)
- Only compiled `.class` files in `target/` (as expected)

## Testing

Verified with commands:
```powershell
npm run generate:java
mvn clean
```

## Impact

- ✅ Proper Maven directory structure compliance
- ✅ No unwanted source files in build output directory
- ✅ Clean separation between source and compiled artifacts
- ✅ Maintains all Spring Boot generation functionality

## Commit

- **Commit**: `5171efa`
- **Branch**: `feat/ISSUE-45-npm-workspace-integration`
- **Message**: "fix: prevent Spring generator duplicate file creation in target directory"

## Related

- Issue #45: NPM workspace integration improvements
- Spring Boot code generation configuration
- Maven directory structure standards
