#!/bin/sh

set -e

if [ -z "${INPUT_REF}" ]; then
  echo "inputs.ref must not be empty" >&2
  exit 1
fi

readonly tag=${INPUT_REF#refs/tags/}
release_note=$(git-chglog "${tag}")

# Escape string because GitHub Actions currently doesn't escape strings so we
# can't use multi-line strings without such substitution.
release_note=$(echo "${release_note}" | sed -e 's/%/%25/g')
release_note=$(echo "${release_note}" | sed -e 's/$\\n/%0A/g')
release_note=$(echo "${release_note}" | sed -e 's/$\\r/%0D/g')

echo "::set-output name=release_note::${release_note}"
