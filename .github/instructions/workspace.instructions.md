---
applyTo: '**'
---
## Operating System Detection
Always check if the user is on Windows or Linux before generating any commands or file paths:
- For Windows: Use PowerShell commands, backslash path separators (\), and Windows-specific tools
- For Linux: Use bash commands, forward slash path separators (/), and Linux-specific tools
- When in doubt, ask the user about their operating system

## Project Documentation Standards
When creating project completion or milestone documentation:
1. Create the documentation file (e.g., PROJECT-COMPLETE.md)
2. Get the current commit hash: `git rev-parse --short HEAD`
3. Move the file to the `changelogs/` directory with the commit hash in the name
4. Format: `DOCUMENT-NAME-{SHORT_HASH}.md` (e.g., `PROJECT-COMPLETE-e36c3d0.md`)
5. Commit the renamed file in the changelogs directory

## General Guidelines
Coding standards, domain knowledge, and preferences that AI should follow.