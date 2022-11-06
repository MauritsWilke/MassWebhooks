#!/usr/bin/env node
import { Octokit } from "@octokit/core";

import { getAuthKey } from "./prompts/prompts.js";
import { Styling } from "./styling.js";
const Style = new Styling();

console.log(Style.default("Add webhooks to all of your GitHub repositories!"));
console.log(Style.default("To generate a token, go here: https://github.com/settings/tokens/new?scopes=repo"));
const authKey = await getAuthKey();
const octokit = new Octokit({
	auth: authKey
});