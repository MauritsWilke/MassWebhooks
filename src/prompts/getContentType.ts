import inquirer from "inquirer";

export async function getContentType(): Promise<"json" | "form"> {
	let { event: contentType }: { event: "JSON" | "form" } = await inquirer.prompt({
		name: "event",
		type: "list",
		message: "What content type does the webhook accept? (hint: discord takes JSON)",
		choices: [
			"JSON",
			"form"
		]
	});

	const lowercase: "json" | "form" = contentType.toLowerCase() as any; // TS does not understand that this works yet :/ (https://github.com/microsoft/TypeScript/issues/44268)
	return lowercase;
}