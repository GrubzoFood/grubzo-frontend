#!/usr/bin/env bash

if ! command -v node >/dev/null 2>&1 && [ -s "$HOME/.nvm/nvm.sh" ]; then
	# Git hooks often run without loading the interactive shell profile.
	unset npm_config_prefix
	unset PREFIX
	. "$HOME/.nvm/nvm.sh"
	if [ -f ".nvmrc" ]; then
		nvm use --silent >/dev/null
	else
		nvm use --silent default >/dev/null 2>&1 || nvm use --silent node >/dev/null
	fi
fi

if ! command -v npm >/dev/null 2>&1; then
	echo "npm was not found. Install Node.js/npm before running Git hooks." >&2
	exit 127
fi
