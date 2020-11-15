import * as github from '@actions/github'
import * as core from '@actions/core'
import { fetchCommits, lintCommits, formatCommits } from './commit'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', { required: true })
    const regex = core.getInput('regex', { required: true })
    const format = core.getInput('format', { required: true })

    const { owner, repo, number } = github.context.issue

    const { commits } = await fetchCommits(githubToken, owner, repo, number)

    const { matchedCommits, unmatchedCommits } = await lintCommits(
      commits,
      new RegExp(regex)
    )

    const matchedCommitsOutput = await formatCommits(matchedCommits, format)
    const unmatchedCommitsOutput = await formatCommits(unmatchedCommits, format)
    core.setOutput(
      'matched_commits',
      // await formatCommits(matchedCommits, format)
      matchedCommitsOutput
    )
    core.setOutput(
      'unmatched_commits',
      // await formatCommits(unmatchedCommits, format)
      unmatchedCommitsOutput
    )
  } catch (e) {
    core.error(e)
    core.setFailed(e.message)
  }
}

run()
