import inquirer from "inquirer";
import type { Modes } from "../types";

export async function getMode(){
	const { mode } = await inquirer.prompt({
		name: "mode",
		type: "list",
		message: "What mode do you want to use?",
		choices: [
			"Create: add webhooks to repositories",
			"Delete: delete webhooks from repositories",
			"Test: ping repositories with webhooks"
		]
	});

	const selectedMode:Modes = mode.match(/\w+/)[0]!;

	return selectedMode;
}