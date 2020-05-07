import * as github from '@actions/github';
import * as core from '@actions/core';
import * as slack from '@slack/web-api';

async function run(): Promise<void> {
  try {
    const client = new slack.WebClient(core.getInput('slack_token'));

    const channel = core.getInput('channel');
    const message = core.getInput('message');
    const username = core.getInput('username');

    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const ref = github.context.ref;
    const workflow = github.context.workflow;

    const number = github.context.issue.number;

    client.chat.postMessage({
      channel,
      text: message,
      blocks: [
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Repository:*\n\`${owner}/${repo}\``
            },
            {
              type: 'mrkdwn',
              text: `*Ref:*\n${ref}`
            },
            {
              type: 'mrkdwn',
              text: `*Workflow:*\n\`${workflow}\``
            },
            {
              type: 'mrkdwn',
              text: `*Number:*\n\`${number}\``
            }
          ]
        }
      ],
      username,
      icon_emoji: ':smile:'
    });
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
