#!/bin/sh

set -e

event=${INPUT_EVENT}
prefix=${INPUT_LABEL_PREFIX}

# Production requires this condition, but comment it out for test.
# if [ "$(echo "${event}" | jq -r '.pull_request.merged')" -ne 'merged' ]; then
#     exit 0
# fi

label=$(echo "${event}" | jq -r ".pull_request.labels[].name | select(test(\"$prefix(major|minor|patch)\"))")

if [ -z "${label}" ]; then
    echo "::set-output name=level::''"
    echo "::debug:: no release label"
    exit 0
fi

if [ "$(echo "${label}" | wc -l)" -ne 1 ]; then
    echo "::error:: multiple release labels not allowed: labels=$(echo "${label}" | tr '\n' ',')"
    exit 1
fi

level=${label#"${prefix}"} # e.g.) 'release/major' => 'major'

echo "::set-output name=level::${level}"
