#!/usr/bin/env node
import { Octokit } from "@octokit/core";
import { createSpinner } from "nanospinner";

import { getWebhook } from "./prompts/getWebhook.js";
import { getAuthKey } from "./prompts/getAuthKey.js";
import { getUser } from "./prompts/getUser.js";
import { getRepositories } from "./prompts/getRepositories.js";
import { hasWebhook } from "./hasWebhook.js";
import { getMode } from "./prompts/getMode.js";
import { getEvents } from "./prompts/getEvents.js";
import { getContentType } from "./prompts/getContentType.js";
import { getSelectedRepositories } from "./prompts/getSelectedRepositories.js";

import { Logger } from "./logger.js";
const logger = new Logger();


logger.log("Add webhooks to all of your GitHub repositories!");


// Webhook URL
const webhooks = await getWebhook();
if (webhooks.length === 0) logger.error("Please provide at least one webhook URL!", 1);


// Auth key
logger.log("To generate a token, go here: https://github.com/settings/tokens/new?scopes=repo");
const authKey = await getAuthKey();
if (!authKey) logger.error(`Please provide a token!`, 1);

const octokit = new Octokit({
	auth: authKey
})


// User
let spinner = createSpinner(logger.log("Getting user", false)).start();
const user = await getUser(octokit);

if("user" in user) {
	const errorMessage = user?.user?.response?.data?.message ? "Your token is invalid!" : "Something went wrong trying to fetch the user";
	spinner.error({ text: logger.error(errorMessage) });
	process.exit(1); // explicitly exiting here instead of using the logger.error() so that TS infers the type to User
} else spinner.success({ text: logger.success(`Succesfully fetched ${user.login}!`, false) });


// Repositories
spinner = createSpinner(logger.log("Fetching repositories", false)).start();
const repositories = await getRepositories(octokit);
if("user" in repositories){
	spinner.error({ text: logger.error(`Failed to fetch repositories, please try again later`, null, false) })
	process.exit(1); // explicitly exiting here because of TS type infering 
}

spinner.success({ text: logger.log(`Succesfully fetched all repositories!`, false) });


// Mode
const mode = await getMode();

const repositoriesWithHook: number[] = []
if (mode === "Test" || mode === "Delete") {
	const spinner = createSpinner(logger.log(`Getting repositories that have the provided webhook`, false)).start()

	for (const repo of repositories) {
		for(const hook of webhooks){
			const hasHook = await hasWebhook(octokit, user, hook, repo);
			if (hasHook) repositoriesWithHook.push(+repo);
		}
	}

	if(repositoriesWithHook.length === 0){
		spinner.error({ text: logger.error("No repositories found using this webhook! Use the \"Create\" mode to start adding some!", null, false)});
		process.exit(1);
	} else spinner.success({ text: logger.log(`Succesfully got all repositories with the provided webhook!`, false) });
}

let events:string[];
let contentType:"json" | "form";
let selectedRepositories:string[] = [];
if (mode === "Create") {
	events = await getEvents();
	contentType = await getContentType();
	selectedRepositories = await getSelectedRepositories(repositories, mode);
}


// Execution
switch(mode){
	case "Create":
		break;
	
	case "Delete":
		break;

	case "Test":
		break;
}