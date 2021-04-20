[![Build](https://github.com/toshimaru/backlog-pr-link-action/actions/workflows/build.yml/badge.svg)](https://github.com/toshimaru/backlog-pr-link-action/actions/workflows/build.yml)

# backlog-pr-link-action

GitHub Actions: Link Pull Request to [Backlog](https://backlog.com/) issue.

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
      - uses: toshimaru/backlog-pr-link-action@v0.3.1
        with:
          backlog-api-key: "${{ secrets.BACKLOG_API_KEY }}"
          backlog-host: "your-org.backlog.com"
```

## Setup

* Create a custom field named **Pull Request**.
  * Custom Field: `Pull Request`
  * Custom Field Type: Sentence
  * Reference
    * [English] [Setting Custom fields - Backlog Enterprise](https://backlog.com/enterprise-help/usersguide/custom-field/userguide1099/)
    * [Japanese] [カスタム属性の設定方法 – Backlog ヘルプセンター](https://support-ja.backlog.com/hc/ja/articles/360035640274-%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E5%B1%9E%E6%80%A7%E3%81%AE%E8%A8%AD%E5%AE%9A%E6%96%B9%E6%B3%95)
  * ![create custom field](https://user-images.githubusercontent.com/803398/93299287-c5913280-f82f-11ea-8e88-6d535390b4d3.png)
* Generate Backlog API key for the Action
  * Reference
    * [English] [API Settings – Backlog Help Center](https://support.backlog.com/hc/en-us/articles/115015420567-API-Settings)
    * [Japanese] 
[APIの設定 – Backlog ヘルプセンター](https://support-ja.backlog.com/hc/ja/articles/360035641754)
  * ![generate backlog api key](https://user-images.githubusercontent.com/803398/94165479-3b973880-fec5-11ea-915d-733d0de6631f.png)
* Set API key to GitHub Secret
  * Recommended secret key name: `BACKLOG_API_KEY`
  * Reference
    * [Encrypted secrets - GitHub Docs](https://docs.github.com/en/actions/reference/encrypted-secrets)
