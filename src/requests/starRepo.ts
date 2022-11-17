import type { Octokit } from "../types";
import { Styling } from "../styling.js";
const Style = new Styling();

export async function starRepo(octokit: Octokit) {
	try {
		await octokit.activity.starRepoForAuthenticatedUser({
			owner: "MauritsWilke",
			repo: "MassWebhooks"
		})

		Style.success("Thanks for starring the repo!").log();
	} catch (e) {
		Style.error("Failed to star the repo :(   If you want to manually star me go to https://github.com/MauritsWilke/MassWebhooks").log();
	}
}