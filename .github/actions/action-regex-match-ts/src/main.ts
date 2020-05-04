import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    const text = core.getInput('text');
    const regex = core.getInput('regex');

    const re = new RegExp(regex);

    const result = re.exec(text);

    if (result) {
      for (const x of result) {
        const index = result.indexOf(x);
        if (index === 0) {
          core.setOutput('matched', x);
          return;
        }

        core.setOutput(`group${index}`, x);
      }
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
