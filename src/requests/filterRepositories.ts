import { createSpinner } from "nanospinner";
import type { CustomRepository, filteredRepo, User, Octokit } from "../types.js";
import { listWebhooks } from "./listWebhooks.js";
import { Styling } from "../styling.js";
const Style = new Styling();

export async function filterRepositories(octokit: Octokit, user: User, repositories: CustomRepository[], webhooks: string[]) {
	let spinner = createSpinner(`${Style.default("Filtering repositories")}`).start();
	const hasWebhooks: filteredRepo[] = [];

	try {
		for (const repo of repositories) {
			const repoHooks = await listWebhooks(octokit, user, repo.name);
			if (!repoHooks) continue;

			const activeHooks = repoHooks.filter(hook => {
				if (!hook.config?.url) return false;
				return webhooks.includes(hook.config?.url)
			}).map(hook => hook.id)

			if (activeHooks.length > 0) hasWebhooks.push([repo, activeHooks])
		}

		if (hasWebhooks.length === 0) {
			const styledMessage = `${Style.error(`There are no repositories with the given webhooks!`, false)}`;
			spinner.error({ text: styledMessage });
			process.exit(1);
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