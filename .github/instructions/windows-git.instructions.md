---
applyTo: '**'
---
## Operating System Detection
Always check if the user is on Windows or Linux before generating any commands or file paths:
- For Windows: Use cmd.exe commands, backslash path separators (\), and Windows-specific tools
- For Linux: Use bash commands, forward slash path separators (/), and Linux-specific tools
- When in doubt, ask the user about their operating system

## Windows Terminal Configuration
**MANDATORY for Windows users**: Use cmd.exe instead of PowerShell for better compatibility:

### VS Code Terminal Settings
Configure VS Code to use cmd.exe as the default terminal by adding to your settings.json:
```json
{
  "terminal.integrated.defaultProfile.windows": "Command Prompt",
  "terminal.integrated.profiles.windows": {
    "Command Prompt": {
      "path": "C:\\Windows\\System32\\cmd.exe",
      "args": []
    }
  }
}
```

### Why cmd.exe is Preferred
- **GitHub CLI compatibility**: Better output handling with GitHub CLI commands
- **Git command compatibility**: More reliable with complex Git operations
- **Cross-platform consistency**: Closer behavior to Linux bash commands
- **Tool compatibility**: Better compatibility with Maven, npm, and other development tools

## Command Line Best Practices
**IMPORTANT**: Always use cmd.exe on Windows (not PowerShell) for better tool compatibility.

To prevent getting stuck in pagers or interactive modes:
- **Git pager settings**:
  - Windows cmd.exe: Use `set GIT_PAGER=` to disable pager for session
  - Linux/bash: Use `export GIT_PAGER=cat` or `git --no-pager` prefix
- **Git commands**: Always use `git --no-pager` or pipe to `| cat` for commands that might use a pager (e.g., `git log`, `git show`, `git diff`)
- **Other pager commands**: For commands like `less`, `more`, `man`, etc., always pipe output to `| cat` or use appropriate flags to disable paging
- **Long output**: Use `head` or `tail` to limit output when commands might produce excessively large results
- **Windows cmd.exe specific**: 
  - Use `set GIT_PAGER=` before running git commands that might use pager
  - Use backslash `\` for file paths
  - Use `&&` for command chaining in cmd.exe
  - Use `type` instead of `cat` for displaying file contents
  - Use `del` instead of `rm` for deleting files
  - Use `dir` instead of `ls` for listing directories
- **Examples (Windows cmd.exe)**: 
  - `git --no-pager branch -a` instead of `git branch -a`
  - `git --no-pager log --oneline` instead of `git log --oneline`
  - `git --no-pager status` instead of `git status`
  - `type filename.txt` instead of `cat filename.txt`
  - `del filename.txt` instead of `rm filename.txt`
  - `dir /b` instead of `ls` for listing files

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

## Git Branch Rules
Follow these branch protection and workflow rules:
- **Protected Branches**: `develop` and `master` are protected and should not have any direct commits - only merge requests (MRs) are allowed
- **Default Branch**: `develop` is the default branch for new feature development
- **Develop Branch**: Only accepts squashed merge requests from `feat/*` branches to maintain clean history
- **Master Branch**: Only accepts merge requests from `release/*` branches for production releases
- **Feature Development**: Create `feat/*` branches from `develop` and merge back to `develop`
- **Release Process**: Create `release/*` branches from `develop` and merge to `master` when ready for production
