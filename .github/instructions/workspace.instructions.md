---
applyTo: '**'
---
## Operating System Detection
Always check if the user is on Windows or Linux before generating any commands or file paths:
- For Windows: Use PowerShell commands, backslash path separators (\), and Windows-specific tools
- For Linux: Use bash commands, forward slash path separators (/), and Linux-specific tools
- When in doubt, ask the user about their operating system

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
1. **Create Issue First**: Always create a GitHub issue before starting work
   - Use descriptive title and detailed description
   - Add appropriate labels (feature, bug, enhancement, etc.)
   - If no description provided by user, create comprehensive issue description
2. **Create Feature Branch**: Branch from `develop` using format `feat/ISSUE-{number}-{short-description}`
3. **Reference Issue**: All commits should reference the issue number
4. **Create PR**: Pull Request MUST close the issue using "Closes #X" or "Fixes #X"
5. **Documentation**: Include issue reference in changelog documentation

## Git Branch Rules
Follow these branch protection and workflow rules:
- **Protected Branches**: `develop` and `master` are protected and should not have any direct commits - only merge requests (MRs) are allowed
- **Default Branch**: `develop` is the default branch for new feature development
- **Develop Branch**: Only accepts squashed merge requests from `feat/*` branches to maintain clean history
- **Master Branch**: Only accepts merge requests from `release/*` branches for production releases
- **Feature Development**: Create `feat/*` branches from `develop` and merge back to `develop`
- **Release Process**: Create `release/*` branches from `develop` and merge to `master` when ready for production

## General Guidelines
Coding standards, domain knowledge, and preferences that AI should follow.