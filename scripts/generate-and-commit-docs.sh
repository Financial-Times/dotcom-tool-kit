#!/bin/bash

set -euo pipefail

git stash --staged --quiet

node ./scripts/generate-docs.js

if ! git diff --quiet --exit-code; then
	git commit -m 'docs: automatically regenerate schema docs' plugins/\*/readme.md

	echo '!! automatically generated documentation has been regenerated and committed. please push again'
	git stash pop
	exit 1
fi

git stash pop
