#!/bin/sh

set -e

if [ -z "${INPUT_REF}" ]; then
  echo "inputs.ref must not be empty" >&2
  exit 1
fi

readonly tag=${INPUT_REF#refs/tags/}
release_note=$(git-chglog "${tag}")
echo "::set-output name=release_note::${release_note}"
