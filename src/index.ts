#!/usr/bin/env node
import { Octokit } from "@octokit/rest";

import { getAuthKey, getConfirmation, getContentType, getEvents, getMode, getSelectedRepositories, getThanks, getVerbal, getWebhooks }
	from "./prompts/prompts.js";
import { createWebhook, deleteWebhooks, filterRepositories, starRepo, getRepositories, getUser, testWebhooks, followMau }
	from "./requests/requests.js";
import type { ConfirmationChoice, filteredRepo, Modes } from "./types"
import { Styling } from "./styling.js";
const Style = new Styling();

Style.default("Add webhooks to all of your GitHub repositories!").log();
Style.default("To generate a token, go here: https://github.com/settings/tokens/new?scopes=admin:repo_hook,user:follow,public_repo").log();
const authKey = await getAuthKey();
const octokit = new Octokit({
	auth: authKey
});

const user = await getUser(octokit);
let repositories = await getRepositories(octokit, user);

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
		const verbal = await getVerbal();
		for (const repo of filteredRepositories) {
			await testWebhooks(octokit, user, repo, verbal);
		}
		break;
}

const thanks = await getThanks();
if (thanks.includes("Follow @MauritsWilke on GitHub")) await followMau(octokit);
if (thanks.includes("Star me on GitHub")) await starRepo(octokit);
if (thanks.includes("Get me a donation link!")) Style.default("Donate to me here -> https://www.mauritswilke.com/donate").log();