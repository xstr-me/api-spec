---
applyTo: '**'
---
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

#### PR Creation Example Workflow (Windows cmd.exe)
```cmd
REM 1. Create PR body file with actual content
echo ## Summary > pr-body.md
echo This PR implements... >> pr-body.md
echo ## Changes >> pr-body.md
echo - Added feature X >> pr-body.md
echo ## Closes >> pr-body.md
echo Closes #31 >> pr-body.md

REM 2. Verify file exists and has content
type pr-body.md

REM 3. Create PR using body file
gh pr create --title "fix: Issue description" --body-file pr-body.md --base develop

REM 4. Clean up temporary file
del pr-body.md
```

### GitHub CLI Output Interpretation
- **CRITICAL OUTPUT CAPTURE ISSUE**: GitHub CLI commands execute successfully but their output may not be visible in terminal tool results
- **Verification Required**: When GitHub CLI commands appear to produce no output, use file redirection to verify actual results
- **Windows cmd.exe Workaround**: Use `gh command > output.txt && type output.txt` to capture and display GitHub CLI output
- **File Redirection Method**: For validation purposes, redirect output to files: `gh issue list > issues.txt`
- **Empty vs Invisible Output**: Distinguish between truly empty output (no issues exist) and invisible output (output capture problem)
- **Validation Commands**: 
  - `gh issue list > issues.txt && type issues.txt` - List and display issues
  - `gh issue view {number} > issue-details.txt && type issue-details.txt` - View and display issue details
- **IMPORTANT**: Never assume no output means no data - always verify with file redirection when in doubt
- **When given issue number**: Proceed with implementation - GitHub CLI output capture issues don't indicate missing issues
