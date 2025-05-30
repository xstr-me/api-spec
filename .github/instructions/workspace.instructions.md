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
   - Use GitHub CLI (`gh issue create`) for issue creation
   - Use descriptive title and detailed description
   - Add appropriate labels (feature, bug, enhancement, etc.)
   - If no description provided by user, create comprehensive issue description
2. **Create Feature Branch**: Branch from `develop` using format `feat/ISSUE-{number}-{short-description}`
3. **Reference Issue**: All commits should reference the issue number
4. **Create PR**: Use GitHub CLI (`gh pr create`) and MUST close the issue using "Closes #X" or "Fixes #X"
5. **Documentation**: Include issue reference in changelog documentation

## GitHub CLI Integration
Use GitHub CLI (`gh`) for all GitHub operations:
- **Create Issues**: Always use `--body-file` instead of `--body` for descriptions
  - Create issue body file first: `issue-body.md`
  - Use: `gh issue create --title "Title" --body-file issue-body.md --label "feature"`
- **Create PRs**: Always use `--body-file` instead of `--body` for descriptions
  - Create PR body file first: `pr-body.md`
  - Use: `gh pr create --title "Title" --body-file pr-body.md --base develop`
- **Edit Issues**: Use `gh issue edit {number} --body-file issue-body.md` to add descriptions
- **List Issues**: `gh issue list` to check existing issues
- **View Issue**: `gh issue view {number}` to see issue details

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