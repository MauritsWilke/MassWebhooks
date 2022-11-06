import chalk from "chalk";

export class Styling {
	constructor(){};

	success = (message:string) => chalk.greenBright(`✓ ${message}`);

	error = (message:string) => chalk.redBright(`! ${message}`);

	warning = (message:string) => chalk.yellowBright(`⚠ ${message}`);

	default = (message:string) => chalk.bold.blueBright(`> ${message}`);
}