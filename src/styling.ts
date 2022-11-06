import chalk from "chalk";

export class Styling {
	private message:string;
	constructor(){
		this.message = "";
	};

	success = (message:string) => {
		this.message = chalk.greenBright(`✓ ${message}`);
		return this;
	}

	error = (message:string) => {
		this.message = chalk.redBright(`! ${message}`);
		return this;
	}

	warning = (message:string) => {
		this.message = chalk.yellowBright(`⚠ ${message}`);
		return this;
	}

	default = (message:string) => {
		this.message = chalk.bold.blueBright(`> ${message}`);
		return this;
	}

	log(){
		console.log(this.message);
	}

	toString(){
		return this.message;
	}
}