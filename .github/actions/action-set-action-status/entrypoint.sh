#!/bin/sh

set -e

case ${INPUT_STATUS} in
'success')
    exit 0
    ;;
'failure')
    exit 1
    ;;
*)
    echo "::error:: invalid inputs.status: ${INPUT_STATUS}"
    exit 1
    ;;
esac
