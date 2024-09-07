#!/usr/bin/env node

import { Command } from "commander";
import { blue, green, red } from "kolorist";
import fs from "node:fs/promises";
import path from "node:path";
import ora from "ora";

const REPO_URL = "https://raw.githubusercontent.com/aeither/snpco-cli/main";

const program = new Command();

program
  .name("minimal-cli")
  .description("A CLI to easily add pre-existing files to your project")
  .version("1.0.0");

program
  .command("add <file>")
  .description("Add a pre-existing file to your project")
  .action(async (file) => {
    const spinner = ora("Adding file...").start();

    try {
      // Fetch the file content from the remote repository
      const response = await fetch(`${REPO_URL}/lib/${file}.tsx`);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const content = await response.text();

      // Find or create the hooks folder and get the destination path
      const destDir = await findOrCreateHooksFolder(process.cwd());
      const destPath = path.join(destDir, `${file}.tsx`);

      // Write the file to the destination
      await fs.writeFile(destPath, content);

      spinner.succeed(
        green(`Successfully added ${blue(file)} to ${blue(destDir)}`)
      );
    } catch (error: unknown) {
      spinner.fail(
        red(
          `Failed to add file: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
    }
  });

async function findOrCreateHooksFolder(startPath: string): Promise<string> {
  const hooksPath = path.join(startPath, "hooks");
  try {
    await fs.access(hooksPath);
    return hooksPath;
  } catch {
    try {
      // If the hooks folder doesn't exist, create it
      await fs.mkdir(hooksPath);
      return hooksPath;
    } catch (error) {
      throw new Error("Unable to create hooks folder in the current directory");
    }
  }
}

program.parse();
