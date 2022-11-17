import inquirer from "inquirer"

export async function getVerbal(): Promise<boolean> {
	let { verbal } = await inquirer.prompt({
		name: "verbal",
		type: "list",
		message: "Do you want to verbally test? (this will send an event to the webhook)",
		choices: [
			"Yes",
			"No"
		]
	});

	return verbal === "Yes";
}