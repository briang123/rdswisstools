# Husky Hooks & Commit Message Flow Guide

This document explains the purpose of each Husky hook and script found in the `.husky/` directory, and how they integrate with Commitizen and Commitlint in this project.

---

## Commit Workflow Overview

1. **You run:**
   - `npm run commit` or `npx cz`
2. **Commitizen** prompts you for commit details and generates a commit message.
3. **Commitizen** runs `git commit -m "<message>"`.
4. **Husky's `commit-msg` hook** is triggered by the git commit.
5. **Commitlint** runs via the `commit-msg` hook to validate the commit message.
6. **If valid:** Commit is accepted. **If invalid:** Commit is blocked with an error.

---

## Common Script: `h`

- **File:** `.husky/h`
- **Purpose:**
  - Helper script sourced by all hooks.
  - Sets up environment, sources user config, ensures `node_modules/.bin` is in PATH, and executes the corresponding hook logic.
  - Handles error reporting and exit codes.

---

## Husky Hooks

All hooks below source the `h` helper script. You can add custom commands after the sourcing line.

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

### `commit-msg`

- **Runs when a commit message is created (including via Commitizen).**
- **Current actions:**
  - Runs `npx commitlint --edit $1` to validate the commit message.
  - Blocks the commit if the message does not follow the configured conventions.
- **Integration:**
  - This is triggered automatically when you use Commitizen (`npm run commit` or `npx cz`), as Commitizen ultimately runs `git commit`.

### `pre-push`

- **Runs before a push to a remote repository.**
- **Current actions:**
  - (No custom commands; only sources the helper script.)
- **Common examples:**
  - `npm test` — Run all tests before pushing.
  - `npm run build` — Ensure the project builds before pushing.
  - `npx audit` — Run security audits.

### Other Hooks

- `pre-auto-gc`, `pre-rebase`, `pre-applypatch`, `pre-merge-commit`, `prepare-commit-msg`, `applypatch-msg`, `post-checkout`, `post-merge`, `post-rewrite`, `post-applypatch`, `post-commit`
- **Current actions:**
  - (No custom commands; only source the helper script.)
- **Customizations:**
  - You can add commands as needed after the sourcing line.

---

## Commitizen Integration

- **Usage:**
  - Run `npm run commit` or `npx cz` to start an interactive commit prompt.
  - Commitizen uses the `cz-conventional-changelog` adapter (see `package.json`).
  - After you answer the prompts, Commitizen generates a commit message and runs `git commit`.
  - This triggers Husky's `commit-msg` hook, which runs Commitlint.

---

## Commitlint Integration

- **Configuration:**
  - See `commitlint.config.js` for rules.
- **How it's triggered:**
  - The `.husky/commit-msg` hook runs `npx commitlint --edit $1` on every commit.
  - If the message is invalid, the commit is blocked and an error is shown.

---

## Example: Commit Flow

```sh
npm run commit
# or
npx cz
# (Commitizen prompts)
# (git commit is run)
# (Husky commit-msg hook runs)
# (Commitlint validates message)
```

---

> To customize a hook, add your commands after the sourcing line in the corresponding file.
