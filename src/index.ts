#!/usr/bin/env node
import { Octokit } from "@octokit/core";
import { createSpinner } from "nanospinner";

import { getWebhook } from "./getWebhook.js";
import { getAuthKey } from "./getAuthKey.js";

import { Logger } from "./logger.js";
import { getUser } from "./getUser.js";
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

const spinner = createSpinner(logger.log("Getting user", false)).start();
const user = await getUser(octokit);
if(("user" in user)) {
	const errorMessage = user?.user?.response?.data?.message ? "Your token is invalid!" : "Something went wrong trying to fetch the user";
	spinner.error({ text: logger.error(errorMessage) });
	process.exit(1); // explicitly exiting here instead of using the logger.error() so that TS infers the type to User
} else spinner.success({ text: logger.success(`Succesfully fetched ${user.login}!`, false) });



