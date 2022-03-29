import * as core from '@actions/core'
import 'isomorphic-fetch'
import 'isomorphic-form-data'
import { Backlog } from 'backlog-js'

const PR_FIELD_NAME = 'Pull Request'

interface CustomField {
  id: number;
  name: string;
  value?: string | null;
}

export class Client {
  private host: string;
  private backlog: Backlog;

  constructor (host: string, apiKey: string) {
    this.host = host
    this.backlog = new Backlog({ host, apiKey })
  }

  containsBacklogUrl (body: string): boolean {
    return this.urlRegex.test(body)
  }

  parseBacklogUrl (body: string): Array<Array<string>> {
    const urls: Array<Array<string>> = []
    const urlRegex: RegExp = this.urlRegex
    let matchData: Array<string> | null
    while ((matchData = urlRegex.exec(body)) !== null) {
      const [url, projectId, issueNo] = matchData
      urls.push([url, projectId, `${projectId}-${issueNo}`])
    }
    return urls
  }

  async updateIssuePrField (
    projectId: string,
    issueId: string,
    prUrl: string
  ): Promise<boolean> {
    if (!await this.validateProject(projectId)) {
      core.warning(`Invalid ProjectID: ${projectId}`)
      return false
    }

    let prCustomField: CustomField | undefined
    try {
      prCustomField = await this.getPrCustomField(projectId)
    } catch (error) {
      if (error instanceof Error) {
        core.error(error.message)
      }
      core.error('Failed to get custom field')
      return false
    }
    if (prCustomField === undefined) {
      core.warning('Skip process since "Pull Request" custom field not found')
      return false
    }

    let currentPrField: CustomField
    try {
      currentPrField = await this.getCurrentPrField(issueId, prCustomField.id)
    } catch (error) {
      if (error instanceof Error) {
        core.error(error.message)
      }
      core.warning(`Invalid IssueID: ${issueId}`)
      return false
    }
    if ((currentPrField.value || '').includes(prUrl)) {
      core.info(`Pull Request (${prUrl}) has already been linked`)
      return false
    }

    try {
      const updateValue: string = currentPrField.value
        ? `${currentPrField.value}\n${prUrl}`
        : prUrl
      await this.backlog.patchIssue(issueId, {
        [`customField_${currentPrField.id}`]: updateValue
      })
      return true
    } catch (error) {
      if (error instanceof Error) {
        core.error(error.message)
      }
      core.error('Failed to update')
      return false
    }
  }

  async validateProject (projectId: string): Promise<boolean> {
    try {
      await this.backlog.getProject(projectId)
      return true
    } catch {
      return false
    }
  }

  async getPrCustomField (projectId: string): Promise<CustomField | undefined> {
    const fields: Array<CustomField> = await this.backlog.getCustomFields(
      projectId
    )
    const prField: CustomField | undefined = fields.find(
      (field: CustomField) => field.name === PR_FIELD_NAME
    )
    return prField
  }

  async getCurrentPrField (
    issueId: string,
    prFieldId: number
  ): Promise<CustomField> {
    const issue = await this.backlog.getIssue(issueId)
    const prField: CustomField = issue.customFields.find(
      (field: CustomField) => field.id === prFieldId
    )
    return prField
  }

  private get urlRegex (): RegExp {
    return new RegExp(`https://${this.host}/view/(\\w+)-(\\d+)`, 'g')
  }
}
