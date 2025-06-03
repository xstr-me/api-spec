---
applyTo: '**'
---
## Operating System Detection
Always check if the user is on Windows or Linux before generating any commands or file paths:
- For Windows: Use PowerShell commands, backslash path separators (\), and Windows-specific tools
- For Linux: Use bash commands, forward slash path separators (/), and Linux-specific tools
- When in doubt, ask the user about their operating system

## Command Line Best Practices
To prevent getting stuck in pagers or interactive modes:
- **Git pager settings**:
  - Windows cmd.exe: Use `set GIT_PAGER=` to disable pager for session
  - Linux/bash: Use `export GIT_PAGER=cat` or `git --no-pager` prefix
- **Git commands**: Always use `git --no-pager` or pipe to `| cat` for commands that might use a pager (e.g., `git log`, `git show`, `git diff`)
- **Other pager commands**: For commands like `less`, `more`, `man`, etc., always pipe output to `| cat` or use appropriate flags to disable paging
- **Long output**: Use `head` or `tail` to limit output when commands might produce excessively large results
- **Windows-specific**: 
  - Use `set GIT_PAGER=` before running git commands that might use pager
  - Use backslash `\` for file paths
  - Use `&&` for command chaining in cmd.exe
- **Examples**: 
  - `git --no-pager branch -a` instead of `git branch -a`
  - `git --no-pager log --oneline` instead of `git log --oneline`
  - `git --no-pager status` instead of `git status`

## Git Commit Message Best Practices
**CRITICAL**: Multi-line commit messages require special handling in Windows cmd.exe:
- **Single-line commits**: Use simple quoted strings: `git commit -m "Short message"`
- **Multi-line commits**: Use separate `-m` parameters for each line (RECOMMENDED for Windows cmd.exe)
- **Windows cmd.exe RECOMMENDED format**: 
  ```bash
  git commit -m "Title: Brief description under 50 chars" -m "- Detail 1" -m "- Detail 2" -m "- Detail 3"
  ```
- **Alternative Windows cmd.exe format**: Use double quotes and escape properly
  ```bash
  git commit -m "Title^

^
- Bullet point 1^
- Bullet point 2^
- Bullet point 3"
  ```
- **Best Practice**: Keep commit titles under 50 characters, details under 72 characters per line
- **AVOID**: Using `&&` or line breaks that break in Windows cmd.exe terminal execution
- **AVOID**: Complex multi-line strings in single `-m` parameter - use multiple `-m` parameters instead

## Project Documentation Standards
When completing features or bugfixes, generate documentation at the end:
1. Create the documentation file after completing the feature/bugfix work
2. Use feature name or issue reference for naming when possible
3. Move the file to the `changelogs/` directory with appropriate naming
4. Format: `{FEATURE-NAME|ISSUE-REF}.md` (e.g., `FEATURE-auth-system.md` or `ISSUE-123.md`)
5. If no specific feature name or issue reference, use descriptive name: `{DESCRIPTION}.md`
6. Commit the renamed file in the changelogs directory

## Issue and PR Workflow
**MANDATORY**: Every feature or bugfix MUST follow this workflow:

### Issue Management Rules
- **If given issue number (e.g., "implement issue #27")**: 
  - Issue already exists - proceed directly to implementation
  - Do NOT create a new issue
  - If issue cannot be found, ask for clarification
- **If no issue number provided**:
  - Check existing issues first with `gh issue list`
  - Only create new issue if no matching issue exists
  - Use GitHub CLI (`gh issue create`) for issue creation

### Workflow Steps
1. **Issue Verification**: 
   - If issue number provided: verify it exists, proceed to step 2
   - If no number: check existing issues, create only if needed
2. **Create Feature Branch**: Branch from `develop` using format `feat/ISSUE-{number}-{short-description}`
3. **Reference Issue**: All commits should reference the issue number
4. **Create PR**: Use GitHub CLI (`gh pr create`) and MUST close the issue using "Closes #X" or "Fixes #X"
   - **CRITICAL**: ALWAYS use `--body-file` with proper content validation (see GitHub CLI Validation Checklist)
   - **NEVER**: Use `--body` parameter directly - it often results in empty PR bodies
5. **Documentation**: Include issue reference in changelog documentation

## GitHub CLI Integration
Use GitHub CLI (`gh`) for all GitHub operations:
- **Create Issues**: Always use `--body-file` instead of `--body` for descriptions
  - Create issue body file first: `issue-body.md`
  - **VALIDATION REQUIRED**: Always verify the file exists and contains content before proceeding
  - Use: `gh issue create --title "Title" --body-file issue-body.md --label "feature"`
- **Create PRs**: Always use `--body-file` instead of `--body` for descriptions
  - Create PR body file first: `pr-body.md`
  - **VALIDATION REQUIRED**: Always verify the file exists and contains content before proceeding
  - Use: `gh pr create --title "Title" --body-file pr-body.md --base develop`
- **Edit Issues**: Use `gh issue edit {number} --body-file issue-body.md` to add descriptions
  - **VALIDATION REQUIRED**: Always verify the file exists and contains content before proceeding
- **Edit PRs**: Use `gh pr edit {number} --body-file pr-body.md` to update descriptions
  - **VALIDATION REQUIRED**: Always verify the file exists and contains content before proceeding
- **List Issues**: `gh issue list > issues.txt && type issues.txt` to check existing issues (use file redirection for output verification)
- **View Issue**: `gh issue view {number} > issue-details.txt && type issue-details.txt` to see issue details

### GitHub CLI Validation Checklist
Before using any `--body-file` command, ALWAYS:
1. **Check file exists**: Verify the body file (e.g., `issue-body.md`, `pr-body.md`) exists
2. **Check file content**: Ensure the file contains actual description content (not empty or just comments)
3. **Read file first**: Use read_file tool to verify content before proceeding with GitHub CLI commands
4. **Create content if missing**: If file is empty or missing, create proper description content first
5. **Clean up after use**: Delete temporary body files after GitHub CLI operations - they should NOT be committed to the repository

#### PR Creation Example Workflow
```bash
# 1. Create PR body file with actual content
echo "## Summary" > pr-body.md
echo "This PR implements..." >> pr-body.md
echo "## Changes" >> pr-body.md
echo "- Added feature X" >> pr-body.md
echo "## Closes" >> pr-body.md
echo "Closes #31" >> pr-body.md

# 2. Verify file exists and has content
type pr-body.md

# 3. Create PR using body file
gh pr create --title "fix: Issue description" --body-file pr-body.md --base develop

# 4. Clean up temporary file
del pr-body.md
```

### GitHub CLI Output Interpretation
- **CRITICAL OUTPUT CAPTURE ISSUE**: GitHub CLI commands execute successfully but their output may not be visible in terminal tool results
- **Verification Required**: When GitHub CLI commands appear to produce no output, use file redirection to verify actual results
- **Windows cmd.exe Workaround**: Use `gh command > output.txt && type output.txt` to capture and display GitHub CLI output
- **File Redirection Method**: For validation purposes, redirect output to files: `gh issue list > issues.txt`
- **Success Indication**: Command successful execution is indicated by command completion without error messages (even with invisible output)
- **Empty vs Invisible Output**: Distinguish between truly empty output (no issues exist) and invisible output (output capture problem)
- **Validation Commands**: 
  - `gh issue list > issues.txt && type issues.txt` - List and display issues
  - `gh issue view {number} > issue-details.txt && type issue-details.txt` - View and display issue details
- **IMPORTANT**: Never assume no output means no data - always verify with file redirection when in doubt
- **When given issue number**: Proceed with implementation - GitHub CLI output capture issues don't indicate missing issues

## Git Branch Rules
Follow these branch protection and workflow rules:
- **Protected Branches**: `develop` and `master` are protected and should not have any direct commits - only merge requests (MRs) are allowed
- **Default Branch**: `develop` is the default branch for new feature development
- **Develop Branch**: Only accepts squashed merge requests from `feat/*` branches to maintain clean history
- **Master Branch**: Only accepts merge requests from `release/*` branches for production releases
- **Feature Development**: Create `feat/*` branches from `develop` and merge back to `develop`
- **Release Process**: Create `release/*` branches from `develop` and merge to `master` when ready for production

## Project Architecture and Lifecycle Management
Follow these project structure and lifecycle rules:

### Code Generation Responsibility
- **Maven Project**: The main Maven project (`pom.xml` in root) is responsible for all code generation
- **OpenAPI Code Generation**: Use Maven OpenAPI Generator plugin to generate TypeScript client code from OpenAPI specification
- **Target Directory**: Generated TypeScript code should be placed in `src/main/typescript/` directory
- **Source Control**: Generated code should be committed to source control for consistency and CI/CD reliability

### Individual Project Lifecycles
Each sub-project has its own independent lifecycle and should be managed within its designated folder:

#### Maven Project (Root Level)
- **Location**: Root directory with `pom.xml`
- **Responsibilities**: Code generation, Java compilation, testing, packaging
- **Tooling**: Maven (`mvn` commands)
- **Working Directory**: Root project directory
- **Testing**: `mvn test` for Java unit tests
- **Build**: `mvn clean compile` for compilation, `mvn package` for JAR creation

#### npm/TypeScript Project
- **Location**: `src/main/typescript/` directory
- **Responsibilities**: TypeScript compilation, npm packaging, TypeScript testing, documentation generation
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
- **Workspace Setup**: Use npm workspaces configuration in root `package.json` to manage TypeScript dependencies
- **Cross-Project Dependencies**: TypeScript projects depend on Maven code generation being completed first

### Release Management Exception
- **Maven-Managed Releases**: Release coordination should be managed by the Maven project
- **Version Synchronization**: Maven controls version numbers and synchronizes them across all sub-projects
- **Release Workflow**: Use Maven release plugin or semantic release tools from root directory
- **Coordinated Publishing**: Release process should publish both Maven artifacts and npm packages in coordinated manner
- **Release Branch**: Create release branches from `develop` and manage the entire release process through Maven tooling

### Development Workflow Guidelines
1. **Code Generation First**: Always run Maven code generation before TypeScript development
2. **Independent Development**: Develop and test each project within its own directory using appropriate tools
3. **Cross-Project Changes**: When changes affect multiple projects, coordinate through the main Maven project
4. **Testing Strategy**: Test each project independently, then run integration tests across projects
5. **Documentation**: Generate documentation for each project using its native tooling (Maven for Java, npm for TypeScript)