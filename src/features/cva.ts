import chalk from 'chalk'
import { writeOrUpdateFile } from '../utils/file.ts'
import { askQuestion } from '../utils/prompt.ts'
import { runInstallCommand } from '../utils/run-command.ts'

const cvaDeps = ['cva@beta', 'tailwind-merge']

const cvaUtilContent = `import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});`

export const setupCVA = async () => {
	console.log(chalk.bgYellow.black('Setting up CVA...'))

	// Run the installation command
	try {
		await runInstallCommand(cvaDeps, false)
	} catch (error) {
		console.error(
			`Error while installing CVA dependencies: ${error instanceof Error ? error.message : String(error)}`
		)
		return
	}

	console.log(chalk.bgGreen.black('CVA installed successfully!'))

	// Prompt the user where to add the cva util file
	const cvaUtilPath = await askQuestion(
		'Where would you like to add the cva util file?',
		'./src/utils/cva.ts'
	)
	writeOrUpdateFile(cvaUtilPath, cvaUtilContent, {
		fileUpdated: `CVA util added to existing file: ${cvaUtilPath}`,
		fileSkipped: `The CVA util file already exists. No changes made.`,
		fileCreated: `New CVA util file created at: ${cvaUtilPath}`,
	})
}
