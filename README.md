![Build](https://github.com/toshimaru/backlog-pr-action/workflows/Build/badge.svg)

# backlog-pr-action

GitHub Actions: Link PR to backlog issue.

## Usage

```yaml
# .github/workflows/backlog-pr-action.yml
name: 'Link Pull Request to Backlog issue'

on:
  pull_request:
    types: [opened, reopened]

jobs:
  add-assignees:
    runs-on: ubuntu-latest
    steps:
      - uses: toshimaru/backlog-pr-action@v0.0.1
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          backlog-api-key: "${{ }}"
```
