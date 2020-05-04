#!/bin/sh

set -e

git fetch --tags
git fetch --prune --unshallow

if [ "${INPUT_ALL_BRANCH}" = 'true' ]; then
    echo "::set-output name=tag::$(git describe --tags "$(git rev-list --tags --max-count=1)")"
    exit 0
fi

branch=${GITHUB_REF##*/} # default is current branch

# When the event is pull request one, get current branch from event.
if [ "${branch}" = 'HEAD' ]; then
    branch=$(jq '.pull_request.head.ref' "${GITHUB_EVENT_PATH}")
fi

# Override branch with inputs.branch if it's specified.
if [ -n "${INPUT_BRANCH}" ]; then
    branch="${INPUT_BRANCH}"
fi

git switch "${branch}"
echo "::set-output name=tag::$(git describe --abbrev=0 --tags)"
