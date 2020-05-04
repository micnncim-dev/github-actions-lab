#!/bin/sh

set -e

git fetch --tags
git fetch --prune --unshallow

if [ "${INPUT_ALL_BRANCH}" = 'true' ]; then
    echo "::set-output name=tag::$(git describe --tags "$(git rev-list --tags --max-count=1)")"
    exit 0
fi

git switch "${INPUT_BRANCH}"
echo "::set-output name=tag::$(git describe --abbrev=0 --tags)"
