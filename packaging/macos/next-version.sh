#!/usr/bin/env bash
# Prints the next release version for a build of main.
#
#   git tag -l 'v*' | bash packaging/macos/next-version.sh 0.1.0
#
# The major and minor numbers come from package.json; the patch number counts up by itself:
#   - if v<package.json version> is not tagged yet, that version is used (so bumping package.json to 0.2.0 gives 0.2.0);
#   - otherwise the highest existing v<major>.<minor>.<patch> tag + 1 is used.
# Existing tags are read from stdin, one per line. Other tags (e.g. "latest", "v1.0" branches) are ignored.
set -euo pipefail
PKG="${1:?usage: next-version.sh <package.json version>}"
PKG="${PKG%%[-+]*}"   # drop any pre-release/build part such as -beta.1
[[ "$PKG" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]] || { echo "package.json version '$PKG' is not X.Y.Z" >&2; exit 1; }
MAJOR="${BASH_REMATCH[1]}"; MINOR="${BASH_REMATCH[2]}"; PATCH="${BASH_REMATCH[3]}"
MAX=-1
while IFS= read -r tag || [ -n "$tag" ]; do
  if [[ "$tag" =~ ^v${MAJOR}\.${MINOR}\.([0-9]+)$ ]] && (( BASH_REMATCH[1] > MAX )); then MAX="${BASH_REMATCH[1]}"; fi
done
if (( MAX < PATCH )); then echo "$MAJOR.$MINOR.$PATCH"; else echo "$MAJOR.$MINOR.$((MAX + 1))"; fi
