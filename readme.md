# Generate Next Release Tag

- This is a GitHub Action that automates the process of creating the next release tag version for your repository. Note: it generates a new release version, but it does not create a new release.
- The action sets an output variable named `next_release_tag`, which can be used to create the next release.
- It uses the previous release tag and increments it based on the year, month, date, and iteration count.
- The action supports creating release tags based on the template given to the action. Refer to the [Templating System](https://github.com/amitsingh-007/next-release-tag#templating-system) section for more information.
- To use this action, there must be a release tag in the repository, and the latest tag must follow the given template. The latest tag can be a pre-release, a full release or a dangling tag.
- This action is recommended to be used with `actions/create-release` to create the release.
- The minimum supported Node.js version is v20.

## Inputs

`github_token`: The Github Secret `GITHUB_TOKEN` or `Personal Access Token`. This is a required input.

`tag_prefix`: The prefix to be added to the generated release tag. Pass as `''` to remove prefix in the generated output. This is a required input.

`tag_template`: A preconfigured static template based on which the new release tag will be generated. Please check the [Templating System](https://github.com/amitsingh-007/next-release-tag#templating-system) section for more information. This is a required input.

## Outputs

`next_release_tag`: This output variable contains the next release version and is set by the action. You can access it via `step.<id>.outputs.next_release_tag`.

`prev_release_tag`: Additionally, the action also sets this output variable, which contains the previous release version. You can access it via `step.<id>.outputs.prev_release_tag`.

## Example workflow

```yaml
name: Create Release

on: push

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout branch
        uses: actions/checkout@v4

      - name: Generate release tag
        id: generate_release_tag
        uses: amitsingh-007/next-release-tag@v5.0.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          tag_prefix: 'v'
          tag_template: 'yyyy.mm.dd.i'

      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.generate_release_tag.outputs.next_release_tag }}
          name: Release ${{ steps.generate_release_tag.outputs.next_release_tag }}
          generateReleaseNotes: true
          makeLatest: true
```

## Templating System

This action supports a flexible templating system with a few constraints. Users must pass the `tag_template` option in the action, and the action will fill in the corresponding values based on the template to generate a new release tag. The following are the rules and constraints:

- The template represents the final release tag's format without the tag prefix. You must pass the tag prefix separately.
- The allowed template tokens are: `yyyy` (full year), `yy` (short year), `mm` (month), `dd` (date), `i` (iteration count).
- Each of these tokens must be combined with a separator to form the template (e.g., `yyyy.mm.i`).
- Separators cannot be at the beginning or end of the template (e.g., `.yy.mm.i.` is not allowed).
- A separator can be any string, but it cannot contain the above-mentioned tokens.
- Only a single kind of separator is allowed in the string (e.g., `yy-mm-dd.i` is not allowed).
- The iteration count resets to `1` when the year, month, or date is changed between the last release and the current release.
- The final generated release tag will be in the format: `<tag_prefix><filled-in tag_template>` (e.g., if the tag_prefix is `v` and the tag_template is `yyyy.mm.dd.i`, then the second release on March 21, 2023, will be `v2023.3.21.2`).
