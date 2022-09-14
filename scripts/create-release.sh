#!/bin/bash
set -e

VERSION_PATTERN="[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+"
VERSION_FULL_MATCH_PATTERN="^$VERSION_PATTERN$"

# Verify that argument $1 is a version number.
if ! [[ "$1" =~ $VERSION_FULL_MATCH_PATTERN ]]
then
    echo "An invalid version '$1' was provided"
    exit
fi

# Verify that the `gh` command is installed.
if ! command -v gh &> /dev/null
then
    echo "gh command is required; https://cli.github.com/"
    exit
fi

# Verify that the user is authenticated with GitHub before proceeding.
gh auth status

echo "Pulling latest content from the 'main' branch..."
git checkout main
git pull

echo "Creating branch for new release..."
git checkout -b release/v$1

echo "Incrementing version number in 'README.md' and 'package.json'..."
sed -i "" -E "s/static-website-generator#v$VERSION_PATTERN/static-website-generator#v$1/g" README.md
sed -i "" -E "s/\"version\": \"$VERSION_PATTERN\",/\"version\": \"$1\",/g" package.json
git add README.md package.json
git commit -m "Bump to version $1."

echo "Pushing release branch..."
git push -u origin release/v$1

echo "Creating a pull request..."
gh pr create --title "Release v$1" --body "" --base main --head release/v$1 --label release
