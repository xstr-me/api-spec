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
- **Multi-line commits**: Use double quotes and escape properly for Windows cmd.exe
- **Windows cmd.exe format**: `git commit -m "Title^

^
- Bullet point 1^
- Bullet point 2^
- Bullet point 3"`
- **Alternative**: Use separate commands for complex commits:
  1. `git commit -m "Title"`
  2. `git commit --amend -m "Title" -m "- Detail 1" -m "- Detail 2" -m "- Detail 3"`
- **Best Practice**: Keep commit titles under 50 characters, details under 72 characters per line
- **Avoid**: Using `&&` or line breaks that break in Windows cmd.exe terminal execution

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
- **List Issues**: `gh issue list` to check existing issues
- **View Issue**: `gh issue view {number}` to see issue details

### GitHub CLI Validation Checklist
Before using any `--body-file` command, ALWAYS:
1. **Check file exists**: Verify the body file (e.g., `issue-body.md`, `pr-body.md`) exists
2. **Check file content**: Ensure the file contains actual description content (not empty or just comments)
3. **Read file first**: Use read_file tool to verify content before proceeding with GitHub CLI commands
4. **Create content if missing**: If file is empty or missing, create proper description content first
5. **Clean up after use**: Delete temporary body files after GitHub CLI operations - they should NOT be committed to the repository

### GitHub CLI Output Interpretation
- **Normal Behavior**: GitHub CLI commands may produce output with empty lines at the beginning and end
- **Success Indication**: Command successful execution is indicated by command completion without error messages
- **Empty Output**: Some commands (like `gh issue list` on repositories with no issues) may produce minimal or empty output
- **Formatting**: Empty lines and minimal output are normal GitHub CLI formatting behavior, not errors
- **IMPORTANT**: Always ignore empty lines in GitHub CLI output - they are normal formatting
- **When given issue number**: Proceed with implementation even if `gh issue view` shows empty lines - the issue exists

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