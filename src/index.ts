#!/usr/bin/env node
import chalk from "chalk";
import { Octokit } from "@octokit/core";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner"
let events: string[];
let contentType: "json" | "form";
let testVerbal: "pings" | "tests";

async function getWebhook(): Promise<string> {
	let { webhook }: { webhook: string } = await inquirer.prompt({
		name: "webhook",
		type: "input",
		message: "Please enter your webhook URL: "
	})
	if (!webhook) {
		console.log(chalk.redBright`! Please provide a webhook URL!`)
		process.exit(1)
	}
	const strAnswer = webhook.toString();
	if (strAnswer.toString().match(/discord.com/) && !strAnswer.toString().endsWith("github")) {
		webhook += "/github"
	}
	return webhook
}

async function getAuthKey(): Promise<string> {
	console.log(chalk.greenBright` > To generate a token, go here: https://github.com/settings/tokens/new?scopes=repo`)
	const { token }: { token: string } = await inquirer.prompt({
		name: "token",
		type: "password",
		mask: "*",
		message: "Please enter your token:"
	})
	if (!token) {
		console.log(chalk.redBright`! Please provide a token!`)
		process.exit(1)
	}
	return token
}

async function getUser() {
	const spinner = createSpinner(chalk.greenBright`> Getting user`).start();
	try {
		const { data: user } = await octokit.request(`GET /user`);
		spinner.success({ text: chalk.greenBright(`Succesfully fetched ${user.login}!`) })
		return user
	} catch (error: any) {
		const errorMessage = error?.response?.data?.message ? "Your token is invalid!" : "Something went wrong trying to fetch the user"
		spinner.error({ text: chalk.redBright(errorMessage) })
		process.exit(1)
	}
}

async function getRepositories() {
	const spinner = createSpinner(chalk.greenBright`> Fetching repositories`).start();
	try {
		const { data: repositories } = await octokit.request(`GET /user/repos`, {
			per_page: 100,
			affiliation: "owner",
			visibility: "all"
		});
		repositories.forEach((v, i, a: Array<any>) => a[i] = v.name);
		spinner.success({ text: chalk.greenBright`Succesfully fetched all repositories!` })
		return repositories
	} catch (e: any) {
		spinner.error({ text: chalk.redBright`Failed to fetch repositories, please try again later` })
		process.exit(1)
	}
}

async function getMode(): Promise<"create" | "delete" | "test"> {
	const { mode }: { mode: "create" | "delete" | "test" } = await inquirer.prompt({
		name: "mode",
		type: "list",
		message: "What mode do you want to use?",
		choices: [
			"create",
			"delete",
			"test"
		]
	})

	return mode
}

async function getEvents(): Promise<string[]> {
	let { event }: { event: "all" | "push" | "*" } = await inquirer.prompt({
		name: "event",
		type: "list",
		message: "What events should trigger the webhook?",
		choices: [
			"all",
			"push"
		]
	})
	if (event === "all") event = "*"
	return [event]
}

async function getContentType(): Promise<"json" | "form"> {
	let { event: contentType }: { event: "json" | "form" } = await inquirer.prompt({
		name: "event",
		type: "list",
		message: "What content type does the webhook accept? (hint: discord takes JSON)",
		choices: [
			"json",
			"form"
		]
	})
	return contentType
}

async function getVerbal(): Promise<boolean> {
	let { verbal }: { verbal: "yes" | "no" } = await inquirer.prompt({
		name: "verbal",
		type: "list",
		message: "Do you want to verbally test? (this will send an event to the webhook)",
		choices: [
			"yes",
			"no"
		]
	})
	return verbal === "yes"
}

async function selectRepos(repositories): Promise<string[]> {
	const { selected }: { selected: string[] } = await inquirer.prompt({
		name: "selected",
		type: "checkbox",
		message: `Select the repositories you want to ${mode} webhooks for:`,
		choices: repositories
	})
	return selected
}

async function createWebhook(repo) {
	const spinner = createSpinner(chalk.greenBright(`> Creating a webhook for ${repo}`)).start()
	try {
		await octokit.request('POST /repos/{owner}/{repo}/hooks', {
			owner: user.login,
			repo: repo,
			name: 'web',
			events: events,
			config: {
				url: webhook,
				content_type: contentType
			}
		})
		spinner.success({ text: chalk.greenBright(`Succesfully created a webhook for ${repo}`) })
	} catch (err: any) {
		if (err?.response?.data?.errors?.[0]?.message === "Hook already exists on this repository") {
			spinner.success({
				text: chalk.yellowBright(`A webhook with this URL already existed for ${repo}!`),
				mark: chalk.yellowBright(`-`)
			})
		}
	}
}

async function deleteWebhook(repo) {
	const spinner = createSpinner(chalk.greenBright(`Deleting the webhook for ${repo}`)).start()
	try {
		const repoID = await hasWebhook(repo);
		if (!repoID) throw new Error()

		await octokit.request('DELETE /repos/{owner}/{repo}/hooks/{hook_id}', {
			owner: user.login,
			repo: repo,
			hook_id: repoID
		})

		spinner.success({ text: chalk.greenBright(`Succesfully deleted the webhook for ${repo}!`) })
	} catch (e) {
		spinner.error({
			text: chalk.redBright(`Failed to delete the webhook for ${repo}, it may no longer exist.\nTo manually delete this webhook, go to https://github.com/${user.login}/${repo}/settings/hooks`)
		})
	}
}

async function testWebhook(repo) {
	const spinner = createSpinner(chalk.greenBright(`> Testing the webhook for ${repo}`)).start()
	try {
		const repoID = await hasWebhook(repo);
		if (!repoID) throw new Error()

		await octokit.request(`POST /repos/{owner}/{repo}/hooks/{hook_id}/${testVerbal}`, {
			owner: user.login,
			repo: repo,
			hook_id: repoID
		})

		const { data: deliveries } = await octokit.request('GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries', {
			owner: user.login,
			repo: repo,
			hook_id: repoID
		})

		if (deliveries[0]?.status === "OK") {
			spinner.success({ text: chalk.greenBright(`Webhook tested succesfully for ${repo}!`) })
		} else throw new Error()
	} catch (e) {
		spinner.error({
			text: chalk.redBright(`Test failed for ${repo}, this likely happened because of the delay in GitHub data updates\nTo manually check the webhook, go to https://github.com/${user.login}/${repo}/settings/hooks`)
		})
	}
}

async function hasWebhook(repo): Promise<number | null> {
	try {
		const { data } = await octokit.request(`GET /repos/{owner}/{repo}/hooks`, {
			owner: user.login,
			repo: repo,
			"per_page": 100
		})
		const hasHook = data.find(hook => hook.config.url === webhook)
		return hasHook ? hasHook.id : null;
	} catch (e) {
		console.log(e)
		return null
	}
}

function finish() {
	console.log(chalk.blueBright`Thanks for using mass-webhooks!`)
	console.log(chalk.blueBright`Consider donating! https://www.mauritswilke.com/donate`)
	process.exit(0)
}

console.log(chalk.greenBright`> Add webhooks to all of your GitHub repositories!`)
const webhook = await getWebhook();
const authKey = await getAuthKey()
const octokit = new Octokit({
	auth: authKey
})

const user = await getUser();
let repositories = await getRepositories();
const mode = await getMode();

if (mode === "test" || mode === "delete") {
	const exists: any[] = []
	const spinner = createSpinner(chalk.greenBright(`> Getting repositories that have the provided webhook`)).start()
	for (const repo of repositories) {
		const hasHook = await hasWebhook(repo);
		if (hasHook) exists.push(repo)
	}
	spinner.success({ text: chalk.greenBright(`Succesfully got all repositories with the provided webhook!`) })
	repositories = exists
}

if (mode === "create") {
	events = await getEvents();
	contentType = await getContentType();
}

if (mode === "test") {
	const verbal = await getVerbal();
	testVerbal = verbal ? "tests" : "pings";
}

if (repositories.length === 0) {
	console.log(chalk.redBright`No repositories found using this webhook! Use the "create" mode to start adding some!`)
	finish()
}

const selectedRepos = await selectRepos(repositories);
for (const repository of selectedRepos) {
	switch (mode) {
		case "create":
			await createWebhook(repository)
			break;
		case "delete":
			await deleteWebhook(repository)
			break;
		case "test":
			await testWebhook(repository)
			break;
	}
}

finish()