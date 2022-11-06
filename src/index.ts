#!/usr/bin/env node
import { Octokit } from "@octokit/core";

import { getAuthKey, getMode, getSelectedRepositories, getWebhooks } from "./prompts/prompts.js";
import { getRepositories, getUser } from "./requests/requests.js";
import { Styling } from "./styling.js";
const Style = new Styling();

Style.default("Add webhooks to all of your GitHub repositories!").log();
Style.default("To generate a token, go here: https://github.com/settings/tokens/new?scopes=repo").log();
const authKey = await getAuthKey();
const octokit = new Octokit({
	auth: authKey
});

const user = await getUser(octokit);
let repositories = await getRepositories(octokit);
const mode = await getMode();
const webhookURLs = await getWebhooks();
const selectedRepositories = await getSelectedRepositories(repositories);