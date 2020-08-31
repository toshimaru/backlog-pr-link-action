import * as core from '@actions/core';
import { context } from '@actions/github';
import { Client, CustomField } from "./client";

async function main() {
  try {
    const host = core.getInput("backlog-host", { required: true });
    const apiKey = core.getInput("backlog-api-key", { required: true });

    if (context.payload.pull_request === undefined) {
      throw new Error("Can't get pull_request payload. Check you trigger pull_request event");
    }

    const client = new Client(host, apiKey);
    const { html_url: prUrl = "", body = "" } = context.payload.pull_request;
    if (!client.containsBacklogUrl(body)) {
      core.info("Skip process since body doesn't contain backlog URL");
      return;
    }

    const [backlogUrl, projectId, issueId] = client.parseBacklogUrl(body);
    if (backlogUrl === undefined) {
      core.info("Skip process since no backlog URL found");
      return;
    }
    if (!await client.validateProject(projectId)) {
      core.warning(`Invalid ProjectID: ${projectId}`);
      return;
    }
    core.info(`Trying to link the Pull Request to ${backlogUrl}`);

    const prCustomField: CustomField | undefined = await client.getPrCustomField(projectId);
    if (prCustomField === undefined) {
      core.warning(`Skip process since "Pull Request" custom field not found`);
      return;
    }

    let prField: CustomField;
    try {
      prField = await client.getCurrentPrField(issueId, prCustomField.id);
    } catch (error) {
      core.error(error.message)
      core.warning(`Invalid IssueID: ${issueId}`);
      return;
    }

    if (prField.value.includes(prUrl)) {
      core.info(`Pull Request (${prUrl}) is already linked.`);
      return;
    }

    await client.updatePrField(issueId, prUrl, prField);
    core.info(`Pull Request (${prUrl}) has been successfully linked.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
