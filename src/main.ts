import * as core from '@actions/core'
import { context } from '@actions/github'
import { Client } from './client'

async function main() {
  try {
    const host = core.getInput('backlog-host', { required: true })
    const apiKey = core.getInput('backlog-api-key', { required: true })

    if (context.payload.pull_request === undefined) {
      throw new Error("Can't get pull_request payload. Check your trigger is pull_request event")
    }

    const client = new Client(host, apiKey)
    const { html_url: prUrl = '', body = '' } = context.payload.pull_request
    if (!client.containsBacklogUrl(body)) {
      core.info("Skip process since the body doesn't contain backlog URL")
      return
    }

    for (const [backlogUrl, projectId, issueId] of client.parseBacklogUrl(body)) {
      core.info(`Trying to link the Pull Request to ${backlogUrl}`)

      if (await client.updateIssuePrField(projectId, issueId, prUrl)) {
        core.info(`Pull Request (${prUrl}) has been successfully linked`)
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

main()
