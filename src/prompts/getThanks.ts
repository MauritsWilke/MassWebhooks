import inquirer from "inquirer"
import { ThanksMode } from "../types";

export async function getThanks(): Promise<ThanksMode[]> {
	let { thanksMode }: { thanksMode: ThanksMode[] } = await inquirer.prompt({
		name: "thanksMode",
		type: "checkbox",
		message: "Thanks for using MassWebhooks! Want to thank me?",
		choices: [
			{ "name": "Star me on GitHub", "checked": true },
			{ "name": "Follow @MauritsWilke on GitHub", "checked": true },
			{ "name": "Get me a donation link!", "checked": true },
		]
	});

	return thanksMode;
}