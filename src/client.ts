import 'isomorphic-fetch'
import 'isomorphic-form-data'
import { Backlog } from 'backlog-js'

const PR_FIELD_NAME = 'Pull Request'

export interface CustomField {
  id: number;
  name: string;
  value: string;
}

export class Client {
  host: string;
  backlog: Backlog;

  constructor (host: string, apiKey: string) {
    this.host = host
    this.backlog = new Backlog({ host, apiKey })
  }

  containsBacklogUrl (body: string): boolean {
    return body.includes(`https://${this.host}/view/`)
  }

  parseBacklogUrl (body: string): Array<string> {
    const matchAry = body.match(this.urlRegex)
    if (matchAry == null) return []

    const [url, projectId, issueNo] = matchAry
    return [url, projectId, `${projectId}-${issueNo}`]
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
      (field: any) => field.id === prFieldId
    )
    return prField
  }

  async updatePrField (issueId: string, prUrl: string, currentPrField: CustomField) {
    await this.backlog.patchIssue(issueId, {
      [`customField_${currentPrField.id}`]: `${currentPrField.value}\n${prUrl}`
    })
  }

  get urlRegex (): RegExp {
    return new RegExp(`https://${this.host}/view/(\\w+)-(\\d+)`)
  }
}
