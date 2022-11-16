import { createSpinner } from "nanospinner";
import type { filteredRepo, Octokit, User } from "../types.js"
import { Styling } from "../styling.js";
const Style = new Styling();

export async function deleteWebhooks(octokit: Octokit, user: User, repo: filteredRepo) {
	for (const hook of repo[1]) {
		const spinner = createSpinner(`${Style.default(`Deleting a webhook for ${repo[0].name} with ID ${hook}`)}`).start()

		try {
			await octokit.request('DELETE /repos/{owner}/{repo}/hooks/{hook_id}', {
				owner: user.login,
				repo: repo[0].name,
				hook_id: hook
			})

			spinner.success({ text: `${Style.success(`Succesfully deleted the webhook with ID ${hook} for ${repo[0].name}!`, false)}` });
		} catch (e) {
			const errorMessage = Style.error(`Failed to delete the webhook with ID ${hook} for ${repo[0].name}, it may no longer exist.\nTo manually delete this webhook, go to https://github.com/${user.login}/${repo[0].name}/settings/hooks`, false);
			spinner.error({
				text: `${errorMessage}`
			})
		}
	}
}