import inquirer from "inquirer";
import { Styling } from "../styling.js";
const Style = new Styling();

export async function getAuthKey(){
	let authKey:string|null = null;

	while(!authKey){
		const { token }: { token: string|null } = await inquirer.prompt({
			name: "token",
			type: "password",
			mask: "*",
			message: "Please enter your token:"
		});

		if(!token) Style.error("Please provide a token!").log();
		else authKey = token;
	}

	return authKey;
}