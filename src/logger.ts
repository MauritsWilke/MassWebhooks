import chalk from "chalk";

export class Logger {
	constructor(){}

	success(message:string){
		console.log(chalk.greenBright(`> ${message}`));
	}

	error(message:string, exit?:number){
		console.log(chalk.redBright(`! ${message}`));
		if(exit) process.exit(exit);
	}

	log(message:string){
		console.log(chalk.greenBright(`> ${message}`))
	}
}