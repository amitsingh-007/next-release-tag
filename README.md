# Generate Next Release Tag

GitHub action to automate the process of creating the next release tag for your repository.
This action will set a ENV variable named `next_release_version` which can then be used to create release.
This action uses the prev release tag an increments over it.
Template of release tag will be: `yy.mm.v`, where yy=year, mm=month, v=version.
For example, third release in December 2020 will be: `20.12.3`

## Inputs

None

## Outputs

Sets an environment variable named `next_release_version` which contains next release version number.

## Example workflow

```yaml
name: Create Release

on: push

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout branch
        uses: actions/checkout@v2

      - name: Authorizing Github action
        with:
          token: "${{ secrets.GITHUB_TOKEN }}"
        uses: oleksiyrudenko/gha-git-credentials@v1

      - name: Generate release tag
        uses: amitsingh-007/next-release-tag@vlatest
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```
