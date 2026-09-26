<div align="center">

# Next Release Tag

A GitHub Action that works out your next date-based release tag from the previous one.

[![Release](https://img.shields.io/github/v/release/amitsingh-007/next-release-tag)](https://github.com/amitsingh-007/next-release-tag/releases)
[![Test](https://github.com/amitsingh-007/next-release-tag/actions/workflows/test.yml/badge.svg)](https://github.com/amitsingh-007/next-release-tag/actions/workflows/test.yml)
[![Marketplace](https://img.shields.io/badge/marketplace-next--release--tag-blue?logo=github)](https://github.com/marketplace/actions/auto-generate-next-release-tag)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](licence)

</div>

You describe the tag format with a template like `yyyy.mm.dd.i`. The action reads your latest tag, fills in today's date, and bumps the iteration count, so the second release on September 26, 2026 comes out as `v2026.09.26.02`.

It only generates the tag. It does **not** create the release; pass the output to a release action for that.

## Features

- Template tokens for full year, short year, month, day and iteration count
- The iteration count goes back to `01` whenever the date part of the tag changes
- Optional tag prefix, including a trailing `*` wildcard that picks the highest matching tag in numeric order (`v1.10` beats `v1.9`)
- A `previous_tag` input to skip the lookup and bump from a tag you choose
- Runs on the Node.js 24 Actions runtime, independent of the Node version your own steps use
- Pairs with [`softprops/action-gh-release`](https://github.com/softprops/action-gh-release) or [`ncipollo/release-action`](https://github.com/ncipollo/release-action)

## Quick start

```yaml
name: Create Release

on: push

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout branch
        uses: actions/checkout@v7

      - name: Generate release tag
        id: generate_release_tag
        uses: amitsingh-007/next-release-tag@v6
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          tag_prefix: 'v'
          tag_template: 'yyyy.mm.dd.i'

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          name: Release ${{ steps.generate_release_tag.outputs.next_release_tag }}
          tag_name: ${{ steps.generate_release_tag.outputs.next_release_tag }}
          token: ${{ secrets.GITHUB_TOKEN }}
          generate_release_notes: true
```

## Inputs

| Name           | Required | Default | Description                                                                                        |
| -------------- | -------- | ------- | -------------------------------------------------------------------------------------------------- |
| `github_token` | Yes      |         | `secrets.GITHUB_TOKEN` or a personal access token. Used to read the repository's tags.             |
| `tag_prefix`   | Yes      |         | Text put in front of the generated tag. Pass `''` for no prefix. See [Tag prefix](#tag-prefix).    |
| `tag_template` | Yes      |         | Format of the tag without the prefix, e.g. `yyyy.mm.i`. See [Tag template](#tag-template).         |
| `previous_tag` | No       |         | Use this tag as the previous release instead of looking it up. Must match the prefix and template. |

## Outputs

| Name               | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `next_release_tag` | The generated tag. Read it with `steps.<id>.outputs.next_release_tag`.                       |
| `prev_release_tag` | The previous tag the action bumped from. Read it with `steps.<id>.outputs.prev_release_tag`. |

## Tag template

The template is the tag's format without the prefix. It is built from these tokens:

| Token  | Meaning                     | Example (Sep 26, 2026) |
| ------ | --------------------------- | ---------------------- |
| `yyyy` | Full year                   | `2026`                 |
| `yy`   | Short year                  | `26`                   |
| `mm`   | Month                       | `09`                   |
| `dd`   | Day of the month            | `26`                   |
| `i`    | Iteration count for the day | `01`, `02`, ...        |

Rules:

- Put a separator between every pair of tokens, e.g. `yyyy.mm.i`.
- Use one separator character and stick to it. `yy-mm-dd.i` fails because it mixes `-` and `.`.
- The separator can't contain token letters, and it can't start or end the template (`.yy.mm.i.` is invalid).
- Numbers are zero-padded to at least two digits.
- The iteration count resets to `01` when any date token in the template changes from the previous tag. With `yyyy.mm.i`, a new month resets it; a new day doesn't.
- If the repository has no tags yet, the first tag gets iteration `01`.

Examples, run on September 26, 2026:

| `tag_prefix` | `tag_template` | Previous tag     | Next tag             |
| ------------ | -------------- | ---------------- | -------------------- |
| `v`          | `yyyy.mm.dd.i` | `v2026.09.26.01` | `v2026.09.26.02`     |
| `''`         | `yy.mm.i`      | `26.08.04`       | `26.09.01`           |
| `release-`   | `yyyy-mm-i`    | none             | `release-2026-09-01` |

## Tag prefix

The prefix goes in front of the generated tag. It also decides how the action finds the previous tag.

| `tag_prefix` | Previous tag lookup                                          | Next tag looks like |
| ------------ | ------------------------------------------------------------ | ------------------- |
| `''`         | Most recent tag in the repository                            | `2026.09.26.01`     |
| `v`          | Most recent tag in the repository, which must start with `v` | `v2026.09.26.01`    |
| `v-*`        | Highest tag starting with `v-`, sorted numerically           | `v-2026.09.26.01`   |

A wildcard prefix may hold a single `*`, and it has to be the last character. The `*` never appears in the output. The prefix itself can't contain template tokens.

Use the wildcard when the repository has other tags mixed in (for example `docs-*` tags next to `v*` releases). Without it the action takes the newest tag GitHub returns and fails if that tag doesn't match your prefix.

## How it works

1. The action finds the previous tag: `previous_tag` if you set it, otherwise a lookup through the GitHub API based on `tag_prefix`.
2. It strips the prefix and splits the rest of the tag using the template, reading the old year, month, day and iteration.
3. It fills the template with today's date. If any date value differs from the previous tag, the iteration becomes `01`; otherwise it goes up by one.

The date comes from the runner's clock. GitHub-hosted runners use UTC, so a release made close to midnight in your timezone can end up with the previous or next day's date.

## Versioning

Pin to the major tag (`@v6`) to get every `v6.x` release automatically, or to an exact version (`@v6.5.0`) if you want builds that never change underneath you.

## Contributing

See [contributing.md](contributing.md) for local setup, scripts and the release process.

## License

[MIT](licence)
