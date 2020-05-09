import * as github from '@actions/github';
import * as core from '@actions/core';
import * as slack from '@slack/web-api';
import {
  SectionBlock,
  MrkdwnElement,
  ChatPostMessageArguments
} from '@slack/web-api';

const colorCodes = new Map<string, string>([
  ['black', '#000000'],
  ['red', '#F44336'],
  ['green', '#4CAF50'],
  ['yellow', '#FFEB3B'],
  ['blue', '#2196F3'],
  ['magenta', '#FF00FF'],
  ['cyan', '#00BCD4'],
  ['white', '#FFFFFF']
]);

async function run(): Promise<void> {
  try {
    const client = new slack.WebClient(core.getInput('slack_token'));

    const channel = core.getInput('channel');
    const message = core.getInput('message');
    const username = core.getInput('username');
    const color = core.getInput('color');

    const verbose = core.getInput('verbose') === 'true';

    const { owner, repo } = github.context.repo;
    const { number } = github.context.issue;
    const { ref, eventName, action, workflow } = github.context;

    const runId = process.env['GITHUB_RUN_ID'];

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
          text: `*Repository:*\n<${repoUrl}|${owner}/${repo}>`
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

    const arg: ChatPostMessageArguments = {
      channel,
      text: '',
      username,
      as_user: true,
      icon_emoji: ':smile:'
    };

    const colorCode = colorCodes.get(color) || color;
    if (colorCode) {
      arg.attachments = [
        {
          color: colorCode,
          blocks
        }
      ];
    } else {
      arg.blocks = blocks;
    }

    client.chat.postMessage(arg);
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
