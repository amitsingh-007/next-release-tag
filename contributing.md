# Contributing

## Running Locally

- Fork this repository.
- This project uses pnpm instead of npm; ensure pnpm 11 is installed (matching CI).
- Run `pnpm install` in the root folder (this also installs the lefthook git hooks).
- For local development:
  - Run `pnpm build` to bundle the action into the `dist/` folder (via [tsdown](https://tsdown.dev)).
  - Run `pnpm lint` to lint and auto-fix all files with [oxlint](https://oxc.rs) (`pnpm lint:ci` to check without fixing).
  - Run `pnpm format` to format all files with [oxfmt](https://oxc.rs) (`pnpm format:check` to verify formatting).
  - Run `pnpm typecheck` to type-check the project with TypeScript.
  - Run `pnpm test` to run the test suite.
  - Run `pnpm dist` (lint + typecheck + test + build) before pushing changes.

## Build & Release

- The compiled bundle `dist/index.mjs` (built by [tsdown](https://tsdown.dev)) **is committed** to the repository, since the action runs from it at runtime. CI (`verify-build`) rebuilds it and fails if the committed `dist/` is out of sync.
- On a published GitHub release, the `Move major tag` workflow moves the floating major tag (e.g. `v6.5.0` → `v6`) to the released commit, so consumers pinning `@v6` always get the latest `v6.x`.

## Git Hooks

- This project uses [lefthook](https://lefthook.dev). On commit, the `pre-commit` hook lints and formats staged files with oxlint/oxfmt, then rebuilds and stages `dist/` so it stays in sync with `src/`.

## Development Guidelines

- Install the [Oxc VS Code extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) for inline oxlint diagnostics and oxfmt formatting.
- Use `pascalCase` naming throughout the project.
- Add comments to complex logic as needed.
