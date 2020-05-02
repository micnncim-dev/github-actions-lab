import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';

export interface ProcessorOptions {
  githubToken: string;

  labels: string[];

  owner: string;
  repo: string;
  number: number;

  dryRun: boolean;
}

/***
 * Processor handles processing.
 */
export class Processor {
  readonly client: github.GitHub;
  readonly options: ProcessorOptions;

  constructor(options: ProcessorOptions) {
    this.options = options;
    this.client = new github.GitHub(options.githubToken);

    if (this.options.dryRun) {
      core.debug(
        'Running in dry-run mode. Debug output will be written but nothing will be processed.'
      );
    }
  }

  async process(): Promise<void> {
    try {
      let number: number = 0;
      const payload = github.context.payload;

      if (isWebhookPayloadPullRequest(payload)) {
        number = payload.pull_request.number;
      }
      if (isWebhookPayloadIssues(payload)) {
        number = payload.issue.number;
      }
      if (this.options.number !== 0) {
        number = this.options.number;
      }

        if (!this.options.dryRun) {
          this.client.issues.addLabels({
            owner: this.options.owner,
            repo: this.options.repo,
            issue_number: number,
            labels: this.options.labels
          });
        }
    } catch (error) {
      throw error; 
    }
  }
}

function isWebhookPayloadIssues(
  arg: any
): arg is Webhooks.WebhookPayloadIssues {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    arg.issue !== null &&
    typeof arg.issue === 'object' &&
    typeof arg.issue.number === 'number'
  );
}

function isWebhookPayloadPullRequest(
  arg: any
): arg is Webhooks.WebhookPayloadPullRequest {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    arg.pull_request !== null &&
    typeof arg.pull_request === 'object' &&
    typeof arg.pull_request.number === 'number'
  );
}
