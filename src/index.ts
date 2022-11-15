#!/usr/bin/env node
import { Octokit } from "@octokit/core";

import { getAuthKey, getMode, getSelectedRepositories, getWebhooks } from "./prompts/prompts.js";
import { filterRepositories, getRepositories, getUser } from "./requests/requests.js";
import type { filteredRepos } from "./types"
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

let selectedRepositories :string[] = [];
let filteredRepositories:filteredRepos = [];
if(mode !== "Create"){
	filteredRepositories = await filterRepositories(octokit, user, repositories, webhookURLs)
} else selectedRepositories = await getSelectedRepositories(repositories);