import inquirer from "inquirer";

export async function getWebhooks(): Promise<string[]> {
	let { webhook }: { webhook: string } = await inquirer.prompt({
		name: "webhook",
		type: "input",
		message: "Please enter your webhook URL, you can input several seperated by a space: "
	});

	let webhooks = webhook.split(/\s/g);

	webhooks.forEach((hook, index) => {
		if (hook.match(/discord\.com/) && !hook.endsWith("github")) {
			webhooks[index] = `${hook}/github`;
		}
	})

	webhooks = [...new Set(webhooks)]; // Removing duplicates, no need to do things twice :)

	return webhooks;
}