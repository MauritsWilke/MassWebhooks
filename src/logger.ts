import chalk from "chalk";

// This logger has a "don't log" function because it's also secretly a text styler :L
export class Logger {
	constructor(){}

	success(message:string, log = true){
		const coloured = chalk.greenBright(`> ${message}`)
		if(log) console.log(coloured);
		return coloured
	}

	error(message:string, exit?:number|null, log = true){
		const coloured = chalk.redBright(`! ${message}`);
		if(log) console.log(coloured);
		if(exit !== null) process.exit(exit);
		else return coloured;
	}

	log(message:string, log = true){
		const coloured = chalk.greenBright(`> ${message}`); 
		if(log) console.log(coloured);
		return coloured;
	}
}