import { createSpinner } from "nanospinner";
import type { filteredRepo, Octokit, User } from "../types.js"
import { Styling } from "../styling.js";
const Style = new Styling();
const sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

export async function testWebhooks(octokit: Octokit, user: User, repo: filteredRepo, verbal: boolean) {
	for (const hook of repo[1]) {
		const spinner = createSpinner(`${Style.default(`Testing the webhook with ID ${hook} for ${repo[0].name}`)}`).start();
		const repoInfo = {
			owner: user.login,
			repo: repo[0].name,
			hook_id: hook
		};

		try {
			if (verbal) await octokit.rest.repos.testPushWebhook(repoInfo);
			else await octokit.rest.repos.pingWebhook(repoInfo);

			await sleep(50); // Sleep so deliveries can update

			const { data: deliveries } = await octokit.rest.repos.listWebhookDeliveries(repoInfo);

			if (deliveries[0]?.status === "OK") {
				const styledMessage = Style.success(`Webhook tested succesfully for ${repo[0].name}!`, false);
				spinner.success({ text: `${styledMessage}` });
			} else throw new Error();

		} catch (e) {
			const styledMessage = Style.error(`Test failed for ${repo}, this likely happened because of the delay in GitHub data updates\nTo manually check the webhook, go to https://github.com/${user.login}/${repo[0].name}/settings/hooks`, false);

			spinner.error({
				text: `${styledMessage}`
			});
		}
	}
}