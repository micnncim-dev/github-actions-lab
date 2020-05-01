import * as core from '@actions/core';
import {Processor, ProcessorOptions} from './Processor';

async function run(): Promise<void> {
  try {
    const args = getAndValidateArgs();

    const processor: Processor = new Processor(args);
    processor.process();
  } catch (error) {
    core.error(error);
    core.setFailed(error);
  }
}

function getAndValidateArgs(): ProcessorOptions {
  const args: ProcessorOptions = {
    githubToken: core.getInput('github_token', {required: true}),

    labels: JSON.parse(core.getInput('labels')),

    owner: core.getInput('owner'),
    repo: core.getInput('repo'),
    number: parseInt(core.getInput('number')),

    dryRun: core.getInput('dry_run') === 'true'
  };

  for (const numberInput of ['number']) {
    if (isNaN(parseInt(core.getInput(numberInput)))) {
      throw Error(`input ${numberInput} did not parse to a valid integer`);
    }
  }

  return args;
}

run();
