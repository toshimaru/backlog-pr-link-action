import "isomorphic-fetch";
import * as es6promise from "es6-promise";
import * as core from '@actions/core';
import * as backlogjs from "backlog-js";
import { context, getOctokit } from '@actions/github';

es6promise.polyfill();

async function main() {
  try {
    const host = core.getInput("backlog-host", { required: true });
    const apiKey = core.getInput("backlog-api-key", { required: true });

    const backlog = new backlogjs.Backlog({ host, apiKey });
    backlog.getSpace().then((data) => {
      core.debug(data);
    });

    if (context.payload.pull_request === undefined) {
      throw new Error(
        "Can't get pull_request payload. Check you trigger pull_request event"
      );
    }
    const { assignees, number, user: { login: author } } = context.payload.pull_request;

    if (assignees.length > 0) {
      core.info(`Assigning author has been skipped since the pull request is already assigned to someone`);
      return;
    }

    await getOctokit(token).issues.addAssignees({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: number,
      assignees: [author]
    });
    core.info(`@${author} has been assigned to the pull request: #${number}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
