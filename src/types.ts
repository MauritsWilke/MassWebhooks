import type { components } from "@octokit/openapi-types/types";
export type { Octokit } from "@octokit/core";
export type User = components["schemas"]["public-user"];
export type Repository = components["schemas"]["repository"];
export type Modes = "Create" | "Delete" | "Test";
export type CustomRepository = { name: string, private: boolean };
export type filteredRepo = [repository: CustomRepository, webhooks: number[]]
export type ConfirmationChoice = "Yes" | "No, re-enter information" | "No, exit program";