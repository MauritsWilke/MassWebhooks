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
		const { data: repos } = await octokit.request('GET /user/repos', {
			per_page: 100,
			affiliation: "owner",
			visibility: webhook?.visibility || "all"
		})
		repos.forEach((v, i, a) => a[i] = v.name);
		const filtered = repos.filter(v => !webhook?.exclude?.includes(v));
		webhook.repos = filtered
	}

	switch (webhook?.mode || config.mode) {
		case 'create': {
			let failed = 0;
			const webhookIDs = {};
			const activeHooks = Object.keys(webhook?.webhookIDs ?? {})
			const repos = webhook.repos.filter(v => !activeHooks.includes(v))
			for (const repo of repos) {
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
					else throw new Error(`Failed to deliver the test ping for ${repo} with id: ${data.id}\n\tThe webhook most likely is still created though.`)

				} catch (e) {
					if (e?.response?.data?.errors?.[0]?.message === "Hook already exists on this repository") {
						const { data: repos } = await octokit.request('GET /repos/{owner}/{repo}/hooks', {
							owner: user.login,
							repo: repo
						})
						const existingRepo = repos.filter(repo => repo.config.url === webhook.url)
						webhookIDs[repo] = existingRepo[0].id;
						console.log(success(` > A webhook with this url already existed for ${repo}. Addded the ID to the config`))
					} else {
						failed++;
						console.log(error(` ! Failed to create a webhook for ${repo}.`))
						console.log(error(`\t${e?.response?.data?.errors?.[0].message || e.message || e}`))
						if (config?.fullLogging) console.log(e)
					}
				}
				webhook.webhookIDs = { ...webhook.webhookIDs, ...webhookIDs }
			}
			console.log(success(` > Successfully added a webhook to ${repos.length - failed} repositories!`))
		} break;

		case "delete": {
			const activeHooks = Object.keys(webhook?.webhookIDs ?? {})
			const repos = webhook.repos.filter(v => activeHooks.includes(v))
			for (const repo of repos) {
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
					console.log(error(`\tTo manually delete this webhook, go to https://github.com/${user.login}/${repo}/settings/hooks`))
					if (config?.fullLogging) console.log(e)
				}
			}

			console.log(success(` > Successfully deleted ${repos.length} webhooks!`))
		} break;

		case 'test': {
			const activeHooks = Object.keys(webhook?.webhookIDs ?? {})
			const repos = webhook.repos.filter(v => activeHooks.includes(v))
			for (const repo of repos) {
				try {
					const testMode = config?.testMode === "tests" ? "tests" : "pings";
					await octokit.request(`POST /repos/{owner}/{repo}/hooks/{hook_id}/${testMode}`, {
						owner: user.login,
						repo: repo,
						hook_id: webhook.webhookIDs[repo]
					})

					const { data: deliveries } = await octokit.request('GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries', {
						owner: user.login,
						repo: repo,
						hook_id: webhook.webhookIDs[repo]
					})

					if (deliveries[0]?.status === "OK") console.log(success(` > Test successfull for ${repo}`))
					else throw new Error(`Failed to deliver the test ping for ${repo} with id: ${webhook.webhookIDs[repo]}`)
				} catch (e) {
					console.log(error(` ! Test failed for ${repo}.\n\tThis likely happened because of the delay in GitHub data updates`))
					console.log(error(`\tTo manually check the webhook, go to https://github.com/${user.login}/${repo}/settings/hooks`))
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

console.log(defaultLog(`\nThanks for using @MauritsWilke/MassWebhooks!`))