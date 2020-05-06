import * as github from '@actions/github';
import * as core from '@actions/core';
import * as webhooks from '@octokit/webhooks';

async function run(): Promise<void> {
  try {
    const payload = github.context.payload;

    if (!isWebhookPayloadPush(payload)) {
      return;
    }

    const client = new github.GitHub(core.getInput('github_token'));

    const resp = await client.pulls.list({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      sort: 'updated',
      direction: 'desc',
      state: 'closed',
      per_page: 100
    });

    const pull = resp.data.find(p => p.merge_commit_sha === payload.ref);
    if (!pull) {
      return;
    }

    core.setOutput('title', pull.title);
    core.setOutput('body', pull.body);
    core.setOutput('number', pull.number);
    core.setOutput(
      'labels',
      pull.labels.map(l => l.name)
    );
    core.setOutput(
      'assignees',
      pull.assignees.map(a => a.login)
    );
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

function isWebhookPayloadPush(arg: any): arg is webhooks.WebhookPayloadPush {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof arg.ref === 'string' &&
    typeof arg.before === 'string' &&
    typeof arg.after === 'string'
  );
}

run();
