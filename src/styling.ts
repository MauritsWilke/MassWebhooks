import chalk from "chalk";

export class Styling {
	private message: string;
	constructor() {
		this.message = "";
	};

	success = (message: string, icon = true) => {
		this.message = chalk.greenBright(`${icon ? "✓ " : ""}${message}`);
		return this;
	}

	error = (message: string, icon = true) => {
		this.message = chalk.redBright(`${icon ? "! " : ""}${message}`);
		return this;
	}

	warning = (message: string, icon = true) => {
		this.message = chalk.yellowBright(`${icon ? "⚠ " : ""}${message}`);
		return this;
	}

	default = (message: string, icon = true) => {
		this.message = chalk.bold.blueBright(`${icon ? "> " : ""}${message}`);
		return this;
	}

	log() {
		console.log(this.message);
	}

	toString() {
		return this.message;
	}
}