import type { Octokit } from "@octokit/core";
import type { CustomError, User } from "./types.js"

export async function getUser(octokit: Octokit) {
	try {
		const { data: user } = await octokit.request(`GET /user`);
		return user
	} catch (err) {
		const error = err as CustomError;
		return error;
	}
}