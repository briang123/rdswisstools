# Husky Hooks Guide

This document explains the purpose of each Husky hook and script found in the `.husky/_` directory of this project.

---

## Common Script: `h`

- **File:** `.husky/_/h`
- **Purpose:**
  - Helper script sourced by all hooks.
  - Sets up environment, sources user config, ensures `node_modules/.bin` is in PATH, and executes the corresponding hook logic.
  - Handles error reporting and exit codes.

## Husky Hooks

All hooks below source the `h` helper script. You can add custom commands after the sourcing line.

---

### `pre-commit`

- **Runs before a commit is finalized.**
- **Current actions:**
  - Runs `npm run test` (unit tests).
  - Runs `npm run test:e2e` (end-to-end tests).
  - Prevents commit if either fails.
- **Common examples:**
  - `npm run lint` — Lint code before committing.
  - `npx prettier --check .` — Check code formatting.
  - `npx lint-staged` — Run linters on staged files.
  - `npm run type-check` — Run TypeScript type checks.

### `pre-push`

- **Runs before a push to a remote repository.**
- **Current actions:**
  - (No custom commands; only sources the helper script.)
- **Common examples:**
  - `npm test` — Run all tests before pushing.
  - `npm run build` — Ensure the project builds before pushing.
  - `npx audit` — Run security audits.

### `pre-auto-gc`, `pre-rebase`, `pre-applypatch`, `pre-merge-commit`

- **Run before their respective git actions.**
- **Current actions:**
  - (No custom commands; only source the helper script.)
- **Common examples:**
  - `echo "About to rebase!"`
  - Custom scripts to check for merge conflicts or enforce policies.

### `post-checkout`, `post-merge`, `post-rewrite`, `post-applypatch`, `post-commit`

- **Run after their respective git actions.**
- **Current actions:**
  - (No custom commands; only source the helper script.)
- **Common examples:**
  - `npm install` — Install dependencies after switching branches.
  - `npx update-deps` — Update dependencies after merging.
  - `echo "Commit complete!"`

### `applypatch-msg`, `commit-msg`, `prepare-commit-msg`

- **Run during patch application or commit message creation.**
- **Current actions:**
  - (No custom commands; only source the helper script.)
- **Common examples:**
  - `npx commitlint --edit $1` — Enforce commit message conventions.
  - Custom scripts to check for JIRA ticket references in commit messages.

## Deprecated Script: `husky.sh`

- **File:** `.husky/_/husky.sh`
- **Purpose:**
  - Warns about deprecated usage of this script in Husky v10+.
  - Should not be used in new hooks.

---

> To customize a hook, add your commands after the sourcing line in the corresponding file.
