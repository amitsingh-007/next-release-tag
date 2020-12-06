# Generate Next Release Tag

- GitHub action to automate the process of creating the next release tag for your repository.
- This action will set a ENV variable named `next_release_version` which can then be used to create release.
- This action uses the prev release tag an increments over it.
- Template of release tag will be: `vyy.mm.i`, where yy=year, mm=month, i=iteration.
- For example, third release in December 2020 will be: `v20.12.3`

## Inputs

github_token: Github Secret `GITHUB_TOKEN` or `Personal Access Token` must be passed

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

      - name: Generate release tag
        uses: amitsingh-007/next-release-tag@v1.0.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```
