import type { Octokit } from "@octokit/core";
import { CustomError, Repository } from "../types.js";

export async function getRepositories(octokit: Octokit):Promise<string[]|CustomError>{
	try {
		const { data: repositories }: { data: Repository[] } = await octokit.request(`GET /user/repos`, {
			per_page: 100,
			affiliation: "owner",
			visibility: "all"
		});
		const repositoryNames = repositories.map(v => v.name);
		return repositoryNames;
	} catch (e: any) {
		const error = e as CustomError;
		return error;
	}
}