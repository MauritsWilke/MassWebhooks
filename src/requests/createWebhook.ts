import { createSpinner } from "nanospinner"
import type { Octokit, User, Event, ContentType } from "../types.js"
import { Styling } from "../styling.js";
const Style = new Styling();

export async function createWebhook(octokit: Octokit, user: User, repo: string, events: Event[], webhook: string, contentType: ContentType) {
	const spinner = createSpinner(`${Style.default(`Creating a webhook for ${repo}`)}`).start()

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
		spinner.success({ text: `${Style.success(`Succesfully created a webhook for ${repo}!`, false)}` });

	} catch (err: any) {
		if (err?.response?.data?.errors?.[0]?.message === "Hook already exists on this repository") {
			const styledMessage = `${Style.warning(`A webhook with this URL already exists for ${repo}!`)}`.split(/ (.*)/s);
			spinner.stop({
				text: ` ${styledMessage[1]}`,
				mark: styledMessage[0]
			});
		} else {
			const styledMessage = `${Style.error(`Failed to create the webhook for ${repo}!`, false)}`;
			spinner.error({
				text: styledMessage
			})
		}
	}
}