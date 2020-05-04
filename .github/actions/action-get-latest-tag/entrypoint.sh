#!/bin/sh

set -e

git fetch --tags
git fetch --prune --unshallow

if [ "${INPUT_ALL_BRANCH}" = 'true' ]; then
    echo "::set-output name=tag::$(git describe --tags "$(git rev-list --tags --max-count=1)")"
    exit 0
fi

echo "::debug:: GITHUB_REF=${GITHUB_REF}"
echo "::debug:: git branch --show-current=$(git branch --show-current)"
echo "::debug:: git rev-parse --abbrev-ref HEAD=$(git rev-parse --abbrev-ref HEAD)"

branch=${GITHUB_REF##*/} # default is current branch
if [ -n "${INPUT_BRANCH}" ]; then
    branch="${INPUT_BRANCH}"
fi

git switch "${branch}"
echo "::set-output name=tag::$(git describe --abbrev=0 --tags)"
