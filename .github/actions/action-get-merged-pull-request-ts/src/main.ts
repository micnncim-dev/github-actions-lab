import * as github from '@actions/github';
import * as core from '@actions/core';
import * as webhooks from '@octokit/webhooks';

async function run(): Promise<void> {
  try {
    const payload = github.context.payload;

    if (isWebhookPayloadPullRequest(payload)) {
      core.setOutput('title', payload.pull_request.title);
      core.setOutput('body', payload.pull_request.body);
      core.setOutput('number', payload.pull_request.number);
      core.setOutput(
        'labels',
        payload.pull_request.labels.map(l => l.name)
      );
      core.setOutput(
        'assignees',
        payload.pull_request.assignees.map(a => a.login)
      );
    }
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

export function isWebhookPayloadPullRequest(
  arg: any
): arg is webhooks.WebhookPayloadPullRequest {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    arg.pull_request !== null &&
    typeof arg.pull_request === 'object'
  );
}

run();
