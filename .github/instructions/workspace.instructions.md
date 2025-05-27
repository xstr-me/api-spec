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

## General Guidelines
Coding standards, domain knowledge, and preferences that AI should follow.