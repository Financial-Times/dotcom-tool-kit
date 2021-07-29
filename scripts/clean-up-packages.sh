#!/bin/bash

readonly oldBranch="$1"
readonly newBranch="$2"
# third argument for the hook is a flag telling us if this was a branch move or a file checkout
readonly isBranchMove="$3"

if [ "$isBranchMove" = "1" ]; then
	echo "moved from $oldBranch to $newBranch, cleaning up zombie packages"
	for package in packages/*; do
		if ! [ -f "$package/package.json" ]; then
			echo "deleting $package"
			rm -rf "$package"
		fi
	done
fi
