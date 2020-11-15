import { Commit, lintCommits, formatCommits } from '../src/commit'

const commits: Commit[] = [
  {
    sha: 'b2ad2291efb88cad31ebd0b0c80e8cd6d53333a',
    message: 'invalid message 1',
    url:
      'https://github.com/org/repo/commit/b2ad2291efb88cad31ebd0b0c80e8cd6d53333a'
  },
  {
    sha: 'a2ad2291efb88cad31ebd0b0c80e8cd6d53333a',
    message: 'valid message 1',
    url:
      'https://github.com/org/repo/commit/a2ad2291efb88cad31ebd0b0c80e8cd6d53333a'
  },
  {
    sha: 'd2ad2291efb88cad31ebd0b0c80e8cd6d53333a',
    message: 'invalid message 2',
    url:
      'https://github.com/org/repo/commit/d2ad2291efb88cad31ebd0b0c80e8cd6d53333a'
  }
]

test('lint commits', async () => {
  const re = new RegExp('^valid message \\d')

  const { matchedCommits, unmatchedCommits } = await lintCommits(commits, re)

  expect(matchedCommits).toStrictEqual([commits[1]])
  expect(unmatchedCommits).toStrictEqual([commits[0], commits[2]])
})

test('format commits with markdown', async () => {
  const output = await formatCommits(commits, 'markdown')

  expect(output).toEqual(`- [\`${commits[0].sha.slice(0, 7)}\`](${
    commits[0].url
  }): ${commits[0].message}
- [\`${commits[1].sha.slice(0, 7)}\`](${commits[1].url}): ${commits[1].message}
- [\`${commits[2].sha.slice(0, 7)}\`](${commits[2].url}): ${
    commits[2].message
  }`)
})
