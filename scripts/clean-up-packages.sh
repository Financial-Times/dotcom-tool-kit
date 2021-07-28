#!/bin/bash

for package in packages/*; do
	if [ ! -f "$package/package.json" ]; then
		echo "deleting $package"
		rm -rf "$package"
	fi
done
