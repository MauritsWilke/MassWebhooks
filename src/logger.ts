import chalk from "chalk";

export class Logger {
	constructor(){}

	success(message:string, log = true){
		const coloured = chalk.greenBright(`> ${message}`)
		if(log) console.log(coloured);
		return coloured
	}

	error(message:string, exit?:number, log = true){
		const coloured = chalk.redBright(`! ${message}`);
		if(log) console.log(coloured);
		if(exit) process.exit(exit);
		else return coloured;
	}

	log(message:string, log = true){
		const coloured = chalk.greenBright(`> ${message}`); 
		if(log) console.log(coloured);
		return coloured;
	}
}