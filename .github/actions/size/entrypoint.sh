#!/bin/sh

set -e

# Import variables from GitHub Actions inputs.

token=${INPUT_GITHUB_TOKEN}
event=${INPUT_GITHUB_EVENT}

size_xs_label=${INPUT_SIZE_XS_LABEL}
size_s_label=${INPUT_SIZE_S_LABEL}
size_m_label=${INPUT_SIZE_M_LABEL}
size_l_label=${INPUT_SIZE_L_LABEL}
size_xl_label=${INPUT_SIZE_XL_LABEL}
size_xxl_label=${INPUT_SIZE_XXL_LABEL}

size_s_threshold=${INPUT_SIZE_S_THRESHOLD}
size_m_threshold=${INPUT_SIZE_M_THRESHOLD}
size_l_threshold=${INPUT_SIZE_L_THRESHOLD}
size_xl_threshold=${INPUT_SIZE_XL_THRESHOLD}
size_xxl_threshold=${INPUT_SIZE_XXL_THRESHOLD}

# Only handle 'synchronize' action.
if echo "${event}" | jq -r '.action' | grep -Eqv 'synchronize'; then
    exit 0
fi

additions=$(echo "${event}" | jq '.pull_request.additions')
deletions=$(echo "${event}" | jq '.pull_request.deletions')
changes=$((additions + deletions))

# Determine what label will be added according to the number of changes.
label=''
if [ "${changes}" -lt "${size_s_threshold}" ]; then
    label=${size_xs_label}
elif [ "${changes}" -lt "${size_m_threshold}" ]; then
    label=${size_s_label}
elif [ "${changes}" -lt "${size_l_threshold}" ]; then
    label=${size_m_label}
elif [ "${changes}" -lt "${size_xl_threshold}" ]; then
    label=${size_l_label}
elif [ "${changes}" -lt "${size_xxl_threshold}" ]; then
    label=${size_xl_label}
else
    label=${size_xxl_label}
fi

echo "[DEBUG] label=${label}"
echo "[DEBUG] current_label=$(echo "${event}" | jq -r ".pull_request.labels[].name")"

repository=$(echo "${event}" | jq -r '.pull_request.repo.full_name')
number=$(echo "${event}" | jq -r '.pull_request.number')

# Remove the current size label if the desired label is different from it.
current_size_label=$(echo "${event}" | jq -r ".pull_request.labels[].name | select((. == \"$size_xs_label\") or (. == \"$size_s_label\") or (. == \"$size_m_label\") or (. == \"$size_l_label\") or (. == \"$size_xl_label\") or (. == \"$size_xxl_label\"))")
if [ -n "${current_size_label}" ] && [ "${label}" != "${current_size_label}" ]; then
    echo "[DEBUG] DELETE /repos/${repository}/issues/${number}/labels/${current_size_label}"
    curl -s -X DELETE \
        -H "Authorization: token ${token}" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/${repository}/issues/${number}/labels/${current_size_label}"
fi

# Add a new size label.
if [ "${label}" != "${current_size_label}" ]; then
    echo "[DEBUG] POST repos/${repository}/issues/${number}/labels payload=$(printf '{"labels": [%s]}' "${label}")"
    curl -s -X POST \
        -H "Authorization: token ${token}" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/${repository}/issues/${number}/labels" \
        -d "$(printf '{"labels": [%s]}' "${label}")"
fi
