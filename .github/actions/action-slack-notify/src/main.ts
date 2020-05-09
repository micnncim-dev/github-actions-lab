import * as github from '@actions/github';
import * as core from '@actions/core';
import * as slack from '@slack/web-api';
import { MrkdwnElement, ChatPostMessageArguments, Block } from '@slack/web-api';

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

    const runId = process.env['GITHUB_RUN_ID'] || '';

    const arg: ChatPostMessageArguments = {
      channel,
      text: message,
      username
    };

    const blocks: Block[] = verbose
      ? await createBlocks(
          owner,
          repo,
          ref,
          eventName,
          action,
          workflow,
          runId,
          number
        )
      : [];

    if (color) {
      arg.attachments = colorCodes.get(color)
        ? [
            {
              color: colorCodes.get(color),
              blocks
            }
          ]
        : [
            {
              color,
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

async function createBlocks(
  owner: string,
  repo: string,
  ref: string,
  event: string,
  action: string,
  workflow: string,
  runId: string,
  number?: number
): Promise<MrkdwnElement[]> {
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const workflowUrl = `${repoUrl}/actions?query=workflow%3A"${workflow}"`;
  const eventUrl = `${repoUrl}/actions?query=event%3A"${event}"`;
  const actionUrl = `${repoUrl}/actions/runs/${runId}`;

  const blocks: MrkdwnElement[] = [
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
      text: `*Workflow:*\n<${workflowUrl}|${workflow}>`
    },
    {
      type: 'mrkdwn',
      text: `*Event:*\n<${eventUrl}|${event}>`
    },
    {
      type: 'mrkdwn',
      text: `*Action:*\n<${actionUrl}|${action}>`
    }
  ];
  if (number) {
    blocks.push({
      type: 'mrkdwn',
      text: `*Number:*\n${number}`
    });
  }

  return blocks;
}

run();
