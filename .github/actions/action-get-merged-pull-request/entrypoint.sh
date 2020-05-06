#!/bin/sh

set -e

github_token=${INPUT_GITHUB_TOKEN}

pull_request=$(
    curl -s \
        -H "Authorization: token ${github_token}" \
        "https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls?state=closed&sort=updated&direction=desc" |
        jq -r ".[] | select(.merge_commit_sha==\"${GITHUB_SHA}\")"
)

echo "::set-output name=pull_request::${pull_request}"
