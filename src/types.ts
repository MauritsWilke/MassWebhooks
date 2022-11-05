import type { components } from "@octokit/openapi-types/types";
export type Repository = components["schemas"]["repository"];
export type User = components["schemas"]["public-user"];
export type Modes = "Create" | "Delete" | "Test";

export type CustomError = {
	user: {
		response?: {
			data?: {
				message?: string
			}
		}
	}
};