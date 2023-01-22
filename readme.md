# Generate Next Release Tag

- A GitHub Action to automate the process of creating the next release tag version for your repository. Note: this only generates a new release version instead of creating a new release.
- This action will set an environment variable named `release_tag` which can then be used to create the next release.
- It uses the previous release tag and increments over it based on year, month and iteration count.
- Template of release tag will be: `<prefix>yy.mm.i`, where prefix=v(default), yy=year, mm=month, i=iteration. Set prefix as '' to remove prefix.
- For example, third release in December 2022 with default pefix will be: `v22.12.3`.
- This action is recommended to be used with `actions/create-release` to create a release.
- Minimum supported nodejs version is v14.

## Inputs

github_token: Github Secret `GITHUB_TOKEN` or `Personal Access Token` which must be passed.

tag_prefix: Prefix added to the generated release tag. Optional. Defaults to 'v'. Pass '' to remove prefix in the generated output.

## Outputs

Sets an environment variable named `release_tag` which contains the next release version.

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
          tag_prefix: ''

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ env.release_tag }}
          release_name: Release ${{ env.release_tag }}
```
