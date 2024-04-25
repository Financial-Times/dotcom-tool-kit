#!/bin/bash

set -euo pipefail

if git diff --quiet --exit-code && git diff --cached --quiet --exit-code; then
	HAS_CHANGES="no"
else
	HAS_CHANGES="yes"
fi

if [ "$HAS_CHANGES" == "yes" ]; then
	git stash --staged --quiet
fi

node ./scripts/generate-docs.js

if ! git diff --quiet --exit-code; then
	git commit -m 'docs: automatically regenerate schema docs' plugins/\*/readme.md

	echo ''
	echo -e $'\e[31m!! automatically generated documentation has been regenerated and committed. please push again\e[0m'
	echo ''

	if [ "$HAS_CHANGES" == "yes" ]; then
		git stash pop
	fi

	exit 1
fi

if [ "$HAS_CHANGES" == "yes" ]; then
	git stash pop
fi
