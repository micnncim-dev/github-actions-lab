#!/bin/sh

set -e

token=${INPUT_GITHUB_TOKEN}
repository=${INPUT_REPOSITORY}
number=${INPUT_NUMBER}

latest_version=$(
    curl -s \
        -H "Authorization: token ${token}" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/${repository}/releases/latest" |
        jq -r '.tag_name'
)

curl -s -X POST \
    -H "Authorization: token ${token}" \
    -H "Content-Type: application/json" \
    "https://api.github.com/repos/${repository}/issues/${number}/comments" \
    -d "$(printf '{ "body": "The actual latest version: v1.1.0, The latest release version of %s: %s" }' "${repository}" "${latest_version}")"
