#!/bin/bash

# Usage example:
# $ bash scripts/release.sh 1.2.3-alpha.1

# Exit on any error
set -e

# Validate input
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <MAJOR>.<MINOR>.<BUG>[-suffix]"
  exit 1
fi

VERSION="$1"

# Check dependencies
if ! command -v jq >/dev/null 2>&1; then
  echo "❌ Error: jq is not installed. Please install it first (read more at https://jqlang.org/download/)."
  exit 1
fi

# Validate version format
# Regex explanation:
# [0-9]+                      => one or more digits (major version)
# \.                          => dot
# [0-9]+                      => one or more digits (minor version)
# \.                          => dot
# [0-9]+                      => one or more digits (patch version)
# (-[a-zA-Z]+(\.[0-9]+)?)?    => optional suffix:
#                                - starts with "-"
#                                - followed by letters only (e.g., alpha, beta)
#                                - optional: a dot followed by digits (e.g., .1)
# $                           => end of string
if [[ ! "$VERSION" =~ [0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z]+(\.[0-9]+)?)?$ ]]; then
  echo "❌ Error: Invalid version format."
  echo "Expected format:"
  echo "  - v<MAJOR>.<MINOR>.<PATCH>"
  echo "  - Optional suffix: -alpha, -beta.1, etc."
  echo "Examples:"
  echo "  ✔ 1.2.3"
  echo "  ✔ 1.2.3-alpha"
  echo "  ✔ 1.2.3-alpha.1"
  echo "  ✖ 1.2.3-"
  echo "  ✖ 1.2.3-alpha."
  exit 1
fi

# Check if in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Error: Not a git repository."
  exit 1
fi

# Sync with remote branch
echo "⬇️ Fetching latest main"
git fetch origin main
git checkout main
git pull --ff-only origin main

# Prevent overwriting an existing tag
if git rev-parse "$VERSION" >/dev/null 2>&1; then
  echo "❌ Error: Tag $VERSION already exists."
  exit 1
fi

# Update `package.json` version
echo "✏️ Setting package.json version to $VERSION"
TMP_FILE=$(mktemp)
jq --arg v "$VERSION" '.version = $v' package.json > "$TMP_FILE" && mv "$TMP_FILE" package.json

# Commit updated `package.json` version
echo "✏️ Commit Updated package.json"
git add package.json

# Don't push a tag if exists already
if git diff --cached --quiet; then
    echo "ℹ️ Skipping commit: package.json already at version $VERSION"
else
    git commit -m "chore(release): bump package.json version to $VERSION"
    git push origin HEAD:main
    echo "✅ Commit pushed to remote."
fi

echo "🚀 Release initiated successfully!"
echo "🔎 Monitor release status in GitHub Actions."
