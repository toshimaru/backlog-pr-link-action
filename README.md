![Build](https://github.com/toshimaru/backlog-pr-action/workflows/Build/badge.svg)

# backlog-pr-action

GitHub Actions: Link PR to backlog issue.

![OG image](./img/backlog-pr-action.jpg)

## Usage

```yaml
# .github/workflows/backlog-pr-action.yml
name: 'Auto Author Assign'

on:
  pull_request:
    types: [opened, reopened]

jobs:
  add-assignees:
    runs-on: ubuntu-latest
    steps:
      - uses: toshimaru/backlog-pr-action@v1.1.0
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```
