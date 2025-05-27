# Setup Instructions for XStr.me API Spec

This guide will help you complete the setup for publishing your API specification to both Maven Central and NPM.

## Project Structure ✅

The project has been successfully created with the following structure:

```
├── api-spec.yml                 # OpenAPI specification
├── pom.xml                     # Maven configuration
├── package.json                # NPM configuration
├── README.md                   # Project documentation
├── LICENSE                     # MIT license
├── .gitignore                  # Git ignore rules
├── .spectral.yml              # API linting rules
├── maven-settings-example.xml # Maven settings template
├── src/
│   └── main/
│       ├── java/
│       │   └── me/xstr/api/
│       │       └── ApiSpec.java    # Java utility class
│       └── resources/              # Resources directory
├── .github/
│   ├── workflows/
│   │   ├── ci.yml             # Continuous integration
│   │   ├── maven-publish.yml  # Maven publishing workflow
│   │   └── npm-publish.yml    # NPM publishing workflow
│   └── instructions/
│       └── workspace.instructions.md
└── .vscode/
    └── tasks.json             # VS Code tasks
```

## Next Steps

### 1. Install Required Tools

#### Node.js and NPM (Required for NPM publishing and API validation)
1. Download Node.js from: https://nodejs.org/
2. Install the LTS version (18.x or later)
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### After installing Node.js, run:
```powershell
npm install
```

### 2. Validate the API Specification

Once Node.js is installed:
```powershell
npm test  # Runs validation and linting
```

### 3. Build and Test Maven Package

```powershell
mvn clean package  # Build the JAR
mvn clean install  # Install to local repository
```

### 4. Publishing Setup

#### Maven Central Publishing Prerequisites:

1. **Create Sonatype OSSRH Account**:
   - Sign up at: https://issues.sonatype.org/
   - Create a ticket to claim your group ID (me.xstr)

2. **Generate GPG Key**:
   ```powershell
   # Install GPG for Windows if not already installed
   gpg --gen-key
   gpg --list-secret-keys --keyid-format LONG
   gpg --armor --export YOUR_KEY_ID
   ```

3. **Configure Maven Settings**:
   - Copy `maven-settings-example.xml` to `~/.m2/settings.xml`
   - Replace placeholders with your credentials

#### NPM Publishing Prerequisites:

1. **Create NPM Account**: Sign up at https://www.npmjs.com/
2. **Request Access to @xstr-me Organization** or change package name
3. **Login**: `npm login`

### 5. Publishing Commands

#### Maven Central:
```powershell
mvn clean deploy -Prelease
```

#### NPM:
```powershell
npm publish
```

### 6. GitHub Repository Setup

1. **Add Secrets** to your GitHub repository:
   - `GPG_PRIVATE_KEY`: Your GPG private key
   - `GPG_PASSPHRASE`: Your GPG key passphrase
   - `OSSRH_USERNAME`: Sonatype OSSRH username
   - `OSSRH_PASSWORD`: Sonatype OSSRH password
   - `NPM_TOKEN`: NPM authentication token

2. **Create Release Tags**:
   ```powershell
   git tag v1.0.0
   git push origin v1.0.0
   ```

### 7. Available VS Code Tasks

Use Ctrl+Shift+P → "Tasks: Run Task" to access:
- **Maven: Build** - Compile the project
- **Maven: Package** - Create JAR file
- **Maven: Install Local** - Install to local repository
- **Maven: Deploy to Central** - Deploy to Maven Central
- **NPM: Install** - Install dependencies
- **NPM: Test** - Validate API specification
- **NPM: Publish** - Publish to NPM

### 8. Usage Examples

#### Java/Maven Projects:
```xml
<dependency>
    <groupId>me.xstr</groupId>
    <artifactId>api-spec</artifactId>
    <version>1.0.0</version>
</dependency>
```

```java
import me.xstr.api.ApiSpec;

// Load API spec
String spec = ApiSpec.getApiSpecAsString();
InputStream specStream = ApiSpec.getApiSpecAsStream();
```

#### Node.js/NPM Projects:
```bash
npm install @xstr-me/api-spec
```

```javascript
const fs = require('fs');
const path = require('path');

// Load API spec
const specPath = require.resolve('@xstr-me/api-spec/api-spec.yml');
const apiSpec = fs.readFileSync(specPath, 'utf8');
```

## Current Status

✅ **Completed**:
- Project structure created
- Maven configuration ready
- NPM configuration ready
- Java utility class created
- GitHub Actions workflows configured
- VS Code tasks configured
- Documentation created

⏳ **Pending**:
- Node.js installation
- NPM dependencies installation
- Publishing credentials setup
- First release

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [maven-settings-example.xml](maven-settings-example.xml) for Maven configuration
- Use VS Code tasks for common operations
- GitHub Actions will handle automated publishing on tag releases
