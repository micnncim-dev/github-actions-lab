#!/bin/sh

set -e

tag=${INPUT_TAG}
message=${INPUT_MESSAGE}

echo "::debug:: GITHUB_ACTOR=${GITHUB_ACTOR}"

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"

git tag -a "${tag}" -m "${message}"
git push origin "${tag}"
