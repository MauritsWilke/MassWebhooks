import type { User, Octokit } from "../types.js"
import { createSpinner } from "nanospinner";
import { Styling } from "../styling.js";
const Style = new Styling();

export async function getUser(octokit: Octokit): Promise<User> {
	let spinner = createSpinner(`${Style.default("Getting user")}`).start();

	try {
		const { data: user } = await octokit.rest.users.getAuthenticated();

		const styledMessage = `${Style.success(`Succesfully fetched ${user.login}!`, false)}`;
		spinner.success({ text: styledMessage });

		return user

	} catch (err: any) {
		const errorMessage = err?.response?.data?.message === "Bad credentials" ? "Your token is invalid!" : "Something went wrong trying to fetch the user.";
		const styledMessage = `${Style.error(errorMessage, false)}`;
		spinner.error({ text: styledMessage });
		process.exit(1);
	}
}