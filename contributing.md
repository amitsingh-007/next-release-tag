# Contributing

## Running Locally

- Fork this repository.
- This project uses pnpm instead of npm; ensure the latest version of pnpm is installed.
- Run `pnpm install` in the root folder.
- For local development:
  - Run `pnpm build` to generate the `dist` folder.
  - Run `pnpm lint` to lint all files.
  - Run `pnpm test` to run the test suite.
  - Run `pnpm debug` to execute the application with sample data. See `.env.example` for environment variable configuration.
  - Run `pnpm dist` before committing any changes.

## Development Guidelines

- Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and enable it for this workspace with the default settings.
- Install the [XO plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=samverschueren.linter-xo).
- Use `pascalCase` naming throughout the project.
- Add comments to complex logic as needed.
