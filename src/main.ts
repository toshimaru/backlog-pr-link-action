import * as core from '@actions/core'
import { context } from '@actions/github'
import { Client, CustomField } from './client'

async function main () {
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
      if (!await client.validateProject(projectId)) {
        core.warning(`Invalid ProjectID: ${projectId}`)
        continue
      }
      core.info(`Trying to link the Pull Request to ${backlogUrl}`)

      const prCustomField: CustomField | undefined = await client.getPrCustomField(projectId)
      if (prCustomField === undefined) {
        core.warning('Skip process since "Pull Request" custom field not found')
        continue
      }

      if (await client.updateIssuePrField(issueId, prCustomField.id, prUrl)) {
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
