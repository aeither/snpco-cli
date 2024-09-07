#!/usr/bin/env node

import { Command } from "commander";
import { blue, green, red } from "kolorist";
import ora from "ora";
import prompts from "prompts";

const program = new Command();

program
	.name("awesome-cli")
	.description(
		"A minimal CLI example combining ora, prompts, kolorist, and commander",
	)
	.version("1.0.0");

program
	.command("greet")
	.description("Greet the user")
	.action(async () => {
		const spinner = ora("Preparing to greet...").start();

		await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate some work

		spinner.succeed("Ready to greet!");

		const response = await prompts({
			type: "text",
			name: "name",
			message: "What is your name?",
		});

		if (response.name) {
			console.log(
				green(`Hello, ${blue(response.name)}! Welcome to the awesome CLI.`),
			);
		} else {
			console.log(red("You didn't provide a name. Goodbye!"));
		}
	});

program.parse();
