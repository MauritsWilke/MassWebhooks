import type { Octokit } from "../types";
import { Styling } from "../styling.js";
const Style = new Styling();

export async function followMau(octokit: Octokit) {
	try {
		await octokit.rest.users.follow({
			username: "MauritsWilke"
		})

		Style.success("Thanks for following me!").log();
	} catch (e) {
		Style.error("Failed to follow me :(   If you want to manually follow me go to https://github.com/MauritsWilke").log();
	}
}