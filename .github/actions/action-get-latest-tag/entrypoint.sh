#!/bin/sh

set -e

# git fetch --all
git fetch --tags
git fetch --prune --unshallow

if [ "${INPUT_ALL_BRANCH}" = 'true' ]; then
    echo "::set-output name=tag::$(git describe --tags "$(git rev-list --tags --max-count=1)")"
    exit 0
fi

echo "::debug:: GITHUB_REF: ${GITHUB_REF}"
echo "::debug:: git branch --show-current: $(git branch --show-current)"
echo "::debug:: git rev-parse --abbrev-ref HEAD: $(git rev-parse --abbrev-ref HEAD)"

echo "::debug:: git branch: $(git branch)"
echo "::debug:: git branch -a: $(git branch -a)"

branch=$(git rev-parse --abbrev-ref HEAD) # default is current branch

# When the event is pull request one, get current branch from event.
if [ "${branch}" = 'HEAD' ]; then
    branch=$(jq -r '.pull_request.head.ref' "${GITHUB_EVENT_PATH}")
    echo "::debug:: pull_request.head.ref: ${branch}"
fi

# Override branch with inputs.branch if it's specified.
if [ -n "${INPUT_BRANCH}" ]; then
    branch="${INPUT_BRANCH}"
fi

# git switch "${branch}" || git switch "origin/${branch}" -c "${branch}"
git switch "${branch}"

echo "::set-output name=tag::$(git describe --abbrev=0 --tags)"
