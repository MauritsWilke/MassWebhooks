import inquirer from "inquirer";
import { CustomRepository } from "../types";

export async function getSelectedRepositories(repositories:CustomRepository[]){
    const privateRepos = repositories.filter(v => v.private).map(v => v.name);
    const publicRepos = repositories.filter(v => !v.private).map(v => v.name);

    const { selected }: { selected: string[] } = await inquirer.prompt({
        name: "selected",
        type: "checkbox",
        message: `Select the repositories you want to `,
        choices: [
            { "type": "separator", "line": "📣 Public repositories"},
            ...publicRepos,
            { "type": "separator", "line": "🔐 Private repositories"},
            ...privateRepos
        ]
    });

    return selected;
}