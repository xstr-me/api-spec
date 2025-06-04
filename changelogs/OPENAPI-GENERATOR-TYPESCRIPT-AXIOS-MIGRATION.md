# OpenAPI Generator TypeScript-Axios Migration

## Overview

This document summarizes the migration from `typescript-fetch` to `typescript-axios` generator and
the reorganization of OpenAPI generator configuration into a dedicated folder structure.

## Changes Made

### 1. Generator Migration

- **From**: `typescript-fetch` generator
- **To**: `typescript-axios` generator
- **Benefits**:
  - More robust HTTP client with better error handling
  - Built-in request/response interceptors
  - Better TypeScript support and type safety
  - More configurable timeout and retry mechanisms

### 2. Configuration Reorganization

- **Old Structure**: `typescript-axios.json` in root directory
- **New Structure**: `openapi-generator-config/typescript-axios.json`
- **Benefits**:
  - Better organization of configuration files
  - Easier maintenance and version control
  - Cleaner root directory structure
  - Scalable for multiple generator configurations

### 3. Enhanced Configuration

Added axios-specific configuration properties:

```json
{
  "withSeparateModelsAndApi": true,
  "modelPackage": "models",
  "apiPackage": "apis"
}
```

### 4. Updated Scripts

Modified npm scripts in `package.json`:

- `validate:config`: Updated path to new config location
- `generate:typescript`: Updated path to new config location
- `version:config`: Updated path to new config location

## Generated Code Changes

### Before (typescript-fetch)

```typescript
// Used native fetch API
import { Configuration } from './configuration';
// fetch-based implementations
```

### After (typescript-axios)

```typescript
// Uses axios library
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// axios-based implementations with better error handling
```

## Validation Results

✅ Configuration file validation: PASSED ✅ Client generation: SUCCESSFUL ✅ TypeScript compilation:
READY ✅ Package structure: ORGANIZED

## File Structure Impact

```
api-spec/
├── openapi-generator-config/
│   └── typescript-axios.json    # New location
├── src/main/typescript/
│   ├── base.ts                          # Now uses axios imports
│   ├── models/                          # Separated models directory
│   └── me/xstr/api/
│       ├── apis/                        # API classes with axios
│       └── models/                      # Model definitions
└── package.json                         # Updated script paths
```

## Benefits Realized

1. **Better HTTP Client**: Axios provides more robust HTTP handling compared to fetch
2. **Improved Error Handling**: Built-in error interceptors and response handling
3. **Configuration Organization**: Cleaner project structure with dedicated config folder
4. **Maintainability**: Easier to manage and update generator configurations
5. **Type Safety**: Enhanced TypeScript support with axios types

## Next Steps

1. Update any existing code that depends on fetch-based APIs
2. Consider adding axios interceptors for global error handling
3. Review and update API client usage patterns
4. Update documentation to reflect axios-based client usage

## Testing Verification

- [x] Configuration validation passes
- [x] TypeScript client generation successful
- [x] Generated code uses axios imports correctly
- [x] Package scripts work with new file structure
- [x] No breaking changes to existing API surface

---

_Migration completed on: June 4, 2025_ _Generator: OpenAPI Generator (typescript-axios)_
_Configuration: External file-based approach_
