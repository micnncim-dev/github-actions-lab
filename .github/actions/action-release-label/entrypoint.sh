#!/bin/sh

set -e

event=${INPUT_EVENT}
prefix=${INPUT_LABEL_PREFIX}

if [ "$(echo "${event}" | jq -r '.pull_request.merged')" -ne 'merged' ]; then
    exit 0
fi

label=$(echo "${event}" | jq -r ".pull_request.labels[].name | select(test(\"$prefix(major|minor|patch)\"))")

if [ "$(echo "${label}" | wc -l)" -ne 1 ]; then
    echo "::debug:: multiple release labels not allowed: labels=$(echo "${label}" | tr '\n' ',')"
    exit 1
fi

level=${label#"${prefix}"} # e.g.) 'release/major' => 'major'

echo "::set-output name=level::${level}"
