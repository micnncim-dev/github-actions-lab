import * as github from '@actions/github';
import * as core from '@actions/core';
import {
  WebClient,
  MrkdwnElement,
  ChatPostMessageArguments,
  SectionBlock
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
    const client = new WebClient(core.getInput('slack_token'));

    const channel = core.getInput('channel');
    const message = core.getInput('message');
    const username = core.getInput('username');
    const color = core.getInput('color');

    const verbose = core.getInput('verbose') === 'true';

    const { owner, repo } = github.context.repo;
    const { number } = github.context.issue;
    const { ref, eventName, workflow } = github.context;

    const runId = process.env['GITHUB_RUN_ID'] || '';

    const colorCode = colorCodes.get(color) || color;

    const block = await createMetadataBlock(
      owner,
      repo,
      ref,
      eventName,
      workflow,
      runId,
      number
    );

    const args = await createPostMessageArguments(
      channel,
      message,
      username,
      block,
      verbose,
      colorCode
    );

    client.chat.postMessage(args);
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

async function createPostMessageArguments(
  channel: string,
  message: string,
  username: string,
  block: SectionBlock,
  verbose: boolean,
  colorCode: string
): Promise<ChatPostMessageArguments> {
  const args: ChatPostMessageArguments = {
    channel,
    text: '',
    username,
    link_names: true,
    unfurl_links: true,
    unfurl_media: true
  };

  const colored = colorCode.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    ? true
    : false;

  // verbose && colored -> .text, .attachments[].{color, blocks}
  // verbose && !colored -> .blocks[]
  // !verbose && colored -> .attachments[].{color, text}
  // !verbose && !colored -> .text

  args.text = !verbose && colored ? '' : message;

  args.blocks = verbose && !colored ? [block] : undefined;

  args.attachments = colored
    ? [
        {
          color: colorCode,
          text: verbose ? undefined : message,
          blocks: verbose ? [block] : undefined
        }
      ]
    : undefined;

  return args;
}

async function createMetadataBlock(
  owner: string,
  repo: string,
  ref: string,
  event: string,
  workflow: string,
  runId: string,
  number?: number
): Promise<SectionBlock> {
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const workflowUrl = `${repoUrl}/actions?query=workflow%3A"${workflow}"`;
  const eventUrl = `${repoUrl}/actions?query=event%3A"${event}"`;
  const actionUrl = `${repoUrl}/actions/runs/${runId}`;

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
      text: `*Workflow:*\n<${workflowUrl}|${workflow}>`
    },
    {
      type: 'mrkdwn',
      text: `*Event:*\n<${eventUrl}|${event}>`
    },
    {
      type: 'mrkdwn',
      text: `*Action:*\n<${actionUrl}|Link>`
    }
  ];
  if (number) {
    fields.push({
      type: 'mrkdwn',
      text: `*Number:*\n${number}`
    });
  }

  return {
    type: 'section',
    fields
  };
}

run();
