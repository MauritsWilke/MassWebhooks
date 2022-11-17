import type { User, Octokit } from "../types";

export async function listWebhooks(octokit: Octokit, user: User, repository: string) {
	try {
		const { data: webhooks } = await octokit.rest.repos.listWebhooks({
			owner: user.login,
			repo: repository,
		})

		return webhooks;
	} catch (e: unknown) {
		return null;
	}
}