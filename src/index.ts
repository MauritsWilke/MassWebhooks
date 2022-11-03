import chalk from "chalk";

import { getWebhook } from "./getWebhook.js";
import { getAuthKey } from "./getAuthKey.js";

import { Logger } from "./logger.js";
const logger = new Logger();


logger.log("Add webhooks to all of your GitHub repositories!");

const webhookURL = await getWebhook();
if (!webhookURL) logger.error("Please provide a webhook URL!", 1);

const authKey = await getAuthKey();
if (!authKey) logger.error(`Please provide a token!`, 1);



// get user 
// get repositories
// get action

