import inquirer from "inquirer";
import type { ContentType } from "../types";

export async function getContentType(): Promise<ContentType> {
	let { event: contentType }: { event: "JSON" | "form" } = await inquirer.prompt({
		name: "event",
		type: "list",
		message: "What content type does the webhook accept? (hint: Discord takes JSON)",
		choices: [
			"JSON",
			"form"
		]
	});

	const lowercase: ContentType = contentType.toLowerCase() as any; // TS does not understand that this works yet :/ (https://github.com/microsoft/TypeScript/issues/44268)
	return lowercase;
}