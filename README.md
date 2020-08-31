![Build](https://github.com/toshimaru/backlog-pr-link-action/workflows/Build/badge.svg)

# backlog-pr-link-action

GitHub Actions: Link PR to backlog issue.

## Usage

```yaml
# .github/workflows/backlog-pr-link.yml
name: 'Link PR to Backlog'

on:
  pull_request:
    types: [opened, edited]

jobs:
  backlog-pr-link:
    runs-on: ubuntu-latest
    steps:
      - uses: toshimaru/backlog-pr-link-action@v0.0.1
        with:
          backlog-api-key: "${{ secrets.BACKLOG_API_KEY }}"
          backlog-host: "your-org.backlog.com"
```
