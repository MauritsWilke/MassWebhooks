import type { Octokit } from "@octokit/core";
import type { CustomError, User } from "./types";

export async function hasWebhook(octokit:Octokit, user:User, webhookURL:string, repository: string): Promise<number | null > {
	try {
		const { data } = await octokit.request(`GET /repos/{owner}/{repo}/hooks`, {
			owner: user.login,
			repo: repository,
			"per_page": 100
		})

		const hasHook = data.find(hook => hook.config.url === webhookURL);
		return hasHook ? hasHook.id : null;
	} catch (e: unknown) {
		// const error = e as CustomError;
		return null;
	}
}