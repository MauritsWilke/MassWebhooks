import type { Octokit } from "@octokit/core";
import { createSpinner } from "nanospinner";
import { CustomError, Repository } from "../types.js";
import { Styling } from "../styling.js";
const Style = new Styling();

export async function getRepositories(octokit: Octokit):Promise<string[]>{
	let spinner = createSpinner(`${Style.default("Fetching repositories")}`).start();

	try {
		const { data: repositories }: { data: Repository[] } = await octokit.request(`GET /user/repos`, {
			per_page: 100,
			affiliation: "owner",
			visibility: "all"
		});
		const repositoryNames = repositories.map(v => v.name);
		const styledMessage = `${Style.success(`Succesfully fetched all repositories!`, false)}`;
		spinner.success({ text: styledMessage });
		return repositoryNames;
	} catch (err: any) {
		const styledMessage = `${Style.error("Failed to fetch repositories, please try again later", false)}`;
		spinner.error({ text: styledMessage });
		process.exit(1);
	}
}