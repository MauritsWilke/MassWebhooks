import type { components } from "@octokit/openapi-types/types";
export type { Octokit } from "@octokit/rest";
export type User = components["schemas"]["public-user"];
export type Repository = components["schemas"]["repository"];
export type Modes = "Create" | "Delete" | "Test";
export type CustomRepository = { name: string, private: boolean };
export type filteredRepo = [repository: CustomRepository, webhooks: number[]]
export type ConfirmationChoice = "Yes" | "No, re-enter information" | "No, exit program";
export type ContentType = "json" | "form";

const Events = {
	"All events (usually best)": "*",
	"Push events": "push",
	"Issue created": "issues",
	"Pull requests": "pull_request",
	"Branch created": "create",
	"Branch deleted": "delete",
	"Forked": "fork",
	"Starred": "watch", // This is correct, https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#watch
	"Starred (also star removed events)": "star",
	"Sponsor added": "sponsorship",
	"Repository is made public": "public",
	"Release added": "release",
	"Package published or updated": "package",
	"Deployment": "deployment"
} as const;

export type EventMap = typeof Events;
export type Event = typeof Events[keyof typeof Events];