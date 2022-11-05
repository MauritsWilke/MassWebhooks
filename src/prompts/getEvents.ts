import inquirer from "inquirer";

const eventMap = {
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
};

const choices = Object.keys(eventMap);

export async function getEvents(): Promise<string[]> {
	let events:string[] = [];
	let confirmed = false;

	while(!confirmed){
		let { event }: { event: string[] } = await inquirer.prompt({
			name: "event",
			type: "checkbox",
			message: "What events should trigger the webhook? (default: all)",
			choices: choices
		});
		events = event.map(e => eventMap[e]);
		if(events.length === 0 || events.includes("*")) events = ["*"]; // Default value, and if all is selected -> remove all others.

		const { confirm } = await inquirer.prompt({
			name: "confirm",
			message: `Selected events: ${events.join(", ").replace("*", "all").replace("watch", "starred")}. Confirm?`, // Replacing for clarity
			type: "confirm",
		});
		confirmed = confirm;
	}

	return events;
}