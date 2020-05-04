#!/bin/sh

set -e

git fetch --tags
git fetch --prune --unshallow

if [ "${INPUT_ALL_BRANCH}" = 'true' ]; then
    echo "::set-output name=tag::$(git describe --tags "$(git rev-list --tags --max-count=1)")"
    exit 0
fi

branch=$(git rev-parse --abbrev-ref HEAD) # default is current branch
if [ -n "${INPUT_BRANCH}" ]; then
    branch="${INPUT_BRANCH}"
fi

git switch "${branch}"
echo "::set-output name=tag::$(git describe --abbrev=0 --tags)"
