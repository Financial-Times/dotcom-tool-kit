#!/bin/bash

# third argument for the hook is a flag telling us if this was a branch move or a file checkout
readonly isBranchMove="$3"

if [ "$isBranchMove" = "1" ]; then
	echo "changed branches, cleaning up zombie packages..."
	for package in core/* plugins/* lib/*; do
		if ! [ -f "$package/package.json" ]; then
			echo "deleting $package"
			rm -rf "$package"
		fi
	done
fi
