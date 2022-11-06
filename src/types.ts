import type { components } from "@octokit/openapi-types/types";
export type User = components["schemas"]["public-user"];

export type CustomError = {
	user: {
		response?: {
			data?: {
				message?: string
			}
		}
	}
};