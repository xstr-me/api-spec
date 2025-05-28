# Repository Branch Protection Setup Guide

This document outlines the GitHub repository settings needed to enforce the git workflow rules defined in `.github/instructions/workspace.instructions.md`.

## ✅ Completed Automatically

The following settings have been configured using GitHub CLI:

### Repository Settings
- **Default Branch**: Changed to `develop` ✅
- **Merge Methods**: 
  - ✅ Squash merge enabled (required for feat/* → develop)
  - ❌ Merge commits disabled 
  - ❌ Rebase merge disabled

## 🔧 Manual Configuration Required

The following branch protection rules need to be configured manually in GitHub:

### Develop Branch Protection Rules
Navigate to: https://github.com/xstr-me/api-spec/settings/branches

Click "Add rule" for `develop` branch and configure:

**Branch name pattern**: `develop`

**Protect matching branches**:
- ✅ Require a pull request before merging
  - ✅ Require approvals: 1
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ❌ Require review from code owners
  - ✅ Restrict pushes that create matching files (optional)

- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Add status checks: (add CI/CD checks if any)
    - `ci/github-actions` (if using GitHub Actions)
    - `Maven Build` (if configured)
    - `NPM Tests` (if configured)
    - `PHP Tests` (if configured)

- ✅ Require signed commits (recommended)
- ✅ Require linear history (prevents merge commits)
- ✅ Include administrators
- ✅ Allow specified actors to bypass required pull requests (empty)

### Master Branch Protection Rules
Click "Add rule" for `master` branch and configure:

**Branch name pattern**: `master`

**Protect matching branches**:
- ✅ Require a pull request before merging
  - ✅ Require approvals: 1
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ❌ Require review from code owners
  - ✅ Restrict pushes that create matching files

- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Add status checks: (same as develop)

- ✅ Require signed commits (recommended)
- ✅ Require linear history
- ✅ Include administrators
- ✅ Allow specified actors to bypass required pull requests (empty)

**Additional Restrictions for Master**:
- ✅ Restrict pushes (only allow from `release/*` branches)
  - Add pattern: `release/*`

## 📋 Workflow Summary

After configuration, the workflow will be:

1. **Feature Development**: 
   - Create `feat/*` branches from `develop`
   - Open PRs to merge `feat/*` → `develop` (squash merge only)
   - Requires 1 approval and passing status checks

2. **Release Process**:
   - Create `release/*` branches from `develop`
   - Open PRs to merge `release/*` → `master` (for production)
   - Requires 1 approval and passing status checks

3. **Protection**:
   - No direct commits to `develop` or `master`
   - All changes must go through pull requests
   - Squash merge maintains clean history on `develop`
   - Linear history prevents merge commits

## 🚀 Testing the Setup

After manual configuration, test with:

```powershell
# Create a test feature branch
git checkout develop
git checkout -b feat/test-branch-protection

# Make a small change
echo "# Test" >> test.md
git add test.md
git commit -m "test: branch protection"
git push origin feat/test-branch-protection

# Create PR using GitHub CLI
gh pr create --title "Test: Branch Protection" --body "Testing branch protection rules" --base develop

# Try to push directly to develop (should fail)
git checkout develop
git commit --allow-empty -m "direct commit test"
git push origin develop  # This should be rejected
```

## 📚 References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Workspace Instructions](.github/instructions/workspace.instructions.md)
