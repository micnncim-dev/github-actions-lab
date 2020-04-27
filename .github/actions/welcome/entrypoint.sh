#!/bin/bash

set -e

token=${INPUT_GITHUB_TOKEN}
repository=${INPUT_REPOSITORY}
number=${INPUT_NUMBER}
body=${INPUT_BODY}
actor=${INPUT_ACTOR}
trigger=${INPUT_TRIGGER}

if [[ ${body} =~ ${trigger} ]]; then
    curl -X POST \
        -H "Authorization: token ${token}" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/${repository}/issues/${number}/comments" \
        -d "$(printf '{ "body": "Welcome, @%s!" }' "${actor}")"
fi
