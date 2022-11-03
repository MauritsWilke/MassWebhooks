import chalk from "chalk";

export class Logger {
	constructor(){}

	success(message:string){
		console.log(chalk.greenBright`> ${message}`);
	}

	error(message:string){
		console.log(chalk.redBright`! ${message}`);
	}

	log(message:string){
		console.log(chalk.greenBright`> ${message}`)
	}
}