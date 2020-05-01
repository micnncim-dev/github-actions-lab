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

  process() {
    core.debug(`typeof github.context.payload ${typeof github.context.payload}`);

    this.client.issues.addLabels({
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: this.options.number,
      labels: this.options.labels
    });
  }
}
