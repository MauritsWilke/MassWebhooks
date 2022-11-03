import inquirer from "inquirer";

export async function getWebhook(): Promise<string> {
	let { webhook }: { webhook: string } = await inquirer.prompt({
		name: "webhook",
		type: "input",
		message: "Please enter your webhook URL: "
	})
	const strAnswer = webhook.toString();
	if (strAnswer.toString().match(/discord.com/) && !strAnswer.toString().endsWith("github")) {
		webhook += "/github"
	}
	return webhook
}