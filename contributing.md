# Contributing

## Running on local machine

- Fork this repository.
- This project uses pnpm instead of npm so make sure you have latest version of pnpm installed.
- Run `pnpm install` in the root folder.
- For local development:
  - Run `pnpm build` to only build the dist folder.
  - Run `pnpm lint` to lint all files.
  - Run `pnpm test` to run all tests.
  - Run `pnpm debug` to actually run the actual with actual data. See `.env.example` to see how to set up your environment variables.
  - Run `pnpm dist` before committing any changes to the repository.

## Guidelines for development

- Install [prettier]("https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode") and enable for this workplace, with default settings.
- Install XO plugin for vscode.
- Follow `pascalCase` for this project.
- Attach comments to complex logic, if required.
