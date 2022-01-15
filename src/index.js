import config from "./config.json"  assert { type: 'json' };
const webhook = config?.use === "*" ? "*" : config?.webhooks?.[config?.use];
if (!webhook) throw new Error("Please provide a webhook to update or set 'use' to '*'")

import { writeFileSync } from "fs";
import { Octokit } from "@octokit/core";
import chalk from "chalk";

const success = chalk.greenBright;
const error = chalk.redBright;
const defaultLog = chalk.cyan;

const octokit = new Octokit({
	auth: config.key
});

async function main(webhook) {
	if (!config?.mode && !webhook?.mode) throw new Error(`Please provide a mode in config.json`)
	console.log(defaultLog(` > ${webhook?.nickname} - ${webhook?.mode || config.mode}`))
	const { data: user } = await octokit.request("/user");

	const oldConfigRepos = webhook.repos;
	if (webhook.repos === "*") {
		const { data: repos } = await octokit.request('GET /users/{username}/repos', {
			username: user.login,
		})
		repos.forEach((v, i, a) => a[i] = v.name);
		webhook.repos = repos
	}

	// ! DEL
	// webhook.repos = webhook.repos.slice(0, 1);

	switch (webhook?.mode || config.mode) {
		case 'create': {
			const webhookIDs = {};
			for (const repo of webhook.repos) {
				try {
					const { data } = await octokit.request('POST /repos/{owner}/{repo}/hooks', {
						owner: user.login,
						repo: repo,
						name: 'web',
						events: webhook.events,
						config:
						{
							url: webhook.url,
							content_type: "json",
						}
					})
					webhookIDs[repo] = data.id;

					const testMode = config?.testMode === "tests" ? "tests" : "pings";
					await octokit.request(`POST /repos/{owner}/{repo}/hooks/{hook_id}/${testMode}`, {
						owner: user.login,
						repo: repo,
						hook_id: data.id
					})

					const { data: deliveries } = await octokit.request('GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries', {
						owner: user.login,
						repo: repo,
						hook_id: data.id
					})

					if (deliveries[0]?.status === "OK") console.log(success(` > Succesfully created a webhook for ${repo} with id: ${data.id}`))
					else throw new Error(`Failed to deliver the test ping for ${repo} with id: ${data.id}`)
					webhook.webhookIDs = { ...webhook.webhookIDs, ...webhookIDs }
				} catch (e) {
					console.log(error(` ! Failed to create a webhook for ${repo}.`))
					console.log(error(e?.response?.data?.errors?.[0].message || e.message || e))
					if (config?.fullLogging) console.log(e)
				}
			}
		} break;

		case "delete": {
			for (const repo of webhook.repos) {
				try {
					await octokit.request('DELETE /repos/{owner}/{repo}/hooks/{hook_id}', {
						owner: user.login,
						repo: repo,
						hook_id: webhook.webhookIDs[repo]
					})
					console.log(success(` > Succesfully deleted the webhook for ${repo} with id: ${webhook.webhookIDs[repo]}`))
					delete webhook.webhookIDs[repo]
				} catch (e) {
					console.log(error(` ! Failed to delete the webhook for ${repo}, it may no longer exist.`))
					if (config?.fullLogging) console.log(e)
				}
			}
		} break;
	}

	webhook.repos = oldConfigRepos;
	config.webhooks[config.use] = webhook
	writeFileSync("./src/config.json", JSON.stringify(config, null, 4))
}

if (webhook === "*") {
	for (const webhook in config?.webhooks) {
		if (config?.exclude?.includes(+webhook)) continue;
		await main(config.webhooks[webhook]);
	}
} else await main(webhook);

console.log(defaultLog(`\nThanks for using @MauritsWilke/MassWebhooks`))