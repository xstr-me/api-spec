---
applyTo: '**'
---

## Project Documentation Standards

When completing features or bugfixes, generate documentation at the end:

1. Create the documentation file after completing the feature/bugfix work
2. Use feature name or issue reference for naming when possible
3. Move the file to the `changelogs/` directory with appropriate naming
4. Format: `{FEATURE-NAME|ISSUE-REF}.md` (e.g., `FEATURE-auth-system.md` or `ISSUE-123.md`)
5. If no specific feature name or issue reference, use descriptive name: `{DESCRIPTION}.md`
6. Commit the renamed file in the changelogs directory

## Project Architecture and Lifecycle Management

Follow these project structure and lifecycle rules:

### Code Generation Responsibility

- **Maven Project**: The main Maven project (`pom.xml` in root) is responsible for all code
  generation
- **OpenAPI Code Generation**: Use Maven OpenAPI Generator plugin to generate TypeScript client code
  from OpenAPI specification
- **Target Directory**: Generated TypeScript code should be placed in `src/main/typescript/`
  directory
- **Source Control**: Generated code should be committed to source control for consistency and CI/CD
  reliability

### Individual Project Lifecycles

Each sub-project has its own independent lifecycle and should be managed within its designated
folder:

#### Maven Project (Root Level)

- **Location**: Root directory with `pom.xml`
- **Responsibilities**: Code generation, Java compilation, testing, packaging
- **Tooling**: Maven (`mvn` commands)
- **Working Directory**: Root project directory
- **Testing**: `mvn test` for Java unit tests
- **Build**: `mvn clean compile` for compilation, `mvn package` for JAR creation

#### npm/TypeScript Project

- **Location**: `src/main/typescript/` directory
- **Responsibilities**: TypeScript compilation, npm packaging, TypeScript testing, documentation
  generation
- **Tooling**: npm/Node.js (`npm` commands)
- **Working Directory**: `src/main/typescript/` for all npm operations
- **Testing**: `npm test` within the TypeScript project directory
- **Build**: `npm run build` for TypeScript compilation
- **Publishing**: `npm publish` for npm registry publication

#### TypeScript Test Project

- **Location**: `src/test/typescript/` directory
- **Responsibilities**: Integration testing, API testing, test utilities
- **Tooling**: npm/Jest (`npm` commands)
- **Working Directory**: `src/test/typescript/` for test operations
- **Testing**: `npm test` for integration and API tests

### Pipeline and CI/CD Rules

- **Independent Pipelines**: Each project should have its own CI/CD pipeline steps
- **Project-Specific Tooling**: Always use the appropriate tooling within the correct sub-folder
  - Maven commands should run from root directory
  - npm commands should run from `src/main/typescript/` or `src/test/typescript/`
- **Workspace Setup**: Use npm workspaces configuration in root `package.json` to manage TypeScript
  dependencies
- **Cross-Project Dependencies**: TypeScript projects depend on Maven code generation being
  completed first

### Release Management Exception

- **Maven-Managed Releases**: Release coordination should be managed by the Maven project
- **Version Synchronization**: Maven controls version numbers and synchronizes them across all
  sub-projects
- **Release Workflow**: Use Maven release plugin or semantic release tools from root directory
- **Coordinated Publishing**: Release process should publish both Maven artifacts and npm packages
  in coordinated manner
- **Release Branch**: Create release branches from `develop` and manage the entire release process
  through Maven tooling

### Development Workflow Guidelines

1. **Code Generation First**: Always run Maven code generation before TypeScript development
2. **Independent Development**: Develop and test each project within its own directory using
   appropriate tools
3. **Cross-Project Changes**: When changes affect multiple projects, coordinate through the main
   Maven project
4. **Testing Strategy**: Test each project independently, then run integration tests across projects
5. **Documentation**: Generate documentation for each project using its native tooling (Maven for
   Java, npm for TypeScript)
