import type { Octokit } from "@octokit/core";
import { createSpinner } from "nanospinner";
import type { CustomRepository, filteredRepos, User } from "../types.js";
import { hasWebhook } from "./hasWebhook.js";
import { Styling } from "../styling.js";
const Style = new Styling();

export async function filterRepositories(octokit:Octokit, user:User, repositories:CustomRepository[], webhooks:string[]){
	let spinner = createSpinner(`${Style.default("Filtering repositories")}`).start();
	const hasWebhooks:filteredRepos = [];

	try {
		for(const repo of repositories){
			const activeHooks:number[] = [];
			for(let [index, hook] of webhooks.entries()) {
				const hasHook = await hasWebhook(octokit, user, hook, repo.name);
				if(hasHook) activeHooks.push(index);
			}
			if(activeHooks.length > 0) hasWebhooks.push([repo, activeHooks])
		}
	
		const styledMessage = `${Style.success(`Succesfully retrieved all repositories using these webhooks!`, false)}`;
        spinner.success({ text: styledMessage });
		return hasWebhooks;
	} catch {
		const styledMessage = `${Style.error("Failed to fetch repositories, please try again later", false)}`;
        spinner.error({ text: styledMessage });
        process.exit(1);
	}
}