import * as github from '@actions/github';
import * as core from '@actions/core';
import * as slack from '@slack/web-api';
import { SectionBlock, MrkdwnElement } from '@slack/web-api';

async function run(): Promise<void> {
  try {
    const client = new slack.WebClient(core.getInput('slack_token'));

    const channel = core.getInput('channel');
    const message = core.getInput('message');
    const username = core.getInput('username');

    const verbose = core.getInput('verbose') === 'true';

    const { owner, repo } = github.context.repo;
    const { number } = github.context.issue;
    const { ref, eventName, action, workflow } = github.context;

    const runId = process.env['GITHUB_RUN_ID']

    core.debug(`eventName=${eventName}`);
    core.debug(`action=${action}`);

    const repoUrl = `https://github.com/${owner}/${repo}`;

    core.debug(`url=${repoUrl}/runs/${runId}`);

    const blocks: SectionBlock[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message
        }
      }
    ];

    if (verbose) {
      const fields: MrkdwnElement[] = [
        {
          type: 'mrkdwn',
          text: `*Repository:*\n[${owner}/${repo}](${repoUrl})`
        },
        {
          type: 'mrkdwn',
          text: `*Ref:*\n${ref}`
        },
        {
          type: 'mrkdwn',
          text: `*Workflow:*\n${workflow}`
        },
        {
          type: 'mrkdwn',
          text: `*Event:*\n${eventName}`
        },
        {
          type: 'mrkdwn',
          text: `*Action:*\n${action}`
        }
      ];
      if (number) {
        fields.push({
          type: 'mrkdwn',
          text: `*Number:*\n${number}`
        });
      }

      blocks.push({
        type: 'section',
        fields
      });
    }

    client.chat.postMessage({
      channel,
      text: '',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Repository:*\n\`${owner}/${repo}\``
            },
            {
              type: 'mrkdwn',
              text: `*Ref:*\n\`${ref}\``
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
