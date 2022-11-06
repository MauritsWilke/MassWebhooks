import inquirer from "inquirer";

export async function getSelectedRepositories(repositories:string[], mode:string){
	const { repos }: { repos: string[] } = await inquirer.prompt({
		name: "repos",
		type: "checkbox",
		message: `Select the repositories you want to ${mode} webhooks for:`,
		choices: repositories
	});

	return repos
}