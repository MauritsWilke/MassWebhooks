import inquirer from "inquirer";
import type { ConfirmationChoice } from "../types";

export async function getConfirmation(mode: string, repositoryCount: number) {
	const { confirmation }: { confirmation: ConfirmationChoice } = await inquirer.prompt({
		name: "confirmation",
		type: "list",
		message: `Are you sure you want to "${mode}" webhooks for ${repositoryCount} ${repositoryCount === 1 ? "repository" : "repositories"}`,
		choices: [
			"Yes",
			"No, re-enter information",
			"No, exit program"
		]
	});

	return confirmation;
}