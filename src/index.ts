#!/usr/bin/env node
import { Octokit } from "@octokit/core";
import { createSpinner } from "nanospinner";

import { getWebhook } from "./prompts/getWebhook.js";
import { getAuthKey } from "./prompts/getAuthKey.js";
import { getUser } from "./prompts/getUser.js";
import { getRepositories } from "./prompts/getRepositories.js";
import { hasWebhook } from "./hasWebhook.js";

import { Logger } from "./logger.js";
import { getMode } from "./prompts/getMode.js";
import { getEvents } from "./prompts/getEvents.js";
import { getContentType } from "./prompts/getContentType.js";
const logger = new Logger();


logger.log("Add webhooks to all of your GitHub repositories!");

const webhookURL = await getWebhook();
if (!webhookURL) logger.error("Please provide a webhook URL!", 1);

logger.log("To generate a token, go here: https://github.com/settings/tokens/new?scopes=repo");
const authKey = await getAuthKey();
if (!authKey) logger.error(`Please provide a token!`, 1);

const octokit = new Octokit({
	auth: authKey
})

let spinner = createSpinner(logger.log("Getting user", false)).start();
const user = await getUser(octokit);

if("user" in user) {
	const errorMessage = user?.user?.response?.data?.message ? "Your token is invalid!" : "Something went wrong trying to fetch the user";
	spinner.error({ text: logger.error(errorMessage) });
	process.exit(1); // explicitly exiting here instead of using the logger.error() so that TS infers the type to User
} else spinner.success({ text: logger.success(`Succesfully fetched ${user.login}!`, false) });

spinner = createSpinner(logger.log("Fetching repositories", false)).start();
const repositories = await getRepositories(octokit);
if("user" in repositories){
	spinner.error({ text: logger.error(`Failed to fetch repositories, please try again later`, null, false) })
	process.exit(1); // explicitly exiting here because of TS type infering 
}

spinner.success({ text: logger.log(`Succesfully fetched all repositories!`, false) });

const mode = await getMode();

const repositoryWithHook: number[] = []
if (mode === "Test" || mode === "Delete") {
	const spinner = createSpinner(logger.log(`Getting repositories that have the provided webhook`, false)).start()
	for (const repo of repositories) {
		const hasHook = await hasWebhook(octokit, user, webhookURL, repo);
		if (hasHook) repositoryWithHook.push(+repo);
	}
	spinner.success({ text: logger.log(`Succesfully got all repositories with the provided webhook!`, false) });
}

let events:string[];
let contentType:"json" | "form";
if (mode === "Create") {
	events = await getEvents();
	contentType = await getContentType();
}

switch(mode){
	case "Create":
		break;
	
	case "Delete":
		break;

	case "Test":
		break;
}