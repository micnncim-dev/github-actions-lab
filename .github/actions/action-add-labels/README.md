# Action Add Labels

![screenshot](./docs/assets/screenshot.png)

This is a GitHub Action to add GitHub label to an issue or a pull request.

It would be more useful to use this with other GitHub Actions' outputs.

## Inputs

|      Key       | Required |                            Default                             |                                 Note                                 |
| -------------- | -------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| `github_token` | `true`   | N/A                                                            | Must be in form of `github_token: ${{ secrets.github_token }}`.      |
| `labels`       | `true`   | N/A                                                            | Must be in form of a string with line breaks. See the example below. |
| `repo`         | `false`  | `${{ github.repository }}`                                     | The owner and repository name. e.g. `Codertocat/Hello-World`.        |
| `number`       | `false`  | The number of the issue or PR which has triggered this action. |                                                                      |

## Example

### Add a single label

```yaml
name: Add Labels

on:
  issues:
    types: opened

jobs:
  add_labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-ecosystem/action-add-labels@v1
        with:
          github_token: ${{ secrets.github_token }}
          labels: bug
```

### Add multiple labels

```yaml
name: Add Labels

on:
  pull_request:
    types: opened

jobs:
  add_labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-ecosystem/action-add-labels@v1
        with:
          github_token: ${{ secrets.github_token }}
          labels: |
            documentation
            changelog
```

## License

Copyright 2020 The Actions Ecosystem Authors.

Action Size is released under the [Apache License 2.0](./LICENSE).
