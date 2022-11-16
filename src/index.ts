#!/usr/bin/env node
import { Octokit } from "@octokit/core";

import { getAuthKey, getConfirmation, getContentType, getEvents, getMode, getSelectedRepositories, getWebhooks } from "./prompts/prompts.js";
import { createWebhook, deleteWebhooks, filterRepositories, getRepositories, getUser } from "./requests/requests.js";
import type { ConfirmationChoice, filteredRepo, Modes } from "./types"
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

let confirmation: ConfirmationChoice = "No, re-enter information";
let mode: Modes = "Create";
let webhookURLs: string[] = [];
let selectedRepositories: string[] = [];
let filteredRepositories: filteredRepo[] = [];
while (confirmation !== "Yes") {
	mode = await getMode();
	webhookURLs = await getWebhooks();

	if (mode !== "Create") {
		filteredRepositories = await filterRepositories(octokit, user, repositories, webhookURLs)
	} else selectedRepositories = await getSelectedRepositories(repositories);

	confirmation = await getConfirmation(mode, selectedRepositories.length || filteredRepositories.length);
	if (confirmation === "No, exit program") process.exit(1);
}

switch (mode) {
	case "Create":
		const contentType = await getContentType();
		const events = await getEvents();
		for (const repo of selectedRepositories) {
			for (const webhook of webhookURLs) {
				await createWebhook(octokit, user, repo, events, webhook, contentType);
			}
		}
		break;
	case "Delete":
		for (const repo of filteredRepositories) {
			await deleteWebhooks(octokit, user, repo);
		}
		break;
	case "Test":
		break;
}