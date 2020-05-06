#!/bin/sh

set -e

github_token=${INPUT_GITHUB_TOKEN}

pull_request=$(
    curl -s \
        -H "Authorization: token ${github_token}" \
        "https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls?state=closed&sort=updated&direction=desc" |
        jq -r ".[] | select(.merge_commit_sha==\"${GITHUB_SHA}\")"
)

title=$(echo "${pull_request}" | jq -r '.title')
body=$(echo "${pull_request}" | jq -r '.body')
number=$(echo "${pull_request}" | jq -r '.number')
labels=$(echo "${pull_request}" | jq -r '.labels[].name')
assignees=$(echo "${pull_request}" | jq -r '.assignees[].login')

echo "::set-output name=title::${title}"
echo "::set-output name=body::${body}"
echo "::set-output name=number::${number}"
echo "::set-output name=labels::${labels}"
echo "::set-output name=assignees::${assignees}"
