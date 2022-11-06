import inquirer from "inquirer";

export async function getAuthKey(){
	const { token }: { token: string } = await inquirer.prompt({
		name: "token",
		type: "password",
		mask: "*",
		message: "Please enter your token:"
	});

	return token;
}