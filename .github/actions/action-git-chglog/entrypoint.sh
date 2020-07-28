#!/bin/sh

set -e

if [ -z "${INPUT_REF}" ]; then
  echo "inputs.ref must not be empty" >&2
  exit 1
fi

release_note=$(git-chglog "${INPUT_REF}")
echo "::set-output name=release_note::${release_note}"
